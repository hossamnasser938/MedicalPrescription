import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import SharePostComponent from './src/components/SharePost/SharePost';
import DisplayPostComponent from './src/components/DisplayPost/DisplayPost';
import { IMAGE_URL_KEY, POST_TEXT_KEY, MODE_KEY } from './src/utils/Constants';

const cloudFunctionUrl = "https://us-central1-rn-course-practi-1553685361491.cloudfunctions.net/uploadImage";

export default class App extends Component {
  resetState = callback => {
    return this.setState( 
      {
        mode: "posting",
        imagePicked: null,
        imageUploadedUrl: null,
        imagePickedUri: null,
        comments: null,
        isLoading: false,
        postText: ""
      },
      callback 
    );
  };


  componentWillMount() {
      this.resetState( () => {
          AsyncStorage.getItem( IMAGE_URL_KEY )
          .then( imageUploadedUrl => {
            if ( imageUploadedUrl !== null && imageUploadedUrl !== "" ){
              console.log( "Found image url: ", imageUploadedUrl );
              this.setState( 
                { imageUploadedUrl }
              );
            }
          } )
          .catch( reason => console.log( "Error occured while getting image url for: ", reason ) );

          AsyncStorage.getItem( POST_TEXT_KEY )
          .then( postText => {
            if ( postText !== null && postText !== "" ){
              console.log( "Found image url: ", postText );
              this.setState( 
                { postText }
              );
            }
          } )
          .catch( reason => console.log( "Error occured while getting post text for: ", reason ) );

          AsyncStorage.getItem( MODE_KEY )
          .then( mode => {
            if ( mode !== null && mode !== "" ){
              console.log( "Found mode : ", mode );
              this.setState( 
                { mode }
              );
            }
          } )
          .catch( reason => console.log( "Error occured while getting mode for: ", reason ) );
        } );
  }


  onChangePostText = val => {
    this.setState( {
      postText: val
    } );
  }


  updateModeHandler = mode => {
    this.setState( {
      mode
    } );

    AsyncStorage.setItem( MODE_KEY, mode );
  };


  storeImageUploadedUrl = imageUploadedUrlFirebase => {
    this.setState( { imageUploadedUrlFirebase } );
    
    AsyncStorage.setItem( IMAGE_URL_KEY, imageUploadedUrlFirebase );
  };


  storePostText = () => {
    AsyncStorage.setItem( POST_TEXT_KEY, this.state.postText );
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

    this.setState( {
      isLoading: "true"
    } );

    fetch( cloudFunctionUrl, {
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

      const imageUploadedUrl = response.imageUrl;
      this.storeImageUploadedUrl( imageUploadedUrl );
      this.updateModeHandler( "posted" );

      this.setState( {
        isLoading: "false"
      } );
    } )
    .catch( error => {
      console.log( "Error ocurred while uploading to firebase:", error );
      alert( "Error ocurred while uploading, please try again later" );

      this.setState( {
        isLoading: "false"
      } );
    } );
  };

  
  render() {
    let content;
    if ( this.state.mode === "posted" ) {
      console.log( "posted screen" );
      content = (
        <DisplayPostComponent
          postText = { this.state.postText }
          imageUri = { this.state.imagePickedUri }
          imageUrl = { this.state.imageUploadedUrl }
          comments = { null } 
          updateModeHandler = { this.updateModeHandler }
        />
      );
    } else {
      console.log( "posting screen" );
      content = (
        <SharePostComponent
            imagePickedUri = { this.state.imagePickedUri }
            imageUploadedUrl = { this.state.imageUploadedUrl }
            isLoading = { this.state.isLoading }
            pickImageHandler = { this.pickImageHandler }
            uploadImageHandler = { this.uploadImageToFirebase }
            postText = { this.state.postText }
            onChangePostText = { this.onChangePostText }
            storePostText = { this.storePostText }
          />
      );
    }

    return ( content );
  }
}
