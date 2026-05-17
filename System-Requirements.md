# Campus Marketplace — System Requirements Specification

**Unit:** COMP2750 / COMP6750 — Applications Modelling and Development
**Assessment:** Task 3 — Application Development and Testing
**Document type:** System Requirements Specification (SRS) for the Part A group build
**Version:** 1.0

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for the simplified Campus Marketplace web application built for COMP2750/6750 Assessment 3. It is the single source of truth for what the group must build and how the build will be evaluated.

### 1.2 Scope
Campus Marketplace is a web application that lets Macquarie University students sign in, browse items listed by other students, view their own listings, and shortlist items they are interested in. The application is a focused subset of the full A1 case study — it intentionally excludes features such as user registration in-app, listing creation in-app, messaging, search, and ratings.

### 1.3 Definitions
- **User** — a Macquarie student who signs in with email and password.
- **Item** — a product listed by a user, with a price or marked for trade.
- **Listing** — an item owned (created) by a specific user.
- **Shortlist** — a per-user saved collection of items the user is interested in.
- **Seller** — the user who owns a given listing.
- **Auth guard** — the runtime check that redirects unauthenticated users to the login page.

### 1.4 Technology constraints
The implementation must use the following stack and no substitutions:
- HTML for page structure
- CSS with Bootstrap for styling and responsive layout
- JavaScript (vanilla, browser-side) for all logic
- Firebase Authentication for sign-in and sign-out
- Firebase Firestore for persistent storage of items and shortlists

No backend server, no Node.js runtime, no JavaScript frameworks (React, Vue, Angular). The app must run as a static site under VS Code Live Server.

---

## 2. System overview

The application consists of five HTML pages backed by Firebase. Authentication state determines which pages a user can access. All item and shortlist data is stored in Firestore and loaded dynamically at runtime — no item content may be hardcoded in HTML.

### 2.1 Page map
| Page | File | Public | Purpose |
|---|---|---|---|
| Sign-In | `login.html` | Yes | Authenticate user |
| Welcome | `index.html` | No | Landing page with navigation |
| Marketplace | `marketplace.html` | No | Browse other users' items |
| My Listings | `mylistings.html` | No | View own items |
| My Shortlist | `shortlist.html` | No | View and manage shortlisted items |

"Public" here means accessible without authentication. Every non-public page must redirect to `login.html` if no user is signed in.

---

## 3. Functional requirements

### 3.1 Authentication (FR-AUTH)

**FR-AUTH-01 — Sign in with email and password**
The system shall provide a sign-in form on `login.html` accepting an email and password. On submit, the system shall call Firebase Authentication's `signInWithEmailAndPassword` and, on success, redirect the user to `index.html`.

**FR-AUTH-02 — Display sign-in errors**
If sign-in fails (wrong credentials, malformed email, network error), the system shall display a clear error message on the sign-in page without redirecting.

**FR-AUTH-03 — Test user accounts**
Test user accounts shall be created manually in the Firebase Console. The system does not provide an in-app sign-up page. At least three test accounts must exist before the live demonstration.

**FR-AUTH-04 — Auth guard on protected pages**
On page load of `index.html`, `marketplace.html`, `mylistings.html`, and `shortlist.html`, the system shall verify auth state using `onAuthStateChanged`. If no user is signed in, the system shall redirect to `login.html` before rendering protected content.

**FR-AUTH-05 — Sign out**
The system shall provide a Sign Out button on every protected page. Clicking it shall call Firebase's `signOut()` and redirect the user to `login.html`.

**FR-AUTH-06 — Session persistence**
The system shall persist the signed-in session across page navigations and browser refreshes using Firebase's default session persistence. The user shall not need to sign in again when navigating between protected pages.

### 3.2 Welcome page (FR-WEL)

**FR-WEL-01 — Display user identity**
The welcome page shall display the email address of the currently signed-in user.

**FR-WEL-02 — Navigation links**
The welcome page shall provide three navigation links labelled "Browse Marketplace", "My Listings", and "My Shortlist", linking to `marketplace.html`, `mylistings.html`, and `shortlist.html` respectively.

**FR-WEL-03 — Sign out control**
The welcome page shall include a Sign Out button satisfying FR-AUTH-05.

### 3.3 Marketplace page (FR-MKT)

**FR-MKT-01 — Load items dynamically**
The marketplace page shall load all item documents from the Firestore `items` collection at runtime. No item content shall be hardcoded in the HTML.

