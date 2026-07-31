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

// اللينك الجديد النهائي - الإصدار 17
export const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx7rPrkIqZOR-Q22nRRoouUrbJnNiQ92za17Zw3QF5m-Y12efdy0aep8D_LgkesJdPQ2g/exec";

export async function saveToFirebase(storeName, data) {
  const ref = doc(db, "users", USER_ID);
  await setDoc(ref, { [storeName]: data }, { merge: true });
}
