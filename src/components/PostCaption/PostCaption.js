import React from 'react';
import { View, Image, TextInput } from 'react-native';
import styles from './styles';

const PostCaption = props => (
    <View style = { styles.container }>
        <View style = { styles.imageContainer }>
            <Image 
                source = { require( "../../../assets/edit.png" ) }
            />
        </View>

        <TextInput 
            style = { styles.TextInput }
            placeholder = "Post Text"
            value = { props.postText }
            onChangeText = { props.onChangePostText }
        />
    </View>
);

export default PostCaption;