import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import DefaultButton from '../DefaultButton/DefaultButton';
import styles from './styles';

const DisplayPost = props => {
    let uri = props.imageUri? props.imageUri: props.imageUrl;
    return(
        <ScrollView contentContainerStyle = { styles.outerContainer }>
            <View style = { styles.container }>
                <DefaultButton
                title = "Post a new image" 
                onPress = { () => { props.updateModeHandler( "posting" ) } }
                />

                { props.postText !== null && props.postText !== ""
                ? <View style = { styles.textWrapper }>
                    <Text style = { styles.text }>
                        { props.postText }
                    </Text>
                </View>
                : null 
                }

                <View style = { styles.imageWrapper }>
                    <Image
                      style = { styles.image } 
                      source = { { uri } } 
                    />
                </View>

                <Text style = { styles.text }>Comments will appear here</Text>

                { props.comments }

                <View style = { styles.btnContainer }>
                    <LoginButton
                        onLoginFinished = { props.onLoginFinished }
                        onLogoutFinished = { props.onLogoutFinished }
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default DisplayPost;
