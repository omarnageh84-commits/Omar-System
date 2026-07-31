// Omar System - Firebase + Sheet Mirror v2 - لا يمسح القديم
import { GOOGLE_SHEET_WEBAPP_URL } from "./firebase-config.js";
const GOOGLE_SHEET_URL = GOOGLE_SHEET_WEBAPP_URL;

async function saveToSheet(payload){
  try{
    await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    showToastOnline("☁ اتحفظ سحابة + شيت");
  }catch(e){ console.log(e); }
}

function showToastOnline(msg){
  let t=document.getElementById('toast-online');
  if(!t){ t=document.createElement('div'); t.id='toast-online'; document.body.appendChild(t); }
  t.textContent=msg;
  t.style.cssText=`position:fixed;top:15px;left:50%;transform:translateX(-50%);background:#0f766e;color:#fff;padding:8px 16px;border-radius:20px;font-weight:800;font-size:11px;z-index:99999`;
  setTimeout(()=>t.remove(),2000);
}

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
        pharmSection.style.display = mode==='pharmacy'? 'block' : 'none';
        privSection.style.display = mode==='private'? 'block' : 'none';
    }
    document.querySelectorAll('.top-btn').forEach(b=>b.classList.remove('active'));
    let topBtn = document.querySelector(`[data-top="${mode}"]`);
    if(topBtn) topBtn.classList.add('active');
    if(mode==='pharmacy'){ showTab('daily'); } else { if(typeof renderPrivate==='function') renderPrivate(); }
}

window.saveDaily = function(){
  if(typeof dailyStore === 'undefined') return;
  let k = document.getElementById('dailyDateInput')?.value;
  if(!k ||!dailyStore[k]) return;
  let d = dailyStore[k];
  if(typeof saveDailyToFirebase === 'function') saveDailyToFirebase(k,d);
  saveToSheet({
    date: k,
    emp: d.emp || "",
    shift: d.shift || 0,
    diff: d.diff || 0,
    val: d.val || 0,
    sup: d.sup || "",
    insta: d.insta || 0,
    voda: d.voda || 0
  });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); showTab(btn.dataset.tab); });
    });
    document.querySelectorAll('.top-btn').forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            e.preventDefault();
            let mode = btn.dataset.top || (btn.textContent.includes('الخاص')? 'private' : 'pharmacy');
            showTop(mode);
        });
    });
    document.addEventListener('click',(e)=>{
        let t=e.target.closest('.private-tab');
        if(t && t.dataset.private){ e.preventDefault(); showPrivateTab(t.dataset.private); }
    });
    showTop('pharmacy');
    console.log("✅ Omar v2 - Sheet Mirror Active (Append Only)");
});
