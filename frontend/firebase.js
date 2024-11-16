// firebase.js

import firebase from 'firebase/app';
import 'firebase/auth';

// Your Firebase configuration object (Get this from Firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyBMMO-W0SDvmnDjFhlV4Uv71RU2LzuOwZU",
    authDomain: "crm-e0942.firebaseapp.com",
    projectId: "crm-e0942",
    storageBucket: "crm-e0942.firebasestorage.app",
    messagingSenderId: "211089398656",
    appId: "1:211089398656:web:f5cede3e7f6016181c3f65",
    measurementId: "G-N7GQVLTC6X"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export default firebase;
