// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH-GshkOTk-2UQ_S4o-k9cDrS0MsiZ4Ow",
  authDomain: "ergo-8c7f6.firebaseapp.com",
  projectId: "ergo-8c7f6",
  storageBucket: "ergo-8c7f6.appspot.com",
  messagingSenderId: "569167711613",
  appId: "1:569167711613:web:38f835b6a8f4ae266b5014",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const auth = firebase.auth(app);

export { db, auth };
