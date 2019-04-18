import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { LoginManager, AccessToken } from "react-native-fbsdk";
import ImagePicker from 'react-native-image-picker';
import CommentComponent from './src/components/Comment/Comment';
import LoginComponent from './src/components/Login/Login';
import SharePostComponent from './src/components/SharePost/SharePost';
import { PAGE_TOKEN_KEY, USER_TOKEN_KEY, PAGE_ID_KEY, POST_ID_KEY, IMAGE_URL_KEY } from './src/utils/Constants';

const cloudFunctionUrl = "https://us-central1-rn-course-practi-1553685361491.cloudfunctions.net/uploadImage";

let interval;


export default class App extends Component {
  resetState = callback => {
    return this.setState( 
      {
        didLogin: false, 
        userToken: null,
        pageToken: null,
        pageId: null,
        imagePicked: null,
        imageUploadedUrl: null,
        imagePickedUri: null,
        postId: null,
        comments: null,
        pages: [],
        isDialogVisible: false,
        isLoading: false,
        postText: ""
      },
      callback 
    );
  };


  componentWillMount() {
      this.resetState( () => {
        AsyncStorage.getItem( USER_TOKEN_KEY )
          .then( userToken => {
            if ( userToken !== null && userToken !== "" ){
              console.log( "Found user access token: ", userToken );
              this.setState( {
                userToken
              } );
            }
          } )
          .catch( reason => console.log( "Error occured while getting user access token for: ", reason ) );
      
          AsyncStorage.getItem( PAGE_TOKEN_KEY )
          .then( pageToken => {
            if ( pageToken !== null && pageToken !== "" ){
              console.log( "Found page access token: ", pageToken );
              this.setState( {
                pageToken
              } );
            }
          } )
          .catch( reason => console.log( "Error occured while getting page access token for: ", reason ) );

          AsyncStorage.getItem( PAGE_ID_KEY )
          .then( pageId => {
            if ( pageId !== null && pageId !== "" ){
              console.log( "Found page id: ", pageId );
              this.setState( { pageId } );
            }
          } )
          .catch( reason => console.log( "Error occured while getting page id for: ", reason ) );

          AsyncStorage.getItem( POST_ID_KEY )
          .then( postId => {
            if ( postId !== null && postId !== "" ){
              console.log( "Found post id: ", postId );
              this.setState( 
                { postId },
                this.observeCommentsHandler 
              );
            }
          } )
          .catch( reason => console.log( "Error occured while getting post id for: ", reason ) );
          
          AsyncStorage.getItem( IMAGE_URL_KEY )
          .then( imageUploadedUrl => {
            if ( imageUploadedUrl !== null && imageUploadedUrl !== "" ){
              console.log( "Found image url: ", imageUploadedUrl );
              this.setState( 
                { imageUploadedUrl },
                this.observeCommentsHandler 
              );
            }
          } )
          .catch( reason => console.log( "Error occured while getting image url for: ", reason ) );
        } );

        this.updateLoginState();
  }


  componentWillUnmount() {
    this.endFetchingComments();
  }


  onChangePostText = val => {
    console.log( val );
    this.setState( {
      postText: val
    } );
  }


  endFetchingComments = () => {
    if ( interval ){
      clearInterval( interval );
    }
  };


  updateLoginState = () => {
    AccessToken.getCurrentAccessToken()
      .then( userToken => {
        if ( userToken ) {
          console.log( "user is logged" );
          this.setState( {
            didLogin: true,
            userToken
          } );
        } else {
          console.log( "user is not logged" );
          this.setState( {
            didLogin: false,
            userToken: null
          } );
        }
      } )
      .catch( reason => {
        console.log( "Error occured while checking login state for: ", reason );
        this.setState( {
          didLogin: false,
          userToken: null
        } );
      } )
  }


  storeUserToken = token => {
    this.setState( {
      userToken: token
    } );

    AsyncStorage.setItem( USER_TOKEN_KEY, token );
  };


  storePageToken = token => {
    this.setState( {
      pageToken: token
    } );

    AsyncStorage.setItem( PAGE_TOKEN_KEY, token );
  };


  storePageId = pageId => {
    this.setState( {
      pageId
    } );

    AsyncStorage.setItem( PAGE_ID_KEY, pageId );
  };


  storePageInfo = page => {
    console.log( "page from storePageInfo: ", page );
    const pageAccessToken = page.access_token;
    this.storePageToken( pageAccessToken );
    
    const pageId = page.id;
    this.storePageId( pageId );
  };


  storePostId = postId => {
    this.setState( 
      { postId }, 
      this.observeCommentsHandler 
    );

    AsyncStorage.setItem( POST_ID_KEY, postId );
  };


  storeImageUploadedUrl = imageUploadedUrlFirebase => {
    this.setState( { imageUploadedUrlFirebase } );
    
    AsyncStorage.setItem( IMAGE_URL_KEY, imageUploadedUrlFirebase );
  };


