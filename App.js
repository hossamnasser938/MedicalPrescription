import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import LoginComponent from './src/components/Login';
import { LoginManager, AccessToken, ShareDialog } from "react-native-fbsdk";

export default class App extends Component {
  customLoginHandler = () => {
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
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
              console.log(data.accessToken.toString())
            }
          )
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }
  
  testHandler = () => {
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: "https://facebook.com",
      contentDescription: 'Wow, check out this great site!',
    };

    this.shareLinkWithShareDialog( shareLinkContent );
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
            title = "test"
            onPress = { this.testHandler }
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
