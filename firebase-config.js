// Omar System - FINAL - Firebase أساسي + Google Sheet مراية بتكمل
import { GOOGLE_SHEET_WEBAPP_URL } from "./firebase-config.js";

async function pushToSheet(row){
  try{
    await fetch(GOOGLE_SHEET_WEBAPP_URL,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(row)
    });
    console.log("Sheet OK", row.date);
  }catch(e){ console.log("Sheet Err", e); }
}

window.pushDailyToSheet = async function(dateStr, entries){
  if(!entries) return;
  let list = Array.isArray(entries)? entries : Object.values(entries);
  for(let r of list){
    if(!r ||!r.val &&!r.emp) continue;
    await pushToSheet({
      date: dateStr,
      emp: r.emp || r.B || "",
      shift: r.shift || 0,
      diff: r.diff || 0,
      val: r.val || 0,
      sup: r.sup || r.supplier || "",
      insta: r.insta || 0,
      voda: r.voda || 0
    });
  }
}

// لما تدوس حفظ وتصفير - هيحفظ في Firebase + يبعت للشيت
let originalSave = window.saveAndClearDaily || window.saveDaily;
window.saveAndClearDaily = window.saveDaily = async function(){
  if(typeof dailyStore!== 'undefined' && typeof saveToFirebase === 'function'){
    await saveToFirebase("dailyStore", dailyStore);
  }
  let activeDate = document.getElementById('dailyDateInput')?.value || Object.keys(dailyStore || {}).pop();
  if(activeDate && dailyStore[activeDate]){
    await window.pushDailyToSheet(activeDate, dailyStore[activeDate]);
  }
  if(originalSave) originalSave();
  alert("✅ اتحفظ سحابة + الشيت بيكمل");
}

// باقي دوال التابات
window.showTab = window.showTab || function(n){ document.querySelectorAll('.tab-content').forEach(e=>e.style.display='none'); document.getElementById(n).style.display='block'; }
window.showTop = window.showTop || function(m){ document.getElementById('pharmacyApp').style.display=m==='pharmacy'?'block':'none'; document.getElementById('privateApp').style.display=m==='private'?'block':'none'; }
