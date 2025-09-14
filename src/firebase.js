// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore ko import kiya

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3eK9nrsCrPBqkQrWrc_vRTHwi4rKucAI",
  authDomain: "linkboard-app.firebaseapp.com",
  projectId: "linkboard-app",
  storageBucket: "linkboard-app.firebasestorage.app",
  messagingSenderId: "539383359798",
  appId: "1:539383359798:web:2b3dd4469b353cd4062b97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
// Hum is 'db' variable ko apne poore app mein istemal karenge
export const db = getFirestore(app);