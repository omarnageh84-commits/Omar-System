/* hodor.js - V43 - ارقام بفواصل 10,000 */
let hodorCurrentView = new Date();
let hodorHideMoney = JSON.parse(localStorage.getItem('hodorHideMoney') || 'false');

window.privateStore = window.privateStore || {};
window.privateStore.hodor = window.privateStore.hodor || [];
window.privateStore.hodorConfig = window.privateStore.hodorConfig || {
  totalAmount: 1200,
  daysInMonth: 26,
  targetSalary: 15000
};
var privateStore = window.privateStore;

function safeSave() { if (window.savePrivate) window.savePrivate(); else localStorage.setItem('privateStore', JSON.stringify(window.privateStore)); }
function calcH(inT, outT) { if (!inT ||!outT) return 0; let [ih, im] = inT.split(':').map(Number), [oh, om] = outT.split(':').map(Number); let d = (oh * 60 + om) - (ih * 60 + im); if (d < 0) d += 1440; return d / 60; }

// تنسيق الارقام بفواصل
function fmt(n, d=2) { 
  if (n==null||isNaN(n)) return '0';
  return Number(n).toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:d});
}
function fmtInt(n){ 
  return Math.round(n||0).toLocaleString('en-US'); 
}
function fmtMoney(n){
  return Math.round(n||0).toLocaleString('en-US');
}
function fmtHourPrice(n){
  // سعر الساعة ب 6 ارقام عشرية بس بفاصلة
  return Number(n||0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:6});
}

