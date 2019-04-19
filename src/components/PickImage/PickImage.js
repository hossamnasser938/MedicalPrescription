import React from 'react';
import { View, Image, TouchableOpacity,  } from 'react-native';
import styles from './styles';

const PickImage = props => (
    <TouchableOpacity onPress = { props.pickImageHandler }>
        <View style = { styles.imageContainer }>
            { (props.imagePickedUri || props.imageUploadedUrl)
            ? (
                props.imagePickedUri
                ? <Image style = { styles.image } source = { { uri: props.imagePickedUri } }/>
                : <Image style = { styles.image } source = { { uri: props.imageUploadedUrl } }/>
            )
            : (
                <Image 
                source = { require( "../../../assets/take_photo.png" ) }
                />
            ) 
            }
        </View>
    </TouchableOpacity>
);

export default PickImage;