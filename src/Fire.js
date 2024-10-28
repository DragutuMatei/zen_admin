// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_measurementId,
  appId: process.env.REACT_APP_apiKey,
  measurementId: process.env.REACT_APP_measurementId,
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
