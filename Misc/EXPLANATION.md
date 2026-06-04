# Campus Marketplace — The Complete Codebase Explanation

This document explains **everything** about how this project works — the ideas, the
technology, and every file — written so that **someone who has never written a line of
code can still follow it**, while also giving the precise technical detail for those who
want it.

### How to read this document
Most sections come in two layers:

- 🟢 **In plain English** — an everyday explanation, often with a real-world analogy. No
  coding knowledge needed.
- ⚙️ **Technically** — what's actually happening in the code, with the real names of things.

If you're brand new, read only the 🟢 parts first. Then come back and read the ⚙️ parts.

---

## Table of Contents
1. [The Big Picture](#1-the-big-picture)
2. [The Technologies, Explained Simply](#2-the-technologies-explained-simply)
3. [How It All Fits Together](#3-how-it-all-fits-together)
4. [The Data: What's Stored and Where](#4-the-data-whats-stored-and-where)
5. [A Tour of Every File](#5-a-tour-of-every-file)
6. [The Key Journeys, Step by Step](#6-the-key-journeys-step-by-step)
7. [Glossary](#7-glossary)
8. [How to Run It and Where to Change Things](#8-how-to-run-it-and-where-to-change-things)

---

## 1. The Big Picture

### 🟢 In plain English
**Campus Marketplace** is a small website where university students can buy, sell, and
trade things with each other — textbooks, furniture, clothes, electronics, and so on.

Think of it as a **tiny, student-only version of Facebook Marketplace or Gumtree**.

A student can:
1. **Sign in** with an email and password.
2. **Browse** items that *other* students have listed.
3. **See their own listings** (the things they put up for sale).
4. **Shortlist** items they like (like a "save for later" or wishlist).
5. **Remove** things from their shortlist.
6. **Sign out**.

That's the whole app. It's deliberately simple — it's a university assignment that shows
how a real website connects to a real online database.

### Why these exact features?
The assignment asks for a *focused, working subset* of a bigger idea. The point is to prove
four things work:
- **Logging in securely** (only real users get in),
- **Loading live data from the cloud** (not fake data typed into the page),
- **Showing different things to different people** (your items vs everyone else's),
- **Saving each person's choices** (your shortlist is yours, and it's still there tomorrow).

### ⚙️ Technically
This is a **client-side web application** with **no custom backend server**. The five HTML
pages run entirely in the browser. They talk **directly** to **Firebase** — Google's cloud
platform — for two things:
- **Firebase Authentication** handles logins.
- **Cloud Firestore** (a Firebase database) stores the items and shortlists.

The stack is: **HTML + CSS (Bootstrap) + vanilla JavaScript (ES modules) + Firebase**.
There is no React, no build step, no Node server of our own. You can open it with VS Code's
"Live Server" and it just works.

---

## 2. The Technologies, Explained Simply

A website is built from a few different "materials," each doing a different job. The classic
analogy is **building a human body**:

| Technology | Body analogy | Job |
|---|---|---|
| **HTML** | The skeleton | The structure: what content exists (headings, buttons, boxes) |
| **CSS / Bootstrap** | The skin & clothes | The looks: colours, spacing, layout, fonts |
| **JavaScript** | The brain & muscles | The behaviour: what happens when you click, what data to load |
| **Firebase** | The outside world | The memory and the ID-checker that live on the internet |

### 2.1 HTML — the structure

#### 🟢 In plain English
HTML is a list of **what's on the page**: "here is a heading," "here is a text box," "here
is a button." It does **not** decide what things look like or what they do — only that they
*exist* and in what order. It's like the wireframe skeleton of the page.

#### ⚙️ Technically
HTML (HyperText Markup Language) uses **tags** like `<h1>` (heading), `<button>`, `<input>`,
and `<div>` (a generic box). Tags can have **attributes** (e.g. `id="login-email"`) that act
as name-tags so the JavaScript and CSS can find them later. Our pages are `login.html`,
`index.html`, `marketplace.html`, `myListing.html`, and `shortlist.html`.

### 2.2 CSS & Bootstrap — the appearance

#### 🟢 In plain English
CSS is the **styling**: "make this blue," "put space here," "line these up in a row." Writing
all of that by hand is slow, so we use **Bootstrap** — a free, ready-made kit of good-looking
styles. Instead of describing every colour and size ourselves, we just label things with
Bootstrap's names (like `card`, `btn btn-primary`, `navbar`) and they instantly look polished
and work on phones and laptops alike.

#### ⚙️ Technically
**Bootstrap 5.3.8** is loaded from `node_modules/bootstrap/dist/`. We use its component
**classes** directly in the HTML (`navbar`, `card`, `row`, `col`, `btn`, `badge`,
`list-group`, etc.) so we write almost no custom CSS. The only custom rules live in
`css/custom.css` (e.g. forcing all product images to the same height). Bootstrap's grid
(`row` + `col`) makes the layout **responsive** — it rearranges itself for small screens.

### 2.3 JavaScript — the behaviour

#### 🟢 In plain English
JavaScript is the **brain**. HTML puts a "Sign In" button on the page, but it just sits there
doing nothing until JavaScript says: "when someone clicks this button, check their password,
and if it's right, send them to the next page." Every *action* in the app — loading items,
saving a shortlist, signing out — is JavaScript reacting to something.

#### ⚙️ Technically
We use **vanilla JavaScript** (no framework) organised as **ES modules** — each `.js` file is
a self-contained unit that can **`import`** functions from other files and **`export`** its
own. The HTML loads them with `<script type="module" src="...">`. JavaScript finds HTML
elements (`document.getElementById(...)`), listens for events
(`element.addEventListener("click", ...)`), and rebuilds parts of the page on the fly
(`document.createElement(...)`).

### 2.4 Firebase Authentication — the ID check

#### 🟢 In plain English
Imagine a club with a **bouncer at the door**. You give your name and a password; the bouncer
checks a guest list and either lets you in or turns you away. Once you're in, the bouncer
**remembers you** so you don't have to prove who you are at every doorway inside.

Firebase Authentication is that bouncer. It checks email + password, and then every page can
quietly ask it "is this person allowed in?" If not, it sends them back to the front door
(the login page).

#### ⚙️ Technically
**Firebase Authentication** with the **Email/Password** provider verifies credentials via
`signInWithEmailAndPassword(...)`. The signed-in state is tracked by **`onAuthStateChanged`**,
which fires whenever the user logs in or out. Each protected page subscribes to it; if there's
no user, it redirects to `login.html`. `signOut(...)` ends the session. Test accounts are
created in the Firebase Console (there's no sign-up page).

### 2.5 Cloud Firestore — the online memory (database)

#### 🟢 In plain English
A **database** is just an organised place to store information so it isn't lost when you close
the page. Picture a **filing cabinet in the cloud** (i.e. living on Google's computers, not on
yours). Inside the cabinet are **drawers** (called *collections*), and inside each drawer are
**folders** (called *documents*), and each folder holds a few labelled facts (*fields*).

Because it's in the cloud, **everyone shares the same cabinet**. When one student lists a
textbook, it's saved in the cabinet, and every other student's page can read it. And it's
**permanent** — your shortlist is still there when you come back tomorrow or sign in on a
different computer.

#### ⚙️ Technically
**Cloud Firestore** is a NoSQL document database. Data is organised as **collections** →
**documents** → **fields**. We use two collections, `items` and `shortlists` (detailed in
[section 4](#4-the-data-whats-stored-and-where)). The app reads with `getDocs(...)` (optionally
filtered by a `query(..., where(...))`), writes with `setDoc(...)`, and deletes with
`deleteDoc(...)`. Data persists server-side and syncs to any device that signs in.

### 2.6 Two ideas worth pinning down: "the cloud" and "modules"

#### 🟢 In plain English
- **"The cloud"** just means *"a computer somewhere else on the internet that we rent instead
  of owning."* When we say data is "in the cloud," it means it's stored on Google's servers, so
  it's shared between everyone and survives even if you turn your laptop off.
- **A "module"** is just *one file that does one job*. Rather than cramming all the code into a
  single giant file, we split it into small files that **borrow** functions from each other.
  Like a recipe that says "see the sauce recipe on page 12" instead of rewriting the sauce
  every time.

#### ⚙️ Technically
ES modules give us **encapsulation** (each file's variables are private unless `export`ed) and
**reuse**. For example, the login-guard logic is written **once** in `auth.js` and imported by
four pages, so there's no copy-paste and one place to fix bugs.

---

## 3. How It All Fits Together

### 🟢 In plain English — the journey of a click
Here's what happens, end to end, when a student uses the app:

1. They open the site. The **login page** appears.
2. They type their email and password and click **Sign In**.
3. JavaScript hands those to **Firebase's bouncer**. If correct, the bouncer says "you're in"
   and remembers them.
4. They land on the **Welcome page**, which greets them by email.
5. They click **Marketplace**. JavaScript opens the cloud **filing cabinet**, grabs every item,
   **hides the ones they listed themselves**, and draws a tidy card for each remaining item.
6. They click **Shortlist** on a textbook. JavaScript saves a little note in the cabinet:
   "*this user* saved *this item*."
7. On the **Shortlist page**, JavaScript reads back only *their* notes and lists them, each with
   a **Remove** button.
8. They click **Sign Out**. The bouncer forgets them and they're back at the front door.

The crucial idea: **the pages themselves are empty templates. The real content is fetched live
from the cloud every time and drawn by JavaScript.** Nothing is hardcoded.

### ⚙️ Technically — architecture
```
                 ┌─────────────────────────────────────────────┐
                 │                The Browser                  │
                 │                                             │
  HTML pages ───▶│  login / index / marketplace / myListing /  │
  (templates)    │  shortlist .html                            │
                 │            │ load <script type=module>      │
                 │            ▼                                │
                 │   Page logic: login.js, welcome.js,         │
                 │   marketplace.js, myListing.js, shortlist.js│
                 │      │ import           │ import            │
                 │      ▼                  ▼                   │
                 │   auth.js  ◀── import ── firebase.js        │
                 │   cards.js                  │               │
                 └─────────────────────────────┼───────────────┘
                                               │ (internet)
                              ┌────────────────┴───────────────┐
                              ▼                                ▼
                   Firebase Authentication           Cloud Firestore
                   (verifies logins)                 (items + shortlists)
```

Key architectural points:
- **Serverless / no backend of our own.** The browser talks straight to Firebase over HTTPS.
  There is no Express/Node/PHP server we wrote.
- **Shared foundation, per-page logic.** `firebase.js` (config) and `auth.js` (guard +
  sign-out) and `cards.js` (rendering) are shared; each page has a thin script that wires them
  together for that page's purpose.
- **Everything is dynamic.** HTML ships with empty containers (e.g.
  `<div id="items-grid">`); JavaScript fills them from Firestore at runtime.

---

## 4. The Data: What's Stored and Where

All the app's information lives in **two collections** (drawers) in Firestore. The easiest way
to picture a collection is as a **spreadsheet**: each row is one document, each column is a
field.

### 4.1 The `items` collection — one row per thing for sale

#### 🟢 In plain English
Every item a student lists becomes one folder in the "items" drawer. The folder records the
item's name, description, price, category, a picture, and — importantly — **who is selling it**.

| name | description | price | forTrade | category | imageUrl | sellerEmail | sellerId |
|---|---|---|---|---|---|---|---|
| Calculus Textbook | 2nd ed., barely used | 45 | false | Textbooks | images/textbook.jpg | user1@… | *(user1's ID)* |
| Hoodie (size M) | Warm, grey | 0 | true | Clothing | images/hoodie.jpg | user1@… | *(user1's ID)* |
| USB-C Hub | 6-in-1 | 25 | false | Electronics | images/hub.jpg | user2@… | *(user2's ID)* |

- **`forTrade`** is a yes/no flag. If it's "yes," the app shows the word **"Trade"** instead of
  a price (the seller wants to swap, not sell).
- **`sellerId`** is the secret sauce. It's the seller's unique ID number. It's how the app knows
  whether an item is *yours* or *someone else's*.

#### ⚙️ Technically
`items` documents have: `name` (string), `description` (string), `price` (number),
`forTrade` (boolean), `category` (string), `imageUrl` (string — a path like `images/x.jpg` or a
full URL), `sellerEmail` (string, denormalised for display), and `sellerId` (string — the
seller's **Firebase Auth UID**). Documents are seeded in the Firebase Console.

### 4.2 The `shortlists` collection — one row per "save"

#### 🟢 In plain English
When you shortlist an item, the app drops a small note in the "shortlists" drawer that says
"*this user* saved *this item*," plus a copy of the item's name and picture so the shortlist
page can show it quickly.

Each note's **label (its ID)** is cleverly made by gluing **your ID + the item's ID** together,
like `user1_abc123`. Why? Because that makes it **impossible to save the same item twice** — if
you try, you'd just create a note with a label that already exists, so it overwrites instead of
duplicating. And removing is easy: the app knows exactly which note to tear up.

#### ⚙️ Technically
Each `shortlists` document uses a **deterministic document ID**: `` `${userId}_${itemId}` ``.
This gives **free duplicate-prevention** (re-saving overwrites the same doc) and **O(1)
deletion** (`deleteDoc(doc(db, "shortlists", "<uid>_<itemId>"))`). Fields: `userId`, `itemId`,
plus **denormalised** `itemName`, `itemImageUrl`, `itemPrice`, `forTrade`, and a `createdAt`
timestamp. Denormalising the item details means the Shortlist page needs **no extra reads** of
the `items` collection to render.

### 4.3 What is a "UID"?

#### 🟢 In plain English
When the bouncer (Firebase Auth) creates an account, it assigns that person a **unique ID
number** — a long random string like `Xa92kLp...`. It never changes and no two people share one.
The app uses this ID, not the email, to decide who owns what. (IDs are safer and never change,
even if someone's email did.)

#### ⚙️ Technically
The **UID** is the stable unique identifier Firebase Auth assigns each user (`user.uid`). It's
the join key between Auth and Firestore: an item's `sellerId` and a shortlist's `userId` are
both UIDs.

---

## 5. A Tour of Every File

Here's what each file in the project does. Pages first, then the JavaScript "brains," then the
styling and docs.

### The HTML pages (the structure of each screen)

#### `login.html` — the front door
- 🟢 A centred card with an **Email** box, a **Password** box, a **Sign In** button, and a
  hidden red error message that only appears if the login fails.
- ⚙️ A Bootstrap card + form (`#login-form`, `#login-email`, `#login-password`, `#login-submit`,
  `#login-error`). Loads `js/login.js`. The only page **not** behind the login guard.

#### `index.html` — the Welcome page
- 🟢 The landing page after you log in. It says "Welcome back!" with your email and shows three
  big clickable cards: Marketplace, My Listings, Shortlist. Plus a navigation bar with a Sign
  Out button.
- ⚙️ Bootstrap `navbar` + hero + a 3-card grid. Has `#user-email` (navbar) and `#welcome-email`
  (hero) for JavaScript to fill. Loads `js/welcome.js`.

#### `marketplace.html` — browse others' items
- 🟢 Shows everyone *else's* items as a grid of cards. Starts with a "Loading items…" message,
  which JavaScript replaces with the real cards.
- ⚙️ Contains an empty `#items-grid` (a Bootstrap responsive row) and a `#status` message
  element. Loads `js/marketplace.js`.

#### `myListing.html` — your own items
- 🟢 The same kind of grid, but it only shows the items **you** listed. (The old "add a product"
  form was removed because, for this assignment, items are added through the Firebase Console.)
- ⚙️ Same `#items-grid` / `#status` pattern. Loads `js/myListing.js`.

#### `shortlist.html` — your saved items
- 🟢 A simple list of the items you've shortlisted, each with a **Remove** button.
- ⚙️ An empty `#shortlist-list` (a Bootstrap `list-group`) + `#status`. Loads `js/shortlist.js`.

> `signup.html` also exists but is **unused** — the assignment doesn't require a sign-up page
> (accounts are made in the Firebase Console).

All four logged-in pages share the **same navigation bar**, so they feel consistent and every
page can show your email and let you sign out.

---

### The JavaScript files (the behaviour)

#### `js/firebase.js` — the connection setup
- 🟢 This is the **one place** where the app is "plugged in" to your specific Firebase project.
  It holds the project's address and keys. (Right now it has placeholders you replace with your
  real values.) Every other file gets its connection to the cloud from here, so there's a single
  source of truth.
- ⚙️ Calls `initializeApp(firebaseConfig)` once and **exports** `auth` (`getAuth`) and `db`
  (`getFirestore`). All other modules `import { auth }` / `import { db }` from here. Firebase
  itself is loaded from the gstatic CDN (v11.6.1 modular SDK).

#### `js/auth.js` — the security guard (shared)
- 🟢 Contains two reusable tools used by every logged-in page:
  - **"Are you allowed here?"** — if you're not signed in, it instantly bounces you to the login
    page. This is why you can't just type the marketplace's web address to skip logging in.
  - **"Sign me out"** — wires up the Sign Out button to log you out and return you to the front
    door.
- ⚙️ Exports `requireAuth(onUser)` (wraps `onAuthStateChanged`; redirects to `login.html` if
  `user` is null, otherwise calls your callback with the user) and `wireSignOut(selector)`
  (attaches `signOut(auth)` + redirect to the Sign Out button). Written once, imported four
  times.

#### `js/cards.js` — the item-card maker (shared)
- 🟢 A reusable "stamp" that turns one item's data into a nice-looking card (image, title, price
  or "Trade", category tag, description, seller's email). Both the Marketplace and My Listings
  pages use the same stamp so cards look identical everywhere. It also formats the price and
  swaps in a grey "No image" placeholder if a picture is missing or broken.
- ⚙️ Exports `createItemCard(item, footer)` which builds a Bootstrap `col > card` using
  `document.createElement` and **`textContent`** (never `innerHTML`, so listing text can't
  inject markup). The optional `footer` node is where Marketplace slots its Shortlist button.
  Also exports `formatPrice(item)` ("Trade" / "Free" / `$<price>`).

#### `js/login.js` — sign-in logic
- 🟢 Watches the login form. When you submit, it checks both boxes are filled, asks Firebase to
  verify the password, and either sends you to the Welcome page or shows a friendly red error
  ("Incorrect email or password," etc.). It also disables the button while checking so you can't
  submit twice. If you're already logged in, it skips straight to the Welcome page.
- ⚙️ On `submit`: `preventDefault`, validate, then
  `await signInWithEmailAndPassword(auth, email, password)`. On success → `index.html`. On
  failure → maps `error.code` (`auth/invalid-credential`, etc.) to a friendly message in
  `#login-error`. An `onAuthStateChanged` check redirects already-signed-in users.

#### `js/welcome.js` — the Welcome page logic
- 🟢 The smallest brain: it just confirms you're logged in, writes your email into the greeting
  and the nav bar, and switches on the Sign Out button.
- ⚙️ `requireAuth((user) => { fill #user-email and #welcome-email with user.email; wireSignOut(); })`.

#### `js/marketplace.js` — the marketplace logic (the most interesting one)
- 🟢 After confirming you're logged in, it does three things:
  1. Looks up **which items you've already shortlisted**, so it can show those buttons as
     already "Shortlisted."
  2. Fetches **all** items and **throws away the ones you listed yourself** (you shouldn't buy
     your own stuff).
  3. Draws a card for each remaining item. Each card gets a **Shortlist** button; clicking it
     saves the item to your shortlist and the button turns grey and says "Shortlisted."
  If something goes wrong (e.g. no internet or bad config), it shows a clear error message
  instead of a blank page.
- ⚙️ `requireAuth(async (user) => {...})` then:
  `getDocs(query(collection(db,'shortlists'), where('userId','==',user.uid)))` → a `Set` of
  shortlisted `itemId`s; `getDocs(collection(db,'items'))` → `.filter(i => i.sellerId !== user.uid)`;
  render via `createItemCard(item, buildShortlistButton(...))`. Saving uses
  `setDoc(doc(db,'shortlists', `${uid}_${itemId}`), {...})`, then flips the button to a disabled
  "Shortlisted" state.

#### `js/myListing.js` — your-items logic
- 🟢 Confirms you're logged in, then asks the cabinet for **only the items whose seller is you**,
  and draws them as cards (with **no** Shortlist button — you can't shortlist your own items). If
  you haven't listed anything, it says so.
- ⚙️ `getDocs(query(collection(db,'items'), where('sellerId','==',user.uid)))`, then
  `createItemCard(item)` with no footer. Empty-state message when there are zero results.

#### `js/shortlist.js` — shortlist + remove logic
- 🟢 Reads back **your** saved items and lists them, each with a Remove button. Clicking Remove
  deletes that saved item from the cabinet and removes the row from the screen. If your shortlist
  becomes empty, it shows "Your shortlist is empty."
- ⚙️ `getDocs(query(collection(db,'shortlists'), where('userId','==',user.uid)))` → list rows.
  Remove → `deleteDoc(doc(db,'shortlists', entry.id))` then remove the DOM node; re-show the
  empty state if `list.children.length === 0`.

---

### Styling, config, and docs

- **`css/custom.css`** — 🟢 A handful of small tweaks on top of Bootstrap (e.g. making all card
  images the same height so the grid looks neat). ⚙️ `.item-img { object-fit: cover }`,
  thumbnail sizing, navbar text colour.
- **`node_modules/bootstrap/`** — 🟢 The ready-made styling kit. ⚙️ Bootstrap 5.3.8; we link its
  prebuilt `dist/css/bootstrap.min.css` and `dist/js/bootstrap.bundle.min.js`.
- **`images/`** — 🟢 Where item photos go. ⚙️ Referenced by an item's `imageUrl` as
  `images/<file>`.
- **`README.txt`** — 🟢 The hand-in summary: how to run it, where the Firebase keys and test
  logins go.
- **`FIREBASE-SETUP.md`** — 🟢 The step-by-step "set up your cloud account and add data" guide.
- **`scss/` and `css/styles.css`** — 🟢 Leftover files from an earlier styling approach; **not
  used** by the app anymore (the pages link Bootstrap directly).

---

## 6. The Key Journeys, Step by Step

This section traces the most important flows so you can see the pieces working together.

### 6.1 Signing in
1. 🟢 You type your email + password on `login.html` and click **Sign In**.
2. `login.js` checks both fields are filled, disables the button, and asks Firebase Auth to
   verify you.
3. ✅ **Correct:** Firebase remembers you; the page sends you to `index.html`.
   ❌ **Wrong:** a red message explains what went wrong; the button re-enables so you can retry.
- ⚙️ `signInWithEmailAndPassword` resolves → redirect; rejects → friendly message from
  `error.code`.

### 6.2 The login guard — why you can't skip the front door
- 🟢 Every logged-in page, the moment it loads, quietly asks the bouncer "is anyone signed in?"
  If not, it **immediately** redirects to the login page. So pasting the marketplace's address
  to skip login doesn't work — you'll just bounce back to the door.
- ⚙️ `requireAuth` subscribes to `onAuthStateChanged`. A `null` user triggers
  `window.location.replace('login.html')`. This runs on `index`, `marketplace`, `myListing`,
  and `shortlist`.

### 6.3 Browsing the marketplace — and why your own items are hidden
- 🟢 The marketplace is for buying *other* people's things, so showing your own would be odd. The
  app fetches everything, then filters out any item whose seller ID equals yours. Two different
  students therefore see two different marketplaces.
- ⚙️ Client-side `.filter(i => i.sellerId !== user.uid)` over `getDocs(collection(db,'items'))`.
  (Filtering in the browser keeps the code simple and avoids extra database setup; fine for a
  small dataset.)

### 6.4 Shortlisting an item — and the no-duplicates trick
- 🟢 Click **Shortlist** → the app saves a note "you saved this item," and the button turns grey
  and says "Shortlisted" so you know it worked. If you somehow click again, you can't create a
  duplicate, because the note's label is built from *your ID + the item's ID* — saving again just
  lands on the same label.
- ⚙️ `setDoc(doc(db,'shortlists', `${uid}_${itemId}`), {...})`. The deterministic ID makes the
  write **idempotent** (no duplicates). When the marketplace first loads, items already in your
  shortlist render with the disabled "Shortlisted" button from the start (via the pre-loaded
  `Set` of itemIds).

### 6.5 Viewing and removing your shortlist
- 🟢 The Shortlist page lists only your saved items (it reads back only notes with your ID). Each
  has a **Remove** button that deletes that note and makes the row disappear. Because the saves
  live in the cloud, they're still there when you sign in later or on another device.
- ⚙️ `where('userId','==',user.uid)` to read; `deleteDoc(...)` to remove; persistence is handled
  by Firestore server-side.

### 6.6 Signing out
- 🟢 **Sign Out** tells the bouncer to forget you and returns you to the login page. After that,
  the login guard will stop you reaching any inner page until you sign in again.
- ⚙️ `wireSignOut` calls `signOut(auth)` then `window.location.replace('login.html')`.

---

## 7. Glossary

- **Frontend** — the part of an app that runs in your browser and that you can see. (This whole
  project is frontend.)
- **Backend / server** — a computer on the internet that does work behind the scenes. We don't
  run our own; **Firebase** is our backend-as-a-service.
- **The cloud** — computers on the internet that we use instead of owning. Data there is shared
  and permanent.
- **Database** — an organised store of information. Ours is **Firestore**.
- **Collection / document / field** — Firestore's structure: a drawer of folders, each folder
  holding labelled facts. (Like a spreadsheet's table / row / column.)
- **Authentication (Auth)** — proving who you are (the email/password login + the "bouncer").
- **UID** — a user's permanent unique ID number from Firebase Auth.
- **HTML / CSS / JavaScript** — structure / appearance / behaviour.
- **Bootstrap** — a free styling kit so things look good without writing much CSS.
- **Module** — one code file that does one job and can share its functions with others via
  `import`/`export`.
- **Element** — a single thing on the page (a button, a box, an image).
- **Event / event listener** — "something happened" (a click) / the code that waits for it and
  reacts.
- **Render** — to draw something on the screen.
- **Dynamic** — built on the fly by code (vs **hardcoded** = typed permanently into the HTML).
- **Query** — a request to the database for *specific* data ("only items where the seller is me").
- **CDN** — a fast public web address that serves shared libraries (we load Firebase from one).
- **Responsive** — a layout that adapts to phone, tablet, and desktop screen sizes.
- **Asynchronous (async/await)** — code that waits for a slow thing (like the internet) without
  freezing the page; `await` means "pause here until the cloud replies, then continue."

---

## 8. How to Run It and Where to Change Things

### 🟢 To run the app
1. Add your Firebase details — follow **`FIREBASE-SETUP.md`** (create the project, turn on
   email/password login, make a few test users, add some items).
2. Paste your project's keys into **`js/firebase.js`**.
3. In VS Code, right-click **`login.html`** → **Open with Live Server**.
4. Sign in with one of your test accounts.

(It needs an internet connection because Firebase lives in the cloud.)

### 🟢 Where would I change…?
- **The look of a page** (colours, layout, text) → edit that page's **`.html`** file and/or
  **`css/custom.css`**.
- **What happens when you click something** → edit that page's **`.js`** file in `js/`.
- **The login rules** (the guard, sign-out) → **`js/auth.js`**.
- **How an item card looks** → **`js/cards.js`** (changes apply to both Marketplace and My
  Listings at once).
- **The Firebase keys** → **`js/firebase.js`**.
- **The actual items and accounts** → the **Firebase Console** (not in the code at all — that's
  the whole point of using a cloud database).

### ⚙️ Mental model to keep
> The HTML pages are **empty stages**. `firebase.js` provides the **connection**, `auth.js`
> guards the **door**, each page's script **fetches data** from Firestore and uses `cards.js` to
> **render** it, and Bootstrap makes it all **look good**. Change data in the Console, refresh the
> page, and the new data appears — because nothing is hardcoded.

---

*This document describes the project as built for COMP2750/6750 Assessment Task 3 (Part A).
For the marking-facing summary see `README.txt`; for cloud setup see `FIREBASE-SETUP.md`.*
