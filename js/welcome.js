// js/welcome.js
// ---------------------------------------------------------------------------
// Welcome (landing) page. Greets the signed-in user by email and wires up the
// Sign Out button. Redirects to login.html if nobody is signed in.
// ---------------------------------------------------------------------------

import { requireAuth, wireSignOut } from "./auth.js";

requireAuth((user) => {
  // Show the user's email in the navbar and the welcome hero.
  document.getElementById("user-email").textContent = user.email;
  document.getElementById("welcome-email").textContent = user.email;

  wireSignOut();
});
