import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Image, Button, Text, AsyncStorage} from 'react-native';
import { LoginButton, AccessToken } from "react-native-fbsdk";
import ImagePicker from 'react-native-image-picker';
import CommentComponent from './src/components/Comment/Comment';

const cloudFunctionUrl = "https://us-central1-rn-course-practi-1553685361491.cloudfunctions.net/uploadImage";

const pageId = "381560922443107";
const postId = "381560922443107_383028292296370";
let interval;


const PAGE_TOKEN_KEY = "PAGE_TOKEN_KEY";
const USER_TOKEN_KEY = "USER_TOKEN_KEY";


export default class App extends Component {
  state = {
    userToken: null,
    pageToken: null,
    imagePickedUri: null,
    imagePicked: null,
    imageUploadedUrl: null,
    postId: null,
    comments: null
  };


  componentWillMount() {
    AsyncStorage.getItem( PAGE_TOKEN_KEY )
      .then( pageToken => {
        if ( pageToken !== null && pageToken !== "" ){
          console.log( "Found page access token" );
          this.setState( {
            pageToken
          } );
        }
      } )
      .catch( reason => console.log( "Error occured while getting page access token for: ", reason ) );

      AsyncStorage.getItem( USER_TOKEN_KEY )
      .then( userToken => {
        if ( userToken !== null && userToken !== "" ){
          console.log( "Found user access token" );
          this.setState( {
            userToken
          } );
        }
      } )
      .catch( reason => console.log( "Error occured while getting user access token for: ", reason ) );
  }


  componentWillUnmount() {
    if ( interval ){
      clearInterval( interval );
    }
  }
  


  getPageToken = ( userToken ) => {
    fetch( "https://graph.facebook.com/" + pageId + "?fields=access_token&access_token=" + userToken )
        .then( res => res.json() )
        .then( response => {
          console.log( "got success: ", response );
          this.storePageToken( response.access_token.toString() );
        } ).catch( ( reason ) => {
          console.log( "failur: ", reason );
        } );
  }



  storeUserToken = token => {
    this.setState( {
      userToken: token
    } );

    AsyncStorage.setItem( USER_TOKEN_KEY, token );
  }



  storePageToken = token => {
    this.setState( {
      pageToken: token
    } );

    AsyncStorage.setItem( PAGE_TOKEN_KEY, token );
  }



  fetchPagesHandler = () => {
    fetch( "https://graph.facebook.com/v3.2/me?fields=id,name,accounts&access_token=" + this.state.userToken )
    .then( res => {
      console.log( "res before parsing: ", res );
      if ( res.ok ) {
        return res.json()
      }
      else {
        throw( new Error() );
      }
    } )
    .then( response => {
      console.log( "success response: ", response );
      // loop through pages returned
      console.log( "Pages found:" );
      const pages = response.accounts.data;
      pages.map( page => console.log( page.name ) );
    } )
    .catch( error => console.log( "error caught: ", error ) );
  };

  

  postLocalImageToPage = () => {
    console.log( "start posting" );
    const imageUrl = this.state.imageUploadedUrl;

    fetch( "https://graph.facebook.com/" + pageId + "/photos?url=" + imageUrl + "&caption=test" + "&access_token=" + this.state.pageToken, {
      method: "POST"
    } )
    .then( res => {
      console.log( "res before parsing: ", res );
      if ( res.ok ) {
        return res.json()
      }
      else {
        throw( new Error() );
      }
    } )
    .then( response => {
      console.log( "success response: ", response );
      const postId = response.post_id;
      console.log( "Post ID: ", postId );
      this.setState( {
        postId: postId
      } );
    } )
    .catch( error => console.log( "error caught: ", error ) );
  };


  pickImageHandler = () => {
    ImagePicker.showImagePicker( {
      title: "Pick the image to be shared"
    }, response => {
      if ( response.error ) {
        alert( "Error encountered: ", response.error );
      } else if ( response.didCancel ) {
        console.log ( "user cancelled" );
      } else {
        this.setState ( {
          imagePickedUri: response.uri,
          imagePicked: response.data
        } );
      }
    } )
  };


  onLoginFinishedHandler = (error, result) => {
    if ( error ) {
      console.log("login has error: " + result.error);
    } else if ( result.isCancelled ) {
      console.log("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          let token = data.accessToken.toString();
          this.getPageToken( token );
          this.storeUserToken( token );
        } )
    }
  }


  imageUploadHandler = () => {
    console.log( "start uploading" );

    fetch( cloudFunctionUrl, {
      method: "POST",
      body: JSON.stringify( {
        image: this.state.imagePicked
      } )
    } )
    .then( res => {
      console.log( "res before parsing: ", res );
      if ( res.ok ) {
        return res.json()
      }
      else {
        throw( new Error() );
      }
    } )
    .then( response => {
      console.log( "success response: ", response );
      
      this.setState( {
        imageUploadedUrl: encodeURIComponent( response.imageUrl )
      } );
    } )
    .catch( error => console.log( "error caught: ", error ) );
  }


  fetchCommentsHandler = () => {
    console.log( "start fetching comments" );
    // const postId = this.state.postId;

    fetch( "https://graph.facebook.com/v3.2/" + postId + "/comments?" +  "access_token=" + this.state.pageToken )
    .then( res => {
      console.log( "res before parsing: ", res );
      if ( res.ok ) {
        return res.json()
      }
      else {
        throw( new Error() );
      }
    } )
    .then( response => {
      console.log( "success response: ", response );
      const comments = response.data;
      this.setState( {
        comments
      } );
    } )
    .catch( error => console.log( "error caught: ", error ) );
  };


  observeCommentsHandler = () => {
    interval = setInterval( this.fetchCommentsHandler, 1000 );
  };

  
  render() {
    let comments = this.state.comments
      ? (
        this.state.comments.map( ( comment, index ) => (
          <CommentComponent
            key = { index }
            userImageUrl = { "https://graph.facebook.com/v3.2/" + comment.from.id + "/picture" }
            userName = { comment.from.name }
            commentMessage = { comment.message }
          />
        ) )
      )
      : null;

    return (
      <ScrollView contentContainerStyle = { {flexGrow: 1} }>
        <View style={styles.container}>
          <TouchableOpacity onPress = { this.pickImageHandler }>
            <View style = { styles.imageContainer }>
              { this.state.imagePickedUri
                ? (
                  <Image style = { styles.image } source = { { uri:  this.state.imagePickedUri } }/>
                )
                : (
                  <Text style = { styles.pickimageText }>
                    Pick Image
                  </Text>
                ) 
              }
            </View>
          </TouchableOpacity>

          <View>
            <LoginButton
              onLoginFinished={ this.onLoginFinishedHandler }
              onLogoutFinished={() => console.log("logout.")}/>
          </View>

          <View style = { styles.btnContainer }>
            <Button
              title = "test fetching pages"
              onPress = { this.fetchPagesHandler }
            />
          </View>

          <View style = { styles.btnContainer }>
            <Button
              title = "test uploading image to firebase storage"
              onPress = { this.imageUploadHandler }
            />
          </View>

          <View style = { styles.btnContainer }>
            <Button
              title = "test posting a locall image to pages"
              onPress = { this.postLocalImageToPage }
            />
          </View>

          <View style = { styles.btnContainer }>
            <Button
              title = "test fetching comments"
              onPress = { this.observeCommentsHandler }
            />
          </View>

          <View>
              { comments }
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  imageContainer:{
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "black"
  },  
  image: {
    width: 200,
    height: 200,
  },
  pickimageText: {
    textAlign: "center"
  },  
  btnContainer: {
    margin: 16
  }
});
