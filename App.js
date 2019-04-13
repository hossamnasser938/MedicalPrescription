import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import LoginComponent from './src/components/Login';
import { LoginManager, AccessToken } from "react-native-fbsdk";

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
    console.log( "test" );
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Button
          style = { styles.btn }
          title = "Login using Facebook"
          onPress = { this.customLoginHandler }
        />

        <Button
          style = { styles.btn }
          title = "test"
          onPress = { this.testHandler }
        />
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
  btn: {
    margin: 16
  }
});
