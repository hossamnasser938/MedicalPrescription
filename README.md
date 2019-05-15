# MedicalPrescription

## Table of Contents
* [Overview](#Overview)
* [ToolsUsed](#ToolsUsed)
* [Release](#Release)
* [Screenshots](#Screenshots)

## Overview
**MedicalPrescription** is a very small app that is intended to be integrated in another big one. **MedicalPrescription** is intended to be used as a screen in an app that serves pharmacists. It helps pushing a photo of a medical prescription to a public facebook page and then listens on comments on this post. It does that by employing the facebook Api.

## ToolsUsed
* [` react-native-fbsdk `](https://www.npmjs.com/package/react-native-fbsdk)  
A good package that provides facebook **SDK** for ` React Native ` apps. I used it to facilitate facebook login and abstract the overhead of requesting a token, persisting it, and exchanging it when it is about to expire. The package does this for you. However for the part of pushing image to facebook, I used the Graph Api provided by facebook, the [**pages api**](https://developers.facebook.com/docs/pages/) to be precise.
* [` Firebase Cloud Functions `](https://firebase.google.com/docs/functions)  
I used **Firebase cloud funcions** to configure firebase as a server that hosts images to be published to a facebook page since I did not find a way to publish local images to facebook directly. This **firebase cloud function** is not included in this project. Instead I built it in another app and just reused it here. 
* [` react-native-image-picker `](https://www.npmjs.com/package/react-native-image-picker-m)  
A *native* package that facilitates accessing the camera and the gallery to grab an image.
* [` react-native-material-dialog `](https://www.npmjs.com/package/react-native-material-dialog)  
A package that provides a custom dialog for you.
* [` react-native-vector-icons `](https://www.npmjs.com/package/react-native-vector-icons)  
A package that provides thousands of icons for your app.

## Release
The application has been released to the Google App Store and can be found [here](https://play.google.com/store/apps/details?id=com.prescription.medical.hos.eng).

## ScreenShots
* ![](https://github.com/hossamnasser938/MedicalPrescription/blob/master/screenshots/1.png)
* ![](https://github.com/hossamnasser938/MedicalPrescription/blob/master/screenshots/2.png)
* ![](https://github.com/hossamnasser938/MedicalPrescription/blob/master/screenshots/3.png)
* ![](https://github.com/hossamnasser938/MedicalPrescription/blob/master/screenshots/4.png)
* ![](https://github.com/hossamnasser938/MedicalPrescription/blob/master/screenshots/5.png)
* ![](https://github.com/hossamnasser938/MedicalPrescription/blob/master/screenshots/6.png)
