import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import LoginComponent from './src/components/Login';
import { LoginManager, AccessToken, ShareDialog } from "react-native-fbsdk";

const pageId = "381560922443107";

export default class App extends Component {
  state = {
    userToken: null,
    pageToken: null
  };



  customLoginHandler = () => {
    let that = this;

    LoginManager.logInWithPublishPermissions(["manage_pages", "publish_pages"]).then(
      function(result) {
        console.log( "result: ", result );
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );

          AccessToken.getCurrentAccessToken().then(
            (data) => {
              let token = data.accessToken.toString();
              that.getPageToken( token );
              that.storeUserToken( token );
            }
          )
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
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
  }



  storePageToken = token => {
    this.setState( {
      pageToken: token
    } );
  }



  postHandler = () => {
    console.log( typeof this.state.pageToken );
    fetch( "https://graph.facebook.com/v3.2/" + pageId + "/feed" + "?message=fromApp&access_token=" + this.state.pageToken, {
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
    } )
    .catch( error => console.log( "error caught: ", error ) );
  };


  fetchPostsHandler = () => {
    fetch( "https://graph.facebook.com/v3.2/" + pageId + "/feed" + "?access_token=" + this.state.pageToken )
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
    } )
    .catch( error => console.log( "error caught: ", error ) );
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



  shareLinkWithShareDialog( shareLinkContent ) {
    //var tmp = this;
    ShareDialog.canShow( shareLinkContent ).then(
      function(canShow) {
        if (canShow) {
          return ShareDialog.show( shareLinkContent);
        }
      }
    ).then(
      function(result) {
        console.log( result );
        if (result.isCancelled) {
          console.log('Share cancelled');
        } else {
          console.log('Share success with postId: '
            + result.postId);
        }
      },
      function(error) {
        console.log('Share fail with error: ' + error);
      }
    );
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View  style = { styles.btnContainer }>
          <LoginComponent />
        </View>

        <View style = { styles.btnContainer }>
          <Button
            title = "Login using Facebook"
            onPress = { this.customLoginHandler }
          />
        </View>

        <View style = { styles.btnContainer }>
          <Button
            title = "test posting"
            onPress = { this.postHandler }
          />
        </View>

        <View style = { styles.btnContainer }>
          <Button
            title = "test fetching posts"
            onPress = { this.fetchPostsHandler }
          />
        </View>

        <View style = { styles.btnContainer }>
          <Button
            title = "test fetching pages"
            onPress = { this.fetchPagesHandler }
          />
        </View>
      </View>
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
  btnContainer: {
    margin: 16
  }
});
