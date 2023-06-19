// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzsEnY99gjjYmVEv3MXOLFb038l9T-wUs",
  authDomain: "instagramapp-a44b3.firebaseapp.com",
  projectId: "instagramapp-a44b3",
  storageBucket: "instagramapp-a44b3.appspot.com",
  messagingSenderId: "45003107996",
  appId: "1:45003107996:web:529722aaba62b5b4004759",
  measurementId: "G-Q0W6NGT137",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