  onLoginFinishedHandler = (error, result) => {
    this.updateLoginState();
    
    if ( error ) {
      console.log("login has error: " + result.error);
    } else if ( result.isCancelled ) {
      console.log("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          let token = data.accessToken.toString();
          this.fetchPagesHandler( token );
          this.storeUserToken( token );
        } )
    }
  };


  onLogoutHandler = () => {
    AsyncStorage.clear();
    this.resetState( this.updateLoginState );
    this.endFetchingComments();
  };


  fetchPagesHandler = (userToken = false) => {
    const calcUserToken = userToken? userToken: this.state.userToken;
    console.log( "user token from fetchPagesHandler: ", calcUserToken );
    fetch( "https://graph.facebook.com/v3.2/me?fields=id,name,accounts&access_token=" + calcUserToken )
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
      const pages = response.accounts.data;
      console.log( "Pages found: ", pages );
    
      if ( pages.length === 0 ) {
        alert( "You do not have Facebook Pages to post" );
        // TODO: handle
      } else if ( pages.length === 1 ) {
        this.storePageInfo( pages[0] );
      } else {
        console.log( "Multiple pages" );
        this.setState( 
          { pages }, 
          () => this.setState( { isDialogVisible: true } )
        );
      }
    } )
    .catch( error => console.log( "error caught: ", error ) );
  };


  pickImageHandler = () => {
    ImagePicker.showImagePicker( {
      title: "Pick the image to be shared",
      maxWidth: 800,
      maxHeight: 800
    }, response => {
      if ( response.error ) {
        alert( "Error encountered: ", response.error );
      } else if ( response.didCancel ) {
        console.log ( "user cancelled" );
      } else {
        this.setState ( {
          imagePicked: response.data,
          imagePickedUri: response.uri
        } );
      }
    } )
  };


  uploadImageToFirebase = () => {
    console.log( "start uploading" );

    if ( this.state.imagePicked === null ) {
      alert( "Pick an image to upload" );
      return null;
    }

    return fetch( cloudFunctionUrl, {
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
        console.log("Error uploading image to firebase");
        throw( new Error() );
      }
    } )
    .then( response => {
      console.log( "success response: ", response );

      const imageUploadedUrlFirebase = response.imageUrl;
      const imageUploadedUrlFacebook = encodeURIComponent( response.imageUrl );
      this.storeImageUploadedUrl( imageUploadedUrlFirebase );
      return imageUploadedUrlFacebook;
    } );
  };


  postImageToPage = ( imageUrl ) => {
    console.log( "start posting" );
    const pageId = this.state.pageId;

    return fetch( "https://graph.facebook.com/" + pageId + "/photos?url=" + imageUrl + "&caption=" + this.state.postText + "&access_token=" + this.state.pageToken, {
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
      this.storePostId( postId );
    } )
  };


  postImageHandler = () => {
    const promise = this.uploadImageToFirebase();
    if ( promise == null ) {
      return;
    }
    this.setState( {
      isLoading: true
    } );

    promise.then( imageUrl => {
      this.setState( {
        isLoading: false
      } );
      return this.postImageToPage( imageUrl );
    } )
    .catch( error => {
      this.setState( {
        isLoading: false
      } );
      alert( "Error occurred while posting your image" );
      console.log( "Error uploading image: ", error );
    } );
  }


  fetchCommentsHandler = () => {
    console.log( "start fetching comments" );
    const postId = this.state.postId;

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
    interval = setInterval( this.fetchCommentsHandler, 3000 );
  };


  dialogOnOk = result => {
    console.log( "selected item: ", result.selectedItem );
    this.setState( {
      isDialogVisible: false
    } );
    
    if ( result.selectedItem ){
      this.storePageInfo( result.selectedItem );
    } else {
      LoginManager.logOut();
    }
  }


  dialogOnCancel = () => { 
    this.setState( { isDialogVisible: false } );
    LoginManager.logOut();
  }

  
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
      this.state.didLogin
      ? <SharePostComponent
          pages = { this.state.pages }
          isDialogVisible = { this.state.isDialogVisible }
          imagePickedUri = { this.state.imagePickedUri }
          imageUploadedUrl = { this.state.imageUploadedUrl }
          isLoading = { this.state.isLoading }
          storePageInfo = { this.storePageInfo }
          pickImageHandler = { this.pickImageHandler }
          postImageHandler = { this.postImageHandler }
          onLoginFinishedHandler = { this.onLoginFinishedHandler }
          onLogoutHandler = { this.onLogoutHandler }
          comments = { comments }
          dialogOnOk = { this.dialogOnOk }
          dialogOnCancel = { this.dialogOnCancel }
          postText = { this.state.postText }
          onChangePostText = { this.onChangePostText }
        />
      : <LoginComponent 
          onLoginFinishedHandler = { this.onLoginFinishedHandler }
          onLogoutHandler = { this.onLogoutHandler }  
        />
        
    );
  }
}
