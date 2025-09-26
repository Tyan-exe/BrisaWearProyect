// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXDHea2MijF7eggGJppsd7w_seglpDL7Q",
  authDomain: "proyecto-ecommerce-70066.firebaseapp.com",
  projectId: "proyecto-ecommerce-70066",
  storageBucket: "proyecto-ecommerce-70066.firebasestorage.app",
  messagingSenderId: "173139691094",
  appId: "1:173139691094:web:c1cdee5f022a82ce481df7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;