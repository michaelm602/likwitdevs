// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAM24lLkve3X0yaBhlHgfNx7LZ7UttRXFw",
    authDomain: "likwitdevs-417ee.firebaseapp.com",
    projectId: "likwitdevs-417ee",
    storageBucket: "likwitdevs-417ee.firebasestorage.app",
    messagingSenderId: "669619326357",
    appId: "1:669619326357:web:356366d029b91cb570fa9c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);