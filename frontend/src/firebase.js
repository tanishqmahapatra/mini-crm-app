// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Optional: You can set additional parameters for GoogleAuthProvider if needed
googleProvider.setCustomParameters({
  login_hint: "user@example.com"  // You can pre-fill the login email, for example
});

// Export auth and provider for use in other parts of your application
export { auth, googleProvider };
