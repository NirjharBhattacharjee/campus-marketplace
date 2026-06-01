# Firebase Setup Guide — Campus Marketplace

Follow these steps once, as a group, to make the app work. Everything happens
in the [Firebase Console](https://console.firebase.google.com) plus one edit to
`js/firebase.js`.

---

## 1. Create the Firebase project
1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. Click **Add project** → name it e.g. `campus-marketplace` → Continue.
3. Google Analytics is optional; you can disable it. Click **Create project**.

## 2. Register a Web app and copy the config
1. On the project home, click the **Web** icon `</>` ("Add app").
2. Give it a nickname (e.g. `web`) → **Register app**. (No Hosting needed.)
3. Firebase shows a `firebaseConfig` object. Copy those values.
4. Open **`js/firebase.js`** in this project and replace the placeholder
   `firebaseConfig` with your real values. (Also record them in `README.txt`.)

## 3. Enable Email/Password sign-in and create test users
1. Left menu → **Build → Authentication** → **Get started**.
2. **Sign-in method** tab → click **Email/Password** → toggle **Enable** → Save.
3. **Users** tab → **Add user**. Create **at least 3** users, for example:
   - `user1@students.mq.edu.au` / choose a password
   - `user2@students.mq.edu.au` / choose a password
   - `user3@students.mq.edu.au` / choose a password
4. For each user, copy the **User UID** (the long string in the Users table).
   You'll paste these into the items below. Record them in `README.txt` too.

> The app signs users in with these exact email/password values. There is no
> sign-up page (the brief doesn't require one).

## 4. Create the Firestore database
1. Left menu → **Build → Firestore Database** → **Create database**.
2. Choose a location → **Next**.
3. Start in **test mode** (fine for the demo; it expires after ~30 days). → **Enable**.

   *Optional, more secure rules* (paste in the **Rules** tab and Publish):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Anyone signed in can read items.
       match /items/{itemId} {
         allow read: if request.auth != null;
       }
       // Users can only read/write their OWN shortlist entries.
       match /shortlists/{docId} {
         allow read, write: if request.auth != null
                            && request.resource.data.userId == request.auth.uid;
         allow delete: if request.auth != null
                       && resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

## 5. Add the `items` collection (the listings)
You need **at least 8 items across at least 3 categories**, spread across your
**3 user UIDs**, so Marketplace (other users' items) and My Listings (your own)
both show something.

1. Firestore → **Start collection** → Collection ID: **`items`** → Next.
2. For the first document, leave **Auto-ID** and add these fields:

   | Field         | Type      | Example value                         |
   |---------------|-----------|---------------------------------------|
   | `name`        | string    | `Calculus Textbook`                   |
   | `description` | string    | `2nd edition, barely used`            |
   | `price`       | number    | `45`                                  |
   | `forTrade`    | boolean   | `false`                               |
   | `category`    | string    | `Textbooks`                           |
   | `imageUrl`    | string    | `images/textbook.jpg`                 |
   | `sellerId`    | string    | *(paste user1's UID)*                 |
   | `sellerEmail` | string    | `user1@students.mq.edu.au`            |

3. **Save**, then **Add document** for each remaining item. Vary the
   `sellerId` / `sellerEmail` across your 3 users, and use a few categories
   (e.g. Textbooks, Furniture, Clothing, Electronics).
4. For a **trade-only** item, set `forTrade` to `true` (the price is ignored and
   the card shows "Trade").

> **Most important field:** `sellerId` must be a real **Auth UID** from step 3.
> That's how the app knows whose item it is. If `sellerId` doesn't match any
> signed-in user, the item simply shows in everyone's Marketplace.

Example spread (8 items, 3 sellers, 4 categories):

| name                | category    | price | forTrade | sellerId  |
|---------------------|-------------|-------|----------|-----------|
| Calculus Textbook   | Textbooks   | 45    | false    | user1 UID |
| Desk Lamp           | Furniture   | 15    | false    | user1 UID |
| Hoodie (size M)     | Clothing    | 0     | true     | user1 UID |
| USB-C Hub           | Electronics | 25    | false    | user2 UID |
| Office Chair        | Furniture   | 60    | false    | user2 UID |
| Chemistry Textbook  | Textbooks   | 30    | false    | user2 UID |
| Mechanical Keyboard | Electronics | 70    | false    | user3 UID |
| Winter Jacket       | Clothing    | 40    | false    | user3 UID |

## 6. Images
- Put image files in the **`images/`** folder and set `imageUrl` to
  `images/<filename>` (e.g. `images/textbook.jpg`), **or**
- paste a full external image URL into `imageUrl`.
- If an image is missing, the card shows a grey "No image" placeholder — the app
  still works.

## 7. The `shortlists` collection
You do **not** need to create this. It's created automatically the first time a
user clicks **Shortlist** on the Marketplace page.

## 8. Run and test
1. Open **`login.html`** with **Live Server**.
2. Sign in as **user1** → Marketplace shows user2's and user3's items (not
   user1's). My Listings shows only user1's items.
3. Click **Shortlist** on an item → it changes to "Shortlisted". Open the
   **Shortlist** page → it's there. Reload → still there (it persisted).
4. Click **Remove** → it disappears.
5. **Sign Out** → you're back on the login page. Try opening `marketplace.html`
   directly → it redirects you to login.
6. Sign in as **user2** → different available items and an independent shortlist.

That's the full Part A demo flow. 🎉
