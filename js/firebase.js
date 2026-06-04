// js/firebase.js
// ---------------------------------------------------------------------------
// Central Firebase setup. Every page imports `auth` and `db` from here so the
// app is only initialised once. Uses the Firebase v11 modular SDK loaded from
// the gstatic CDN (no build step / bundler required - works with Live Server).
// ---------------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ===========================================================================
// TODO: Paste YOUR Firebase web app config here.
// Firebase Console -> Project settings (gear icon) -> "Your apps" -> Web app
// -> "SDK setup and configuration" -> Config. See FIREBASE-SETUP.md for steps.
// ===========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDyv_Mg4imhv46X4MuEbmb9Ys1-YpAp8G4",
  authDomain: "comp2750-7e98d.firebaseapp.com",
  projectId: "comp2750-7e98d",
  storageBucket: "comp2750-7e98d.firebasestorage.app",
  messagingSenderId: "248442885021",
  appId: "1:248442885021:web:c800ebb925c25d7bcd5574",
};

// Initialise Firebase once and share these handles across every page.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

