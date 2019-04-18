import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import PickImageComponent from '../PickImage/PickImage';
import DefaultButton from '../DefaultButton/DefaultButton';
import PostCaptionComponent from '../PostCaption/PostCaption';
import styles from './styles';

const SharePost = props => (
    <ScrollView contentContainerStyle = { styles.outerContainer }>
        <View style = { styles.container }>
          <SinglePickerMaterialDialog 
            title = "Please Select the Page you want to post to"
            items = { props.pages.map( ( item, index ) => ( { value: index, label: item.name, access_token: item.access_token, id: item.id } ) ) }
            visible = { props.isDialogVisible }
            onCancel = { props.dialogOnCancel }
            onOk = { props.dialogOnOk }
          />

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
                title = "Post Image"
                onPress = { props.postImageHandler }
              />
            : <ActivityIndicator />
            }
          </View>

          { !props.isLoading
          ? <View>
              <LoginButton
                onLoginFinished = { props.onLoginFinishedHandler }
                onLogoutFinished = { props.onLogoutHandler }/>
            </View>
          : null  
          }

          <View>
              { props.comments }
          </View>
        </View>
      </ScrollView>
);

export default SharePost;