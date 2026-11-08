
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAB_KE5LqqH5JB1RcdbNTbWx29w5U-WOb0",
  authDomain: "exemplo-2d9d6.firebaseapp.com",
  projectId: "exemplo-2d9d6",
  storageBucket: "exemplo-2d9d6.firebasestorage.app",
  messagingSenderId: "798013137453",
  appId: "1:798013137453:web:123b044b7bb33156ec4ea4",
  measurementId: "G-XP1CDNCLF9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
