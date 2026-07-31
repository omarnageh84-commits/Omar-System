import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUuFRP12_gEp8WjVH582rOvX5JrBk4DA",
  authDomain: "omar-system-2026.firebaseapp.com",
  projectId: "omar-system-2026",
  storageBucket: "omar-system-2026.firebasestorage.app",
  messagingSenderId: "136389596066",
  appId: "1:136389596066:web:e8585b28fd81db06e818fb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const USER_ID = "omar_main";
export const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbymAX_drOLObItZtYvQlv2DwiTwUp8gDrPrtQyNyLUZVTUH6GTJINe2xnIUYvFwEIHlcw/exec";

// حفظ في Firebase
export async function saveToFirebase(storeName, data) {
  const ref = doc(db, "users", USER_ID);
  await setDoc(ref, { [storeName]: data }, { merge: true });
}
export async function loadFromFirebase() {
  const ref = doc(db, "users", USER_ID);
  const snap = await getDoc(ref);
  return snap.exists()? snap.data() : {};
}
