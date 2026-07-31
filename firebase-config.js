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

// ✅ اللينك النهائي شغال - الإصدار الأخير
export const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby6LxFC6XXA5Z-gFClv71sVt2_yyn4EUe2OOgnNpZgXJkzBwWIPLRGR-g09gK1dMLeznQ/exec";

// حفظ في Firebase (الأساسي)
export async function saveToFirebase(storeName, data) {
  try {
    const ref = doc(db, "users", USER_ID);
    await setDoc(ref, { [storeName]: data }, { merge: true });
    console.log("✅ Firebase:", storeName);
  } catch(e){ console.error("Firebase Err", e); }
}

// تحميل من Firebase
export async function loadFromFirebase(storeName) {
  try {
    const ref = doc(db, "users", USER_ID);
    const snap = await getDoc(ref);
    return snap.exists()? snap.data()[storeName] : null;
  } catch(e){ return null; }
}

// مراية للشيت - بيكمل تحت القديم - مهم جداً text/plain بدون headers
export async function syncToSheet(row){
  try{
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(row)
    });
    console.log("✅ Sheet:", row.date, row.emp, row.val);
  }catch(e){ console.log("Sheet Err", e); }
}
