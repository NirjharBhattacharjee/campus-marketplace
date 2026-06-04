import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

/**
 * Guard a protected page. If nobody is signed in, send them to the login page.
 * If a user IS signed in, run `onUser(user)` so the page can load its data.
 * @param {(user: import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js").User) => void} onUser
 */
export function requireAuth(onUser) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Not signed in -> block access to this page.
      window.location.replace("login.html");
      return;
    }
    if (typeof onUser === "function") {
      onUser(user);
    }
  });
}

/**
 * Wire up a Sign Out button. Clicking it signs out of Firebase and redirects
 * back to the login page.
 * @param {string} selector CSS selector for the sign-out button (default ".signout-btn")
 */
export function wireSignOut(selector = ".signout-btn") {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.replace("login.html");
      } catch (error) {
        console.error("Sign out failed:", error);
        alert("Could not sign out. Please try again.");
      }
    });
  });
}
