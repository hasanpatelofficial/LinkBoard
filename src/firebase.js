import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// auth persistence ko import kiya
import { getAuth, GoogleAuthProvider, browserSessionPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3eK9nrsCrPBqkQrWrc_vRTHwi4rKucAI",
  authDomain: "linkboard-app.firebaseapp.com",
  projectId: "linkboard-app",
  storageBucket: "linkboard-app.firebasestorage.app",
  messagingSenderId: "539383359798",
  appId: "1:539383359798:web:2b3dd4469b353cd4062b97"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Yeh line ensure karegi ki login state tab tak hi rahe jab tak browser tab khula hai
// Isse "stuck" state ki problem solve ho sakti hai
setPersistence(auth, browserSessionPersistence); 

export const db = getFirestore(app);
export { auth }; // auth ko aese export kiya
export const provider = new GoogleAuthProvider();