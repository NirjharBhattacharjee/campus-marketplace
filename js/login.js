import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const form = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const submitBtn = document.getElementById("login-submit");
const errorBox = document.getElementById("login-error");

// If the user is already signed in, skip the login page and go to Welcome.
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("index.html");
  }
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("d-none");
}

function hideError() {
  errorBox.classList.add("d-none");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showError("Please enter both your email and password.");
    return;
  }

  // Disable the button while we contact Firebase so the form can't double-submit.
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in…";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Success: the onAuthStateChanged handler above redirects to index.html.
    window.location.replace("index.html");
  } catch (error) {
    // Map Firebase's error codes to friendly messages.
    let message = "Sign in failed. Please try again.";
    switch (error.code) {
      case "auth/invalid-email":
        message = "That email address is not valid.";
        break;
      case "auth/user-disabled":
        message = "This account has been disabled.";
        break;
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        message = "Incorrect email or password.";
        break;
      case "auth/too-many-requests":
        message = "Too many attempts. Please wait a moment and try again.";
        break;
    }
    showError(message);
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign In";
  }
});
