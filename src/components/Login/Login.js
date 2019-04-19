import React from 'react';
import { View, Image, Text } from 'react-native';
import { LoginButton } from "react-native-fbsdk";
import styles from './styles';

const Login = props => (
    <View style = { styles.container }>
        <View style = { styles.wrapper }>
            <Image 
                source = { require( "../../../assets/prescription.png" ) }
            />
        </View>

        <View style = { styles.wrapper }>
            <Text style = { styles.text }> 
                Login to share your medical prescriptions  
            </Text>
        </View>

        <View style = { styles.wrapper }>
            <LoginButton
                publishPermissions = { ["manage_pages", "publish_pages"] }
                onLoginFinished = { props.onLoginFinishedHandler }
                onLogoutFinished = { props.onLogoutHandler }
            />
        </View>
    </View>
);

export default Login;