import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Nayi lines

const firebaseConfig = {
  apiKey: "AIzaSyB3eK9nrsCrPBqkQrWrc_vRTHwi4rKucAI",
  authDomain: "linkboard-app.firebaseapp.com",
  projectId: "linkboard-app",
  storageBucket: "linkboard-app.firebasestorage.app",
  messagingSenderId: "539383359798",
  appId: "1:539383359798:web:2b3dd4469b353cd4062b97"
};

const app = initializeApp(firebaseConfig);

// Ab hum 3 cheezein export karenge
export const db = getFirestore(app);
export const auth = getAuth(app); // Authentication service
export const provider = new GoogleAuthProvider(); // Google login provider