import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYvEL-gFZByZf41D9c4QDzx2grRSJwK0Y",
  authDomain: "meetvoice-da50c.firebaseapp.com",
  projectId: "meetvoice-da50c",
  storageBucket: "meetvoice-da50c.firebasestorage.app",
  messagingSenderId: "799627017991",
  appId: "1:799627017991:web:5fa4dc0d3fc1558898cfa2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);