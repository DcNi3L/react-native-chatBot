/* eslint-disable prettier/prettier */
// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBisynZD2dTsyEVbuVcvU5XVzCyrKVp-hU',
  authDomain: 'chatbot-app-react-native.firebaseapp.com',
  projectId: 'chatbot-app-react-native',
  storageBucket: 'chatbot-app-react-native.appspot.com',
  messagingSenderId: '310147272729',
  appId: '1:310147272729:web:d37a7469f7c4b45b429a88',
  measurementId: 'G-Q4VDFSW7HH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export {auth, app};
