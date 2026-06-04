// js/shortlist.js
// ---------------------------------------------------------------------------
// My Shortlist page. Lists the items the signed-in user has shortlisted and
// lets them remove an item (which deletes the matching Firestore document).
// Shortlist entries live in the `shortlists` collection, one per user+item.
// ---------------------------------------------------------------------------

import { requireAuth, wireSignOut } from "./auth.js";
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const list = document.getElementById("shortlist-list");
const status = document.getElementById("status");

requireAuth(async (user) => {
  document.getElementById("user-email").textContent = user.email;
  wireSignOut();
  await loadShortlist(user);
});

async function loadShortlist(user) {
  try {
    // Only this user's shortlist entries.
    const snap = await getDocs(
      query(collection(db, "shortlists"), where("userId", "==", user.uid))
    );
    const entries = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    list.innerHTML = "";
    if (entries.length === 0) {
      showEmpty();
      return;
    }
    status.classList.add("d-none");

    entries.forEach((entry) => list.appendChild(buildRow(entry)));
  } catch (error) {
    console.error("Failed to load shortlist:", error);
    status.textContent =
      "Could not load your shortlist. Check your Firebase config and internet connection.";
    status.classList.remove("d-none");
  }
}

/** Build one list row: thumbnail + name + price, with a Remove button. */
function buildRow(entry) {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex align-items-center justify-content-between gap-3";

  const left = document.createElement("div");
  left.className = "d-flex align-items-center gap-3";

  if (entry.itemImageUrl) {
    const img = document.createElement("img");
    img.src = entry.itemImageUrl;
    img.alt = entry.itemName || "Item";
    img.className = "rounded shortlist-thumb";
    img.addEventListener("error", () => img.remove());
    left.appendChild(img);
  }

  const text = document.createElement("div");
  const name = document.createElement("div");
  name.className = "fw-semibold";
  name.textContent = entry.itemName || "Untitled item";
  text.appendChild(name);

  if (entry.itemPrice) {
    const price = document.createElement("div");
    price.className = "small text-secondary";
    price.textContent = entry.itemPrice;
    text.appendChild(price);
  }
  left.appendChild(text);
  li.appendChild(left);

  // Remove button -> deletes the shortlist document.
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-outline-danger btn-sm";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => removeEntry(entry.id, li, removeBtn));
  li.appendChild(removeBtn);

  return li;
}

async function removeEntry(shortlistId, row, button) {
  button.disabled = true;
  try {
    await deleteDoc(doc(db, "shortlists", shortlistId));
    row.remove();
    // If that was the last item, show the empty-state message again.
    if (list.children.length === 0) {
      showEmpty();
    }
  } catch (error) {
    console.error("Failed to remove from shortlist:", error);
    alert("Could not remove this item. Please try again.");
    button.disabled = false;
  }
}

function showEmpty() {
  status.textContent = "Your shortlist is empty.";
  status.classList.remove("d-none");
}
