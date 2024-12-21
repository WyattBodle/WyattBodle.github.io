// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-BtwNTzMI8MHQty9abdh5iMW5yesstpQ",
    authDomain: "cookie-comp.firebaseapp.com",
    projectId: "cookie-comp",
    storageBucket: "cookie-comp.appspot.com", // Corrected domain for Firebase Storage
    messagingSenderId: "805110337773",
    appId: "1:805110337773:web:78c0f5b066aecca89ffce4",
    measurementId: "G-4X0YK07JH4" // Optional, only required for Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services and export them
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Optional: Initialize Analytics only if needed
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);
