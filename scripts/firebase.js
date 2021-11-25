// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3Ud_A-F7OqGPE_6l9oijs0Qe5gF2LcQs",
  authDomain: "projectgame-d83c4.firebaseapp.com",
  projectId: "projectgame-d83c4",
  storageBucket: "projectgame-d83c4.appspot.com",
  messagingSenderId: "976092616727",
  appId: "1:976092616727:web:3684936d9476f3af84a452",
  measurementId: "G-8WHVFNSQKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//right now this one is´nt working, we need to seet up the information that we want to store.
async function users(db) {
    const usersCol = collection(db, 'users');
    const usersSomething = await getDocs(usersCol);
    const users = usersSomething.docs.map(doc => doc.data());
    return users;
  }