**FR-MKT-02 — Exclude own items**
The marketplace page shall exclude items whose `sellerId` matches the currently signed-in user's UID. Only other users' items are shown here.

**FR-MKT-03 — Required fields per item**
Each item card shall display at minimum: item name, description, price (or the literal string "Trade" if the item is marked for trading), category, image, and seller email.

**FR-MKT-04 — Shortlist button**
Each item card shall include a Shortlist button. Clicking the button shall create a corresponding document in the shortlists collection (see FR-SHO-01).

**FR-MKT-05 — Already-shortlisted state**
If the current user has already shortlisted an item, the Shortlist button on that item's card shall be visually distinct (e.g. different colour and a "Shortlisted" label) and shall be disabled to prevent duplicate shortlisting.

**FR-MKT-06 — Navigation controls**
The marketplace page shall include a link back to the welcome page and a Sign Out button.

### 3.4 My Listings page (FR-MYL)

**FR-MYL-01 — Load own items only**
The My Listings page shall load only items where `sellerId` matches the currently signed-in user's UID.

**FR-MYL-02 — Display item details**
Each listing shall display the same fields as on the marketplace page (FR-MKT-03), except that the seller email may be omitted since it is always the current user.

**FR-MYL-03 — No shortlist control on own items**
The My Listings page shall not provide a Shortlist button. A user cannot shortlist their own items.

**FR-MYL-04 — Navigation controls**
The My Listings page shall include a link back to the welcome page and a Sign Out button.

### 3.5 Shortlist page (FR-SHO)

**FR-SHO-01 — Persist shortlist per user**
When a user shortlists an item from the marketplace, the system shall create a Firestore document linking the user's UID to the item's ID.

**FR-SHO-02 — Display shortlisted items**
The shortlist page shall display all items the current user has shortlisted. Each entry shall show at minimum the item name and a Remove button.

**FR-SHO-03 — Per-user isolation**
The shortlist page shall display only the current user's shortlisted items. Different signed-in users shall see different shortlists.

**FR-SHO-04 — Remove from shortlist**
Clicking the Remove button shall delete the corresponding shortlist document from Firestore and remove the entry from the page without requiring a manual refresh.

**FR-SHO-05 — Persistence across sessions**
A user's shortlist shall remain intact across sign-out and sign-in cycles, and across browser sessions.

**FR-SHO-06 — Navigation controls**
The shortlist page shall include a link back to the welcome page and a Sign Out button.

---

## 4. Data requirements

### 4.1 Firestore collections

