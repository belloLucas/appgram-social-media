import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCyfp9QFrwEahaVmWfRfjxJCIhS7fY_x80",
  authDomain: "projeto-instagram-clone-cf909.firebaseapp.com",
  projectId: "projeto-instagram-clone-cf909",
  storageBucket: "projeto-instagram-clone-cf909.appspot.com",
  messagingSenderId: "703607616761",
  appId: "1:703607616761:web:4927dcf4392441264b5e28",
  measurementId: "G-TRBTEKNYET",
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
