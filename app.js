import { GOOGLE_SHEET_WEBAPP_URL } from "./firebase-config.js";

async function pushToSheet(row){
  await fetch(GOOGLE_SHEET_WEBAPP_URL,{
    method:"POST",
    mode:"no-cors",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(row)
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  const btn = document.querySelector('[onclick*="save"]') || document.getElementById('saveBtn');
  if(btn){
    btn.addEventListener('click', async()=>{
      let date = document.getElementById('dailyDateInput')?.value || new Date().toLocaleDateString('en-GB');
      if(typeof dailyStore!== 'undefined' && dailyStore[date]){
        for(let r of dailyStore[date]){
          if(!r?.val) continue;
          await pushToSheet({date:date, emp:r.emp||"", shift:r.shift||0, diff:r.diff||0, val:r.val||0, sup:r.sup||"", insta:r.insta||0, voda:r.voda||0});
        }
      }
    });
  }
});
