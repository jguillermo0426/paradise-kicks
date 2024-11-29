// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS-id0M2ipafv16A6F-nOK6aAlJvxnWL4",
  authDomain: "paradise-kicks-d5ab5.firebaseapp.com",
  projectId: "paradise-kicks-d5ab5",
  storageBucket: "paradise-kicks-d5ab5.appspot.com",
  messagingSenderId: "1014590750387",
  appId: "1:1014590750387:web:eff15a1ffe7f8f128abac6",
  measurementId: "G-6FWY43D5YK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {storage};