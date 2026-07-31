import { saveToFirebase, syncToSheet, GOOGLE_SHEET_WEBAPP_URL } from "./firebase-config.js";

async function pushToSheet(row){
  await fetch(GOOGLE_SHEET_WEBAPP_URL,{ method:"POST", mode:"no-cors", body: JSON.stringify(row) });
}

document.addEventListener('DOMContentLoaded', ()=>{
  const original = window.saveAndClearDaily;
  window.saveAndClearDaily = async function(){
    if(typeof dailyStore!=='undefined'){
      await saveToFirebase("dailyStore", dailyStore);
    }
    let dateKeys = Object.keys(dailyStore||{});
    let lastDate = dateKeys[dateKeys.length-1];
    if(lastDate && dailyStore[lastDate]){
      for(let r of dailyStore[lastDate]){
        if(!r?.val) continue;
        await pushToSheet({date:lastDate, emp:r.emp||"", shift:r.shift||0, diff:r.diff||0, val:r.val||0, sup:r.sup||"", insta:r.insta||0, voda:r.voda||0});
      }
    }
    if(original) await original();
    alert("✅ اتحفظ في السحابة + الشيت بيكمل في الآخر");
  };
});
