import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

