import { db, USER_ID, GOOGLE_SHEET_WEBAPP_URL, saveToFirebase, loadFromFirebase } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// مراية للشيت - بيضيف في الآخر فقط
async function syncToSheet(row) {
  try {
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row)
    });
    console.log("✅ راح الشيت:", row.date);
  } catch(e) {}
}

function toast(msg){
  let t=document.getElementById('toast-online');
  if(!t){ t=document.createElement('div'); t.id='toast-online'; document.body.appendChild(t); }
  t.textContent=msg;
  t.style.cssText=`position:fixed;top:15px;left:50%;transform:translateX(-50%);background:#0f766e;color:#fff;padding:8px 16px;border-radius:20px;font-weight:800;font-size:12px;z-index:99999`;
  setTimeout(()=>t.remove(),2500);
}

window.showTab = function(tabName){
  document.querySelectorAll('.tab-content').forEach(el=>el.style.display='none');
  document.querySelectorAll('.nav-tab').forEach(el=>el.classList.remove('active'));
  document.getElementById(tabName).style.display='block';
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
}
window.showTop = function(mode){
  document.getElementById('pharmacyApp').style.display = mode==='pharmacy'? 'block':'none';
  document.getElementById('privateApp').style.display = mode==='private'? 'block':'none';
}

// هنا التعديل المهم - لما تدوس حفظ وتصفير
const originalSave = window.saveAndClearDaily;
window.saveAndClearDaily = async function(){
  // 1- احفظ في Firebase (الأساسي)
  if(typeof dailyStore!== 'undefined'){
    await saveToFirebase("dailyStore", dailyStore);
  }
  // 2- ابعت كل صف جديد للشيت كمراية
  if(typeof dailyStore!== 'undefined'){
    let dateVal = document.querySelector('[data-date]')?.dataset.date || new Date().toLocaleDateString('en-GB');
    let rows = dailyStore[dateVal] || [];
    // خد آخر صف انت ضفته بس
    let lastRows = rows.slice(-5); // يبعت آخر 5 صفوف عشان لو دخلت كذا موظف
    for(let r of lastRows){
      if(!r) continue;
      // حول بيانات الصف لشكل الشيت
      await syncToSheet({
        date: dateVal,
        emp: r.emp || r[1] || "",
        shift: r.shift || r[2] || 0,
        diff: r.diff || r[3] || 0,
        val: r.val || r[4] || 0,
        sup: r.sup || r[5] || "",
        insta: r.insta || r[6] || 0,
        voda: r.voda || r[7] || 0
      });
    }
  }
  toast("☁ اتحفظ في السحابة + الشيت (بيكمل)");
  if(originalSave) originalSave();
}

document.addEventListener('DOMContentLoaded', ()=>{ showTop('pharmacy'); });
