// Import the functions you need from the SDKs you need


const firebaseConfig = {
  apiKey: "AIzaSyBQko9j_Sm0l4LLx8Sxg7p1_Ys4yaD189w",
  authDomain: "app-familia-dd8bb.firebaseapp.com",
  projectId: "app-familia-dd8bb",
  storageBucket: "app-familia-dd8bb.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "929538948981",
  appId: "1:929538948981:web:5d6b0f90d37ad789badd3c",
  measurementId: "G-YEBQPXQBNQ",
}

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
export { signInWithEmailAndPassword } from 'firebase/auth';