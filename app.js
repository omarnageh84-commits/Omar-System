
// ===== Omar Pharmacy System - ONLINE SYNC v1 =====
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxN4dJfdFCtDSiu6VXAvB2hxb2CsATxZk-EXe0_FRh8GstNjWYaDonuCpNilO6_J5Q7AA/exec";

// ==== دالة الربط مع جوجل شيت ====
async function saveToSheet(type, payload){
  try{
    // نستخدم no-cors عشان جوجل شيت
    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({type: type, ...payload})
    });
    console.log("✅ اتبعت لـ Google Sheet:", type);
    showToastOnline("☁️ اتحفظت اونلاين");
  }catch(e){ console.log("Sheet error", e); }
}

function showToastOnline(msg){
  let t=document.getElementById('toast-online');
  if(!t){ t=document.createElement('div'); t.id='toast-online'; document.body.appendChild(t); }
  t.textContent=msg;
  t.style.cssText=`position:fixed;top:15px;left:50%;transform:translateX(-50%);background:#0f766e;color:#fff;padding:8px 16px;border-radius:20px;font-weight:800;font-size:11px;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,.2)`;
  setTimeout(()=>t.remove(),2000);
}

// ===== استيراد السنة تلقائي (151 يوم) - يحمل مرة واحدة بس =====
(async function(){
  try{
    if(!localStorage.getItem('dailyStore')){
      let r = await fetch('dailyStore_FINAL_2026.json');
      if(r.ok){
        let data = await r.json();
        localStorage.setItem('dailyStore', JSON.stringify(data));
        console.log('✅ تم استيراد '+Object.keys(data).length+' يوم');
      }
    }
  }catch(e){ console.log('استيراد السنة:', e); }
})();

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
    let target = document.getElementById(tabName);
    if (target) target.style.display = 'block';
    let btn = document.querySelector(`[data-tab="${tabName}"]`);
    if (btn) btn.classList.add('active');
    if (tabName === 'daily' && typeof renderDaily === 'function') renderDaily();
    if (tabName === 'total' && typeof renderTotal === 'function') renderTotal();
    if (tabName === 'purchases' && typeof renderPurchases === 'function') renderPurchases();
    if (tabName === 'sales' && typeof renderSales === 'function') renderSales();
    if (tabName === 'database' && typeof renderDatabase === 'function') renderDatabase();
}

function showPrivateTab(name){
    document.querySelectorAll('.private-tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.private-pane').forEach(p=>p.classList.remove('active'));
    let b = document.querySelector(`[data-private="${name}"]`);
    if(b) b.classList.add('active');
    let pane = document.getElementById(`pane-${name}`);
    if(pane) pane.classList.add('active');
}

function showTop(mode){
    let pharmSection = document.getElementById('pharmacyApp');
    let privSection = document.getElementById('privateApp');
    if(pharmSection && privSection){
        pharmSection.style.display = mode==='pharmacy' ? 'block' : 'none';
        privSection.style.display = mode==='private' ? 'block' : 'none';
    }
    document.querySelectorAll('.top-btn').forEach(b=>b.classList.remove('active'));
    let topBtn = document.querySelector(`[data-top="${mode}"]`);
    if(topBtn) topBtn.classList.add('active');
    if(mode==='pharmacy'){ showTab('daily'); } 
    else { if(typeof renderPrivate==='function') renderPrivate(); }
}

// ===== Override دوال الحفظ الأصلية عشان تبعت اونلاين =====
const originalSaveDaily = typeof saveDaily !== 'undefined' ? saveDaily : null;
window.saveDaily = function(){
  if(originalSaveDaily) originalSaveDaily();
  // ابعت لليومية
  try{
    let k = document.getElementById('dailyDateInput')?.value;
    if(k && typeof dailyStore !== 'undefined' && dailyStore[k]){
      saveToSheet("daily", {date: k, data: dailyStore[k]});
    }
  }catch(e){}
}

const originalSavePurch = typeof savePurch !== 'undefined' ? savePurch : null;
window.savePurch = function(){
  if(originalSavePurch) originalSavePurch();
  try{
    let last = purchaseStore && purchaseStore.length ? purchaseStore[purchaseStore.length-1] : {};
    saveToSheet("purchases", {
      supplier: last.supplier || "عام",
      date: last.date || new Date().toLocaleDateString('ar-EG'),
      purch: last.value || 0,
      retPurch: 0, notif:0, sales:0, retSales:0, payments:0,
      safi: last.value || 0
    });
  }catch(e){}
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showTab(btn.dataset.tab);
        });
    });
    document.querySelectorAll('.top-btn').forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            e.preventDefault();
            let mode = btn.dataset.top;
            if(!mode){
                if(btn.textContent.includes('الخاص')) mode='private';
                else mode='pharmacy';
            }
            showTop(mode);
        });
    });
    document.addEventListener('click',(e)=>{
        let t=e.target.closest('.private-tab');
        if(t && t.dataset.private){
            e.preventDefault();
            showPrivateTab(t.dataset.private);
        }
    });
    showTop('pharmacy');
    console.log("☁️ Omar Online Sync Active - Sheet Linked");
});
