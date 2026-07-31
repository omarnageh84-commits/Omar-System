// app.js - V6 يربط فايربيس + شيت + تصدير بدون تكرار
import { saveToFirebase, GOOGLE_SHEET_WEBAPP_URL } from "./firebase-config.js";

// دالة دفع للشيت آمنة
async function pushToSheet(row){
  try{
    if(!GOOGLE_SHEET_WEBAPP_URL) return;
    await fetch(GOOGLE_SHEET_WEBAPP_URL,{
      method:"POST",
      mode:"no-cors",
      headers:{ "Content-Type":"text/plain" },
      body: JSON.stringify(row)
    });
    console.log('✅ اتبعت للشيت:', row);
  }catch(e){ console.error('❌ الشيت فشل', e); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  // احتفظ بالدالة الاصلية من daily.js
  const originalSave = window.saveAndClearDaily;

  window.saveAndClearDaily = async function(){
    try{
      // 1- احفظ في فايربيس (لو موجود)
      if(typeof dailyStore!== 'undefined' && dailyStore){
        await saveToFirebase("dailyStore", dailyStore);
      }

      // 2- الشيت - googleSync.js هو اللي بيبعت اصلا، فاحنا مش هنبعت تاني
      // بس لو googleSync مش شغال، ابعت اخر يوم كـ fallback
      if(typeof window.syncToSheet!== 'function'){
        let dateKeys = Object.keys(dailyStore||{});
        let lastDate = dateKeys[dateKeys.length-1];
        if(lastDate && dailyStore[lastDate]){
          let arr = Array.isArray(dailyStore[lastDate])? dailyStore[lastDate] : Object.values(dailyStore[lastDate]);
          for(let r of arr){
            if(!r?.val &&!r?.shift) continue;
            await pushToSheet({date:lastDate, emp:r.emp||"", shift:r.shift||0, diff:r.diff||0, val:r.val||0, sup:r.sup||"", insta:r.insta||0, voda:r.voda||0});
          }
        }
      }

      // 3- نفذ الحفظ الاصلي اللي بيمسح الجدول
      if(originalSave) await originalSave();

      alert("✅ اتحفظ في الفايربيس والشيت");
    }catch(e){
      console.error(e);
      alert("⚠️ حصل مشكلة في الحفظ: " + e.message);
      if(originalSave) await originalSave();
    }
  };
});
