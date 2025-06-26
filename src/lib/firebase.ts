
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAs5P8oHlpQLUqbHgTIQCHYoe7M-Hhx3o",
  authDomain: "fitdeed-1f2e2.firebaseapp.com",
  projectId: "fitdeed-1f2e2",
  storageBucket: "fitdeed-1f2e2.firebasestorage.app",
  messagingSenderId: "513223523311",
  appId: "1:513223523311:web:c845ef859677059a88541a",
  measurementId: "G-TBBK27DHX5"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const db = getFirestore(app);const auth = getAuth(app);export { app, db, auth, analytics };
