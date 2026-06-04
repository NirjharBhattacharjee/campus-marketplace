import { requireAuth, wireSignOut } from "./auth.js";
import { db } from "./firebase.js";
import { createItemCard } from "./cards.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const grid = document.getElementById("items-grid");
const status = document.getElementById("status");

requireAuth(async (user) => {
  document.getElementById("user-email").textContent = user.email;
  wireSignOut();
  await loadMyListings(user);
});

async function loadMyListings(user) {
  try {
    // Only items where sellerId == this user's UID.
    const snap = await getDocs(
      query(collection(db, "items"), where("sellerId", "==", user.uid))
    );
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    grid.innerHTML = "";
    if (items.length === 0) {
      status.textContent = "You haven't listed any items yet.";
      return;
    }
    status.classList.add("d-none");

    items.forEach((item) => grid.appendChild(createItemCard(item)));
  } catch (error) {
    console.error("Failed to load your listings:", error);
    status.textContent =
      "Could not load your listings. Check your Firebase config and internet connection.";
  }
}
