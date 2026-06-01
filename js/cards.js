// js/cards.js
// ---------------------------------------------------------------------------
// Shared helper for rendering a single item as a Bootstrap card. Used by both
// the Marketplace and My Listings pages so the card layout stays consistent.
// Values from Firestore are inserted with textContent (never innerHTML) so a
// listing's text can never break the page or inject markup.
// ---------------------------------------------------------------------------

// Light grey "No image" placeholder shown when an item has no/!broken image.
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' fill='%236c757d' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'%3ENo image%3C/text%3E%3C/svg%3E";

/** Format an item's price, showing "Trade" for trade-only listings. */
export function formatPrice(item) {
  if (item.forTrade) return "Trade";
  if (item.price === 0) return "Free";
  if (item.price === undefined || item.price === null) return "—";
  return "$" + item.price;
}

/**
 * Build one grid column containing a card for the given item.
 * @param {object} item   Item data (plus an `id`) from Firestore.
 * @param {Node} [footer] Optional element appended at the bottom of the card
 *                        (e.g. the Marketplace "Shortlist" button).
 * @returns {HTMLDivElement} A `.col` element ready to append to the grid.
 */
export function createItemCard(item, footer) {
  const col = document.createElement("div");
  col.className = "col";

  const card = document.createElement("div");
  card.className = "card h-100 shadow-sm";

  // --- Image -------------------------------------------------------------
  const img = document.createElement("img");
  img.className = "card-img-top item-img";
  img.alt = item.name || "Item image";
  img.src = item.imageUrl || PLACEHOLDER_IMAGE;
  img.addEventListener("error", () => {
    img.src = PLACEHOLDER_IMAGE;
  });
  card.appendChild(img);

  // --- Body --------------------------------------------------------------
  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";

  const title = document.createElement("h2");
  title.className = "h5 card-title";
  title.textContent = item.name || "Untitled item";
  body.appendChild(title);

  // Price + category badges
  const badges = document.createElement("div");
  badges.className = "mb-2 d-flex gap-2 flex-wrap";

  const priceBadge = document.createElement("span");
  priceBadge.className =
    "badge " + (item.forTrade ? "text-bg-info" : "text-bg-success");
  priceBadge.textContent = formatPrice(item);
  badges.appendChild(priceBadge);

  if (item.category) {
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "badge text-bg-secondary";
    categoryBadge.textContent = item.category;
    badges.appendChild(categoryBadge);
  }
  body.appendChild(badges);

  // Description
  const desc = document.createElement("p");
  desc.className = "card-text";
  desc.textContent = item.description || "";
  body.appendChild(desc);

  // Seller email (pushed to the bottom of the body)
  const seller = document.createElement("p");
  seller.className = "card-text mt-auto mb-0 small text-secondary";
  seller.textContent = "Seller: " + (item.sellerEmail || "unknown");
  body.appendChild(seller);

  // Optional footer node (e.g. the Shortlist button)
  if (footer) {
    footer.classList.add("mt-3");
    body.appendChild(footer);
  }

  card.appendChild(body);
  col.appendChild(card);
  return col;
}
