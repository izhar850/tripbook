import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUbkDGR_jmbJXQqhAYYMbLmv5SlA792fU",
  authDomain: "tripbook-371fa.firebaseapp.com",
  projectId: "tripbook-371fa",
  storageBucket: "tripbook-371fa.firebasestorage.app",
  messagingSenderId: "313011544698",
  appId: "1:313011544698:web:8314ba9a739cc6f7e791c3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);