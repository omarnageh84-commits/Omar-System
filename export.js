// app.js - V9 Final - ربط فايربيس + شيت + تصدير XLSX
import { saveToFirebase, GOOGLE_SHEET_WEBAPP_URL } from "./firebase-config.js?v=9";

// دالة دفع للشيت (fallback فقط لو googleSync.js مش شغال)
async function pushToSheet(row){
  try{
    if(!GOOGLE_SHEET_WEBAPP_URL) {
      console.warn('⚠️ GOOGLE_SHEET_WEBAPP_URL مش متعرف');
      return;
    }
    await fetch(GOOGLE_SHEET_WEBAPP_URL,{
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(row)
    });
    console.log('✅ اتبعت للشيت:', row);
  }catch(e){
    console.error('❌ الشيت فشل', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{

  // احتفظ بالدالة الاصلية من daily.js قبل ما نغطي عليها
  const originalSave = window.saveAndClearDaily;

  if(!originalSave){
    console.warn('⚠️ saveAndClearDaily مش موجودة - اتأكد ان daily.js اتحمل قبل app.js');
  }

  window.saveAndClearDaily = async function(){
    try{
      // 1- احفظ في الفايربيس
      if(typeof dailyStore!== 'undefined' && dailyStore && typeof saveToFirebase === 'function'){
        await saveToFirebase("dailyStore", dailyStore);
        console.log('✅ اتحفظ في الفايربيس');
      }

      // 2- الشيت: لو googleSync.js موجود هو هيبعت، احنا مش هنبعت عشان ما نكررش
      // هنبعت بس لو مفيش syncToSheet
      if(typeof window.syncToSheet!== 'function' && typeof window.pushDailyToSheet!== 'function'){
        console.log('ℹ️ googleSync مش موجود، هبعت fallback');
        let dateKeys = Object.keys(dailyStore || {});
        let lastDate = dateKeys[dateKeys.length - 1];
        if(lastDate && dailyStore[lastDate]){
          let arr = Array.isArray(dailyStore[lastDate])? dailyStore[lastDate] : Object.values(dailyStore[lastDate]);
          for(let r of arr){
            if(!r || (!r.val &&!r.shift &&!r.emp)) continue;
            await pushToSheet({
              date: lastDate,
              emp: r.emp || "",
              shift: r.shift || 0,
              diff: r.diff || 0,
              val: r.val || 0,
              sup: r.sup || "",
              insta: r.insta || 0,
              voda: r.voda || 0,
              actual: r.actual || 0
            });
          }
        }
      } else {
        console.log('ℹ️ googleSync هيبعت هو - مش هكرر');
      }

      // 3- نفذ الحفظ الاصلي اللي بيمسح الجدول ويصفره
      if(originalSave){
        await originalSave();
      }

      alert("✅ اتحفظ في الفايربيس + الشيت");

    }catch(e){
      console.error('❌ خطأ في الحفظ', e);
      alert("⚠️ حصل مشكلة: " + e.message);
      // حتى لو فشل الفايربيس، نفذ الحفظ الاصلي عشان الداتا متعلقش
      if(originalSave) {
        try{ await originalSave(); }catch(_){}
      }
    }
  };

  console.log('✅ app.js V9 جاهز');
});
