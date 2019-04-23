import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import PickImageComponent from '../PickImage/PickImage';
import DefaultButton from '../DefaultButton/DefaultButton';
import PostCaptionComponent from '../PostCaption/PostCaption';
import styles from './styles';

const SharePost = props => (
    <ScrollView contentContainerStyle = { styles.outerContainer }>
        <View style = { styles.container }>
          <View style = { { width: "80%" } }>
            <PostCaptionComponent 
              postText = { props.postText }
              onChangePostText = { props.onChangePostText }
            />
          </View>

          <PickImageComponent 
            pickImageHandler = { props.pickImageHandler }
            imagePickedUri = { props.imagePickedUri }
            imageUploadedUrl = { props.imageUploadedUrl }
          />

          <View style = { styles.btnContainer }>
            { !props.isLoading
            ? <DefaultButton
                title = "Upload Image"
                onPress = { props.uploadImageHandler }
              />
            : <ActivityIndicator />
            }
          </View>
        </View>
      </ScrollView>
);

export default SharePost;