function parseSmart(s) {
  if (!s) return null;
  s = String(s).trim().replace(/[صم]/g, '').replace(',', '.').trim();
  let h=0,m=0;
  if (s.includes(':')||s.includes('.')){ let p=s.split(/[:\.]/); h=parseInt(p[0])||0; let ms=p[1]||'0'; if(ms.length==1)m=parseInt(ms)*10; else m=parseInt(ms.slice(0,2))||0; }
  else { let v=s.replace(/\D/g,''); if(!v) return null; if(v.length<=2)h=parseInt(v); else if(v.length==3){h=parseInt(v[0]); m=parseInt(v.slice(1))*10;} else {h=parseInt(v.slice(0,2)); m=parseInt(v.slice(2,4));} }
  if(h>23)h=23; if(m>59)m=59; return h*60+m;
}
function fmt12(t){ if(t==null)return''; let h=Math.floor(t/60)%24,m=t%60,ap=h>=12?'م':'ص',h12=h%12||12; return `${h12}:${String(m).padStart(2,'0')} ${ap}`; }
function to24(t){ return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`; }

const importedData = [
  {day:"2026-07-01", in:"08:00", out:"20:00", netHours:"12.00"},
  {day:"2026-07-02", in:"09:20", out:"00:30", netHours:"15.17"},
  {day:"2026-07-03", in:"09:30", out:"15:40", netHours:"6.17"},
  {day:"2026-07-05", in:"08:30", out:"20:30", netHours:"12.00"},
  {day:"2026-07-06", in:"08:50", out:"20:35", netHours:"11.75"},
  {day:"2026-07-07", in:"09:30", out:"20:00", netHours:"10.50"},
  {day:"2026-07-08", in:"10:00", out:"20:00", netHours:"10.00"},
  {day:"2026-07-09", in:"07:00", out:"19:00", netHours:"12.00"},
  {day:"2026-07-10", in:"07:10", out:"16:40", netHours:"9.50"},
  {day:"2026-07-12", in:"08:15", out:"21:00", netHours:"12.75"},
  {day:"2026-07-13", in:"08:00", out:"20:00", netHours:"12.00"},
  {day:"2026-07-14", in:"07:10", out:"19:15", netHours:"12.08"},
  {day:"2026-07-15", in:"07:00", out:"19:00", netHours:"12.00"},
  {day:"2026-07-16", in:"08:00", out:"20:40", netHours:"12.67"},
  {day:"2026-07-17", in:"07:00", out:"16:30", netHours:"9.50"},
  {day:"2026-07-19", in:"07:55", out:"19:00", netHours:"11.08"},
  {day:"2026-07-20", in:"07:50", out:"20:00", netHours:"12.17"},
  {day:"2026-07-21", in:"09:20", out:"23:15", netHours:"13.92"},
  {day:"2026-07-22", in:"07:00", out:"19:35", netHours:"12.58"},
  {day:"2026-07-23", in:"08:10", out:"19:35", netHours:"11.42"},
  {day:"2026-07-24", in:"08:10", out:"19:35", netHours:"11.42"},
  {day:"2026-07-26", in:"07:00", out:"19:00", netHours:"12.00"},
  {day:"2026-07-27", in:"07:10", out:"22:50", netHours:"15.67"},
  {day:"2026-07-28", in:"08:00", out:"19:00", netHours:"11.00"},
  {day:"2026-07-29", in:"08:30", out:"18:00", netHours:"9.50"},
  {day:"2026-07-30", in:"06:00", out:"18:00", netHours:"12.00"},
  {day:"2026-07-31", in:"06:00", out:"18:00", netHours:"12.00"},
];

function importHodorData(){
  if(!window.privateStore) window.privateStore={};
  if(!privateStore.hodor) privateStore.hodor=[];
  let count=0;
  importedData.forEach(r=>{
    if(!privateStore.hodor.find(x=>x.day===r.day)){
      privateStore.hodor.push({id:Date.now().toString()+Math.random().toString(36).slice(2), day:r.day, in:r.in, out:r.out, netHours:r.netHours});
      count++;
    }
  });
  savePrivate();
  renderHodor();
  alert('✅ تم استيراد '+count+' يوم من جدول يوليو');
}


function renderHodor(){
  let p=document.getElementById('pane-hodor'); if(!p)return;
  let cfg=window.privateStore.hodorConfig;
  let curM=hodorCurrentView.getMonth(), curY=hodorCurrentView.getFullYear();
  let monthList=[...(window.privateStore.hodor||[])].filter(r=>{let d=new Date(r.day); return d.getMonth()===curM&&d.getFullYear()===curY;}).sort((a,b)=>new Date(a.day)-new Date(b.day));

  let totalHours=monthList.reduce((s,r)=>s+parseFloat(r.netHours||0),0);
  let hourPrice = cfg.daysInMonth>0? (cfg.totalAmount / cfg.daysInMonth) : 0;
  let totalMoney = totalHours * hourPrice;
  let totalHoursNeededForTarget = hourPrice>0? (cfg.targetSalary / hourPrice) : 0;
  let remainingHours = Math.max(0, totalHoursNeededForTarget - totalHours);
  let workedDays = monthList.length;
  let remainingDays = Math.max(1, cfg.daysInMonth - workedDays);
  let dailyNeeded = workedDays===0? (totalHoursNeededForTarget / cfg.daysInMonth) : (remainingHours / remainingDays);
  let progress = cfg.targetSalary>0? Math.min(100,(totalMoney/cfg.targetSalary)*100) : 0;

  p.innerHTML=`
  <div style="font-family:'Tajawal',sans-serif;direction:rtl">
  <style>
.hodor-layout{display:grid;grid-template-columns:1fr 390px;gap:16px;align-items:start}
@media(max-width:1100px){.hodor-layout{grid-template-columns:1fr}}
.card-pro{background:#fff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.05)}
.card-head{padding:14px 18px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;background:#f8fafc;flex-wrap:wrap;gap:8px}
.th-pro{display:grid;grid-template-columns:120px 1fr 1fr 90px 44px;gap:8px;padding:12px 16px;background:#0f172a;color:#94a3b8;font-size:10px;font-weight:800;text-align:center}
.tr-pro{display:grid;grid-template-columns:120px 1fr 1fr 90px 44px;gap:8px;padding:10px 12px;border-bottom:1px solid #f8fafc;align-items:center}
.tr-pro input{width:100%;padding:10px 6px;border-radius:12px;border:1.5px solid #e2e8f0;font-size:13px;font-weight:800;text-align:center;outline:none}
.wadaa-card{background:#0f172a;border-radius:20px;overflow:hidden;border:1px solid #1e293b;box-shadow:0 10px 30px rgba(0,0,0,.15);transition:.3s}
.wadaa-card.hidden-card{filter:blur(18px);opacity:.4;pointer-events:none;user-select:none}
.wadaa-header{padding:16px 18px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#0f172a,#1e293b);border-bottom:1px solid #1e293b}
.wadaa-row{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #1e293b}
.wadaa-label{color:#94a3b8;font-size:13px;font-weight:700;display:flex;gap:8px}
.wadaa-label b{color:#e2e8f0}
.wadaa-value{font-weight:900;font-size:16px;color:#fff;direction:ltr;text-align:left;min-width:120px;font-family:'Tajawal', monospace}
.wadaa-value.gold{color:#facc15}.wadaa-value.green{color:#4ade80}.wadaa-value.red{color:#fb7185}
.wadaa-input{width:110px;padding:8px 10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#facc15;font-weight:900;text-align:center;font-size:15px;outline:none}
.progress-track{height:8px;background:#1e293b;border-radius:20px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,#22c55e,#4ade80);border-radius:20px}
  </style>

  <div class="hodor-layout">
    <div class="card-pro" style="order:1">
      <div class="card-head">
        <b>📋 سجل الحضور - ${fmtInt(workedDays)} يوم / ${fmt(totalHours,1)} س</b>
        <div style="display:flex;gap:6px;align-items:center">
          <button onclick="toggleHideMoney()" style="border:1.5px solid ${hodorHideMoney?'#facc15':'#e2e8f0'};background:${hodorHideMoney?'#0f172a':'#fff'};color:${hodorHideMoney?'#facc15':'#0f172a'};border-radius:12px;padding:7px 14px;font-weight:800;font-size:11px;cursor:pointer">${hodorHideMoney?'👁 إظهار الجدول':'🙈 إخفاء الجدول'}</button>
          <button onclick="hodorCurrentView.setMonth(hodorCurrentView.getMonth()-1);renderHodor()" style="border:1px solid #e2e8f0;background:#fff;border-radius:10px;width:32px;height:32px">‹</button>
          <div style="font-size:12px;font-weight:900;min-width:110px;text-align:center;background:#fff;border:1px solid #e2e8f0;padding:6px 10px;border-radius:10px">${hodorCurrentView.toLocaleDateString('ar-EG',{month:'long',year:'numeric'})}</div>
          <button onclick="hodorCurrentView.setMonth(hodorCurrentView.getMonth()+1);renderHodor()" style="border:1px solid #e2e8f0;background:#fff;border-radius:10px;width:32px;height:32px">›</button>
          <button onclick="importHodorData()" style="background:#facc15;color:#000;border:none;padding:8px 14px;border-radius:12px;font-weight:900;font-size:11px;cursor:pointer;margin-left:6px">📥 استيراد يوليو</button><button onclick="addEmptyDay()" style="background:#0f172a;color:#fff;border:none;padding:8px 16px;border-radius:12px;font-weight:900;font-size:12px;cursor:pointer">+ يوم</button>
        </div>
      </div>
      <div class="th-pro"><span>التاريخ</span><span>دخول</span><span>خروج</span><span>صافي</span><span></span></div>
      <div style="max-height:700px;overflow:auto">
      ${monthList.map(r=>{let inT=r.in?fmt12(parseInt(r.in.split(':')[0])*60+parseInt(r.in.split(':')[1])):'';let outT=r.out?fmt12(parseInt(r.out.split(':')[0])*60+parseInt(r.out.split(':')[1])):'';let hrs=parseFloat(r.netHours||0);return `<div class="tr-pro"><div><input type="date" value="${r.day}" onchange="updateDay('${r.id}',this.value)"></div><div><input type="text" placeholder="7" value="${inT}" onfocus="this.select()" onblur="smartTime(this,'${r.id}','in')"></div><div><input type="text" placeholder="19.3" value="${outT}" onfocus="this.select()" onblur="smartTime(this,'${r.id}','out')"></div><div style="background:#0f172a;color:#fff;padding:8px 10px;border-radius:12px;font-size:12px;font-weight:900;text-align:center">${fmt(hrs,1)} س</div><div><button onclick="deleteHodor('${r.id}')" style="width:32px;height:32px;border-radius:10px;border:1px solid #fee2e2;background:#fff;color:#ef4444;cursor:pointer">✕</button></div></div>`}).join('') || '<div style="padding:80px;text-align:center;color:#94a3b8"><div style="font-size:44px">📅</div><b>مفيش حضور</b><br><small>7 = 7:00 ص - 19.3 = 7:30 م</small></div>'}
      </div>
    </div>

    <div class="wadaa-card ${hodorHideMoney?'hidden-card':''}" style="order:2">
      <div class="wadaa-header"><b style="color:#fff;font-size:13px">💎 الوضع الحالي</b><span style="background:#1e293b;color:#facc15;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:900">${fmt(progress,0)}%</span></div>
      <div class="wadaa-row"><div class="wadaa-label">⏱️ <b>الساعة</b></div><div><input class="wadaa-input" type="number" value="${cfg.totalAmount}" oninput="window.privateStore.hodorConfig.totalAmount=+this.value||0;safeSave()" onblur="renderHodor()"></div></div>
      <div class="wadaa-row"><div class="wadaa-label">📅 <b>كم يوم</b></div><div class="wadaa-value">${fmtInt(cfg.daysInMonth)} يوم</div></div>
      <div class="wadaa-row"><div class="wadaa-label">💲 <b>سعر الساعة</b></div><div class="wadaa-value gold">${fmtHourPrice(hourPrice)}</div></div>
      <div class="wadaa-row"><div class="wadaa-label">⏰ <b>عدد الساعات</b></div><div class="wadaa-value">${fmt(totalHours,1)} س</div></div>
      <div class="wadaa-row"><div class="wadaa-label">💰 <b>الصافي</b></div><div class="wadaa-value green">${fmtMoney(totalMoney)} ج</div></div>
      <div class="wadaa-row"><div class="wadaa-label">🎯 <b>المطلوب</b></div><div><input class="wadaa-input" type="number" value="${cfg.targetSalary}" oninput="window.privateStore.hodorConfig.targetSalary=+this.value||0;safeSave()" onblur="renderHodor()"></div></div>
      <div class="wadaa-row" style="background:#1e293b"><div class="wadaa-label">📈 <b style="color:#fb7185">المطلوب يومياً</b></div><div class="wadaa-value red">${fmt(dailyNeeded,1)} س</div></div>
      <div style="padding:14px 18px;background:#020617"><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><div style="display:flex;justify-content:space-between;margin-top:10px"><small style="color:#64748b;font-weight:700">فاضل: <b style="color:#facc15">${fmtMoney(Math.max(0,cfg.targetSalary-totalMoney))} ج</b></small><small style="color:#64748b;font-weight:700">ناقص: <b style="color:#fff">${fmt(remainingHours,1)} س</b></small></div><div style="display:flex;justify-content:space-between;margin-top:6px"><small style="color:#64748b;font-size:10px">ناقص: ${fmt(remainingDays,0)} يوم</small><small style="color:#facc15;font-size:10px;font-weight:900">فاضل: ${fmtMoney(cfg.targetSalary)} ج</small></div></div>
    </div>
  </div>`;
}

function toggleHideMoney(){ hodorHideMoney=!hodorHideMoney; localStorage.setItem('hodorHideMoney', JSON.stringify(hodorHideMoney)); renderHodor(); }
function updateDay(id,v){ let r=window.privateStore.hodor.find(x=>x.id===id); if(!r)return; r.day=v; safeSave(); renderHodor(); }
function addEmptyDay(){ let base=hodorCurrentView; let ds=new Date(base.getFullYear(),base.getMonth(),1).toISOString().slice(0,10); for(let i=1;i<=31;i++){let t=new Date(base.getFullYear(),base.getMonth(),i).toISOString().slice(0,10); if(!window.privateStore.hodor.find(r=>r.day===t)){ds=t;break;}} let h=calcH('09:00','21:00'); window.privateStore.hodor.push({id:Date.now().toString(),day:ds,in:'09:00',out:'21:00',netHours:h.toFixed(2)}); safeSave(); renderHodor(); }
function deleteHodor(id){ if(!confirm('تمسح اليوم ده؟'))return; window.privateStore.hodor=window.privateStore.hodor.filter(r=>r.id!==id); safeSave(); renderHodor(); }
window.smartTime=function(el,id,type){let t=el.value.trim(); if(!t)return; let tot=parseSmart(t); if(tot==null)return; el.value=fmt12(tot); let rec=window.privateStore.hodor.find(x=>x.id===id); if(!rec)return; rec[type]=to24(tot); rec.netHours=calcH(rec.in,rec.out).toFixed(2); safeSave(); renderHodor();};
