import { requireAuth, wireSignOut } from "./auth.js";
import { db } from "./firebase.js";
import { createItemCard, formatPrice } from "./cards.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const grid = document.getElementById("items-grid");
const status = document.getElementById("status");

requireAuth(async (user) => {
  document.getElementById("user-email").textContent = user.email;
  wireSignOut();
  await loadMarketplace(user);
});

async function loadMarketplace(user) {
  try {
    // 1. Which items has this user already shortlisted? (to disable those buttons)
    const shortlistSnap = await getDocs(
      query(collection(db, "shortlists"), where("userId", "==", user.uid))
    );
    const shortlistedIds = new Set(
      shortlistSnap.docs.map((d) => d.data().itemId)
    );

    // 2. Load all items, then drop the signed-in user's own listings.
    const itemsSnap = await getDocs(collection(db, "items"));
    const items = itemsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((item) => item.sellerId !== user.uid);

    // 3. Render.
    grid.innerHTML = "";
    if (items.length === 0) {
      status.textContent = "No items are available right now.";
      return;
    }
    status.classList.add("d-none");

    items.forEach((item) => {
      const button = buildShortlistButton(
        item,
        user,
        shortlistedIds.has(item.id)
      );
      grid.appendChild(createItemCard(item, button));
    });
  } catch (error) {
    console.error("Failed to load marketplace:", error);
    status.textContent =
      "Could not load items. Check your Firebase config and internet connection.";
  }
}

/** Build the Shortlist button for a card, reflecting whether it's already saved. */
function buildShortlistButton(item, user, alreadyShortlisted) {
  const button = document.createElement("button");
  button.type = "button";

  if (alreadyShortlisted) {
    markAsShortlisted(button);
    return button;
  }

  button.className = "btn btn-primary";
  button.textContent = "Shortlist";
  button.addEventListener("click", () => addToShortlist(item, user, button));
  return button;
}

/** Save an item to the signed-in user's shortlist. */
async function addToShortlist(item, user, button) {
  button.disabled = true;
  try {
    // Deterministic id (userId_itemId) => one shortlist entry per user+item,
    // so a user can never shortlist the same item twice.
    const shortlistId = `${user.uid}_${item.id}`;
    await setDoc(doc(db, "shortlists", shortlistId), {
      userId: user.uid,
      itemId: item.id,
      itemName: item.name || "Untitled item",
      itemImageUrl: item.imageUrl || "",
      itemPrice: formatPrice(item),
      forTrade: !!item.forTrade,
      createdAt: serverTimestamp(),
    });
    markAsShortlisted(button);
  } catch (error) {
    console.error("Failed to shortlist item:", error);
    alert("Could not add to shortlist. Please try again.");
    button.disabled = false;
  }
}

/** Switch a button into the disabled "Shortlisted" state. */
function markAsShortlisted(button) {
  button.className = "btn btn-secondary";
  button.textContent = "Shortlisted";
  button.disabled = true;
}
