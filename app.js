import { GOOGLE_SHEET_WEBAPP_URL } from "./firebase-config.js";

async function pushToSheet(row){
  await fetch(GOOGLE_SHEET_WEBAPP_URL,{
    method:"POST",
    mode:"no-cors",
    body: JSON.stringify(row)
  });
}

window.pushDailyToSheet = async function(dateStr, entries){
  if(!entries) return;
  for(let r of entries){
    if(!r?.val && r?.val!==0) continue;
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
