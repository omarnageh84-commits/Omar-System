import { GOOGLE_SHEET_WEBAPP_URL } from "./firebase-config.js";

async function pushToSheet(row){
  // مهم جداً: text/plain عشان جوجل يقبلها
  await fetch(GOOGLE_SHEET_WEBAPP_URL,{
    method:"POST",
    mode:"no-cors",
    body: JSON.stringify(row)
  });
  console.log("✅ اتبعت للشيت:", row.date, row.emp, row.val);
}

window.pushDailyToSheet = async function(dateStr, entries){
  if(!entries) return;
  for(let r of entries){
    if(!r?.val &&!r?.emp) continue;
    await pushToSheet({
      date: dateStr,
      emp: r.emp || "",
      shift: Number(r.shift)||0,
      diff: Number(r.diff)||0,
      val: Number(r.val)||0,
      sup: r.sup || "",
      insta: Number(r.insta)||0,
      voda: Number(r.voda)||0
    });
  }
}

// اربطه بزر حفظ وتصفير
setTimeout(()=>{
  let btn = document.querySelector('button.bg-emerald-700, button:contains("حفظ وتصفير")');
  document.querySelectorAll('button').forEach(b=>{
    if(b.textContent.includes('حفظ وتصفير')){
      b.addEventListener('click', async()=>{
        let d = new Date().toLocaleDateString('en-GB'); // هات تاريخ النهاردة
        // دور على تاريخ 31/07/2026 اللي انت فيه
        let active = "31/07/2026";
        if(typeof dailyStore!== 'undefined' && dailyStore[active]){
          await window.pushDailyToSheet(active, dailyStore[active]);
        }
      });
    }
  });
},2000);
