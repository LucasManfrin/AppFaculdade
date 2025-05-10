// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQko9j_Sm0l4LLx8Sxg7p1_Ys4yaD189w",
  authDomain: "app-familia-dd8bb.firebaseapp.com",
  projectId: "app-familia-dd8bb",
  storageBucket: "app-familia-dd8bb.firebasestorage.app",
  messagingSenderId: "929538948981",
  appId: "1:929538948981:web:5d6b0f90d37ad789badd3c",
  measurementId: "G-YEBQPXQBNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);