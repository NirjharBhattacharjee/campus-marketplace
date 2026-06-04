============================================================================
 CAMPUS MARKETPLACE  -  COMP2750/6750 Assessment Task 3 (Part A)
============================================================================

A simple web application where Macquarie University students sign in, browse
items listed by other students, view their own listings, and shortlist items
they are interested in. Built with HTML, Bootstrap, JavaScript and Firebase
(Authentication + Cloud Firestore).

----------------------------------------------------------------------------
 HOW TO RUN
----------------------------------------------------------------------------
1. Open this folder in VS Code.
2. Make sure the Firebase config is filled in (see "FIREBASE CONFIG" below and
   the step-by-step guide in FIREBASE-SETUP.md).
3. Right-click "login.html" and choose "Open with Live Server".
   (Or run any static server from this folder, e.g.  python3 -m http.server)
4. Sign in with one of the test accounts listed below.

Note: the pages use Firebase loaded from the internet, so the demo machine
needs an internet connection. Bootstrap is loaded locally from node_modules,
so it keeps working offline.

----------------------------------------------------------------------------
 FIREBASE CONFIG   (paste into js/firebase.js)
----------------------------------------------------------------------------
Get this from: Firebase Console -> Project settings -> Your apps -> Web app.

    apiKey:            ____________________________________
    authDomain:        ____________________________________
    projectId:         ____________________________________
    storageBucket:     ____________________________________
    messagingSenderId: ____________________________________
    appId:             ____________________________________

----------------------------------------------------------------------------
 TEST USER ACCOUNTS   (created in Firebase Console -> Authentication)
----------------------------------------------------------------------------
At least 3 accounts are required so the marker can see the per-user filtering.

    Email                          | Password         | UID (from Auth tab)
    -------------------------------+------------------+--------------------
    user1@students.mq.edu.au       | __________       | ___________________
    user2@students.mq.edu.au       | __________       | ___________________
    user3@students.mq.edu.au       | __________       | ___________________

----------------------------------------------------------------------------
 PAGES
----------------------------------------------------------------------------
    login.html        Sign-in page (Firebase Authentication).
    index.html        Welcome page - greets the user, links to the 3 areas.
    marketplace.html  All items from OTHER users; shortlist button per item.
    myListing.html    Only the signed-in user's own items.
    shortlist.html    The user's shortlisted items; remove button per item.

Every page except login redirects to login.html if no user is signed in.

----------------------------------------------------------------------------
 FIRESTORE DATA MODEL
----------------------------------------------------------------------------
Collection "items"  (one document per listing):
    name         string   e.g. "Calculus Textbook"
    description  string   e.g. "2nd edition, light highlighting"
    price        number   e.g. 45            (ignored when forTrade is true)
    forTrade     boolean  true => shows "Trade" instead of a price
    category     string   e.g. "Textbooks" / "Furniture" / "Electronics"
    imageUrl     string   e.g. "images/textbook.jpg"  or a full URL
    sellerId     string   the Auth UID of the user who owns this item
    sellerEmail  string   that user's email (shown on the card)

Collection "shortlists"  (one document per user+item, id = "UID_ITEMID"):
    userId       string   the Auth UID of the user who shortlisted it
    itemId       string   the items document id
    itemName     string   copied from the item (for quick display)
    itemImageUrl string   copied from the item
    itemPrice    string   copied/formatted from the item ("$45" or "Trade")
    forTrade     boolean
    createdAt    timestamp

See FIREBASE-SETUP.md for exact, click-by-click setup and seeding steps.

----------------------------------------------------------------------------
 PROJECT STRUCTURE
----------------------------------------------------------------------------
    *.html                  the five pages (+ unused signup.html)
    js/firebase.js          Firebase init (PASTE YOUR CONFIG HERE)
    js/auth.js              shared sign-in guard + sign-out helper
    js/cards.js             shared item-card renderer
    js/login.js             sign-in logic
    js/welcome.js           welcome page logic
    js/marketplace.js       marketplace + shortlisting logic
    js/myListing.js         my-listings logic
    js/shortlist.js         shortlist + remove logic
    css/custom.css          small tweaks on top of Bootstrap
    images/                 item images
    node_modules/bootstrap  Bootstrap 5.3.8 (CSS + JS)
