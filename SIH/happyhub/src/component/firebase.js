// src/component/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; // ✅ add Storage


// storage not required for this page, but okay if present

const firebaseConfig = {
  apiKey: "AIzaSyAvt3XUGiPbfK4TbM8CdH_vbX4v4HxElU4",
  authDomain: "mental-8b63a.firebaseapp.com",
  projectId: "mental-8b63a",
  storageBucket: "mental-8b63a.appspot.com",
  messagingSenderId: "576736884343",
  appId: "1:576736884343:web:5dfab6aa95f81204017872",
  measurementId: "G-D1BTQ405LS",
};

const app = initializeApp(firebaseConfig);

// ✅ export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ now available
