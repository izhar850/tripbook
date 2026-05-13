import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export async function registerTransporter({ companyName, ownerName, email, password }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

 await setDoc(doc(db, "users", user.uid), {
  uid: user.uid,
  companyName,
  ownerName,
  email,
  role: "transporter",

  mobile: "",
  officePhone: "",
  gstNo: "",
  address: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",

  profileCompleted: false,
  createdAt: new Date(),
});

  return user;
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function logoutUser() {
  await signOut(auth);
}