**`items` collection** — one document per listing. Each document shall contain at minimum:
- `name` (string)
- `description` (string)
- `price` (number; ignored when `isTrade` is true)
- `isTrade` (boolean; true means the item is for trade rather than sale)
- `category` (string; e.g. Textbooks, Furniture, Clothing, Electronics)
- `imageUrl` (string; either a relative path into the local `images/` folder or a hosted URL)
- `sellerId` (string; the Firebase Auth UID of the user who listed the item)
- `sellerEmail` (string; the seller's email for display)

**`shortlists` collection** — one document per (user, item) pair. Each document shall contain at minimum:
- `userId` (string; the UID of the user who shortlisted)
- `itemId` (string; the document ID of the item from the `items` collection)
- `createdAt` (timestamp; optional but recommended)

A composite document ID of the form `{userId}_{itemId}` is recommended. This makes duplicate prevention trivial (writing twice overwrites the same document) and lets the "is this item shortlisted?" check be a single document lookup.

### 4.2 Seed data requirements
Before the live demonstration, the Firestore database shall contain:
- At least **8 items** total
- Spread across at least **3 distinct categories**
- Owned by at least **3 distinct test user accounts**

This is required so that the filtering in FR-MKT-02 and FR-MYL-01 produces visibly different results when the demo signs in as different users.

### 4.3 Images
Item images shall be stored in a project-level `images/` folder and referenced by relative path from the `imageUrl` field. Firebase Storage is not required.

---

## 5. Non-functional requirements

### 5.1 Compatibility (NFR-COMP)
The application shall run without errors when served by VS Code Live Server in a current Chromium-based browser. No build step is required.

### 5.2 Responsiveness (NFR-RESP)
The layout shall use Bootstrap's responsive grid such that the marketplace, my-listings, and shortlist pages render legibly on viewport widths from 360 px to 1920 px.

### 5.3 Code quality (NFR-CODE)
The codebase shall be:
- Organised into one HTML file per page plus separate JavaScript files (one per page or one shared file with clear sections)
- Commented at the function level and on any non-obvious logic
- Free of unused files, console errors, and dead code at the time of demonstration

### 5.4 Security and credentials (NFR-SEC)
The Firebase configuration object is committed to the repository for marking purposes, as is the README containing test user credentials. The test users and Firebase project shall not be reused for any real or sensitive purpose. Firestore security rules shall, at minimum, require authentication for all reads and writes.

### 5.5 Maintainability (NFR-MAINT)
A shared `firebase-config.js` (or equivalent module) shall hold the Firebase configuration so that credentials are not duplicated across pages.

---

## 6. Constraints and exclusions

### 6.1 Out of scope
The following A1 case-study features are **not** required and shall not be built for this assessment:
- In-app user registration (sign-up page)
- In-app listing creation, editing, or deletion
- Buyer–seller messaging
- Search, filter, or sort controls on the marketplace
- Ratings, reviews, or reputation
- Transaction or meetup workflow
- Sustainability dashboard
- Admin or moderation tools

These may be explored in the Part B Figma dream-screen design, but not in the Part A implementation.

### 6.2 Assumptions
- Test users have been created manually in the Firebase Console before the demo.
- The marker has internet access during marking so that Firebase reads and writes succeed.
- Modern browser features (ES modules, `fetch`, `async`/`await`) are available.

---

## 7. Deliverables

### 7.1 Group deliverables (submitted as one zip via iLearn before the SGTA)
- All HTML files (`login.html`, `index.html`, `marketplace.html`, `mylistings.html`, `shortlist.html`)
- All JavaScript files
- All CSS files (if any beyond Bootstrap)
- The `images/` folder containing all referenced item images
- The presentation slides (PowerPoint)
- A `README.txt` containing the Firebase configuration object and the email and password of each test user account

### 7.2 Live presentation (10 minutes maximum)
- 3–5 minutes: live demonstration covering sign-in, browsing items, viewing My Listings, shortlisting, viewing the shortlist, removing a shortlisted item, sign-out, and sign-in as a different user to show different filtered results and a separate shortlist
- 2–3 minutes: brief code walkthrough (one section per member, explaining how the frontend connects to Firebase) — typically prompted by the marker
- 2 minutes: each member presents their individual Figma design from Part B
- Every group member must speak; members who do not speak or cannot explain their contribution may receive a reduced individual mark

---

## 8. Acceptance criteria

The Part A build is considered acceptable when **all** of the following hold:

1. The application opens without errors under Live Server.
2. A user can sign in with valid credentials and is redirected to the welcome page.
3. Invalid credentials produce a visible error and no redirect.
4. Navigating directly to any protected page while signed out redirects to the sign-in page.
5. The welcome page displays the signed-in user's email.
6. The marketplace page loads items from Firestore, excludes the current user's own items, and displays all required fields per item.
7. The Shortlist button creates a shortlist document; the button becomes visibly disabled and labelled "Shortlisted" for items the user has already shortlisted.
8. The My Listings page shows only items belonging to the current user.
9. The shortlist page shows only the current user's shortlisted items, and Remove deletes the corresponding Firestore document and updates the view.
10. Sign-out clears the session and redirects to the sign-in page.
11. Signing in as a different test user produces a different marketplace view (different excluded items), different My Listings, and a different shortlist.
12. Shortlist contents survive a sign-out and sign-in cycle.
13. No item content is hardcoded in the HTML.
14. The README contains a working Firebase config and at least three valid sets of test credentials.

---

## 9. Traceability — requirements to rubric

| Rubric component (marks) | Primary requirements covered |
|---|---|
| Sign-In and Authentication (12) | FR-AUTH-01 to FR-AUTH-06 |
| Available Items from Firestore (12) | FR-MKT-01 to FR-MKT-03, FR-MKT-06 |
| My Listings (12) | FR-MYL-01 to FR-MYL-04 |
| Shortlist Functionality (12) | FR-MKT-04, FR-MKT-05, FR-SHO-01 to FR-SHO-06 |
| Sign Out and Access Control (5) | FR-AUTH-04, FR-AUTH-05 |
| Presentation: Demo and Delivery (5) | Section 7.2 |
| Code Quality and Explanation (12) | NFR-CODE, NFR-MAINT |