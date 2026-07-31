// ==================== الاجمالي - نهائي احترافي - مبيعات كاش فقط ====================
let activeMonthTab = localStorage.getItem('activeMonthTab') || null;
let monthCashTotal = 0; // اجمالي مبيعات الشهر كاش فقط

function renderTotal() {
  let el = document.getElementById('total'); if (!el) return;
  el.innerHTML = `<div id="total-wrap">
    <style>
  .glass{background:#fff;border-radius:16px;padding:14px;margin-bottom:14px;border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(0,0,0,.05)}
  .filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .filters input{padding:8px 12px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:11px;font-weight:700}
  .filters button{padding:9px 16px;border:none;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer;color:#fff;transition:.2s}
  .filters button:hover{transform:translateY(-1px)}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:13px 6px;font-size:11px;text-align:center;letter-spacing:.3px}
    td{padding:11px 6px;text-align:center;border-bottom:1px solid #f1f5f9;font-weight:700}
    tr:hover td{background:#f8fafc}
  .safi{background:linear-gradient(135deg,#0f172a,#334155);color:#fff;border-radius:10px;font-weight:900;box-shadow:0 2px 6px rgba(0,0,0,.2)}
  .month-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
  .month-tab{padding:10px 20px;border-radius:24px;border:1.5px solid #e2e8f0;background:#fff;font-weight:900;font-size:12px;cursor:pointer;transition:.2s}
  .month-tab.active{background:#0f172a;color:#fff;border-color:#0f172a;box-shadow:0 4px 10px rgba(15,23,42,.3)}
  .profit-input{width:70px;padding:7px;border-radius:10px;border:1.5px solid #cbd5e1;text-align:center;font-weight:900;background:#fff}
  .kpi{padding:10px 14px;border-radius:12px;font-weight:900;font-size:12px;text-align:center;min-width:110px}
    </style>

    <div class="glass" style="background:linear-gradient(135deg,#ffffff,#f8fafc)">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px">
        <div style="display:flex;gap:8px;align-items:center">
          <div style="width:36px;height:36px;background:#0f172a;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px">⚙️</div>
          <div>
            <div style="font-weight:900;font-size:13px">توزيع الارباح حسب التصنيف</div>
            <div style="font-size:10px;color:#64748b">المبيعات = كاش فقط (قيمة الشيفت) بدون انستا وفودافون</div>
          </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <div class="kpi" style="background:#e0f2fe;border:1px solid #bae6fd">ربح مطلوب % <input id="desiredProfit" type="number" class="profit-input" style="width:60px;margin-top:4px" oninput="saveProfitConfig()"></div>
          <div class="kpi" style="background:#fef3c7;border:1px solid #fde68a">مبيعات متوقعة <input id="expectedSales" type="number" class="profit-input" style="width:90px;margin-top:4px" oninput="saveProfitConfig()"></div>
          <button onclick="saveProfitConfig();renderTotalTable()" style="background:#0f172a;padding:8px 14px;border-radius:10px;color:#fff;font-weight:800">حفظ</button>
        </div>
      </div>
      <div id="profitDistTable" style="overflow:auto"></div>
    </div>

    <div class="glass">
      <div class="filters">
        <input id="totalFrom" placeholder="من تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <input id="totalTo" placeholder="إلى تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <button onclick="clearTotalFilters()" style="background:#64748b">مسح الفلتر</button>
        <button onclick="fetchSheetData()" style="background:#16a34a">🔄 مزامنة من الشيت</button>
        <button onclick="exportTotalExcel()" style="background:#0f172a">📥 تصدير Excel</button>
        <span id="monthCashLabel" style="margin-right:auto;font-weight:900;font-size:11px;background:#f1f5f9;padding:8px 12px;border-radius:20px"></span>
      </div>
      <div id="monthTabs" class="month-tabs"></div>
      <div id="totalTableCard"></div>
    </div>
  </div>`;
  loadProfitConfig();
  renderTotalTable();
}

function parseDateSmartTotal(v){ if(!v) return ''; v=v.trim().replace(/-/g,'/'); let p=v.split('/'); let y=new Date().getFullYear(); if(p.length==2) return p[0]+'/'+p[1]+'/'+y; if(p.length==3){ if(p[2].length==2) p[2]='20'+p[2]; return p.join('/'); } return v; }
function parseDateForFilterTotal(s){ if(!s) return null; let p=s.split('/'); if(p.length!==3) return null; return new Date(p[2],p[1]-1,p[0]); }
function calcNumTotal(v){ try{ if(!v) return 0; let e=(v+'').toString().replace(/,/g,'').trim(); if(/[\+\-\*\/]/.test(e)) return Function('"use strict";return ('+e+')')(); return parseFloat(e)||0; }catch{ return 0; } }
function clearTotalFilters(){ let a=document.getElementById('totalFrom'), b=document.getElementById('totalTo'); if(a) a.value=''; if(b) b.value=''; renderTotalTable(); }
function exportTotalExcel(){ let html=document.getElementById('totalTableCard').innerHTML; let blob=new Blob(['\uFEFF'+html],{type:'application/vnd.ms-excel'}); let url=URL.createObjectURL(blob); let a=document.createElement('a'); a.href=url; a.download='الاجمالي_'+(activeMonthTab||'')+'.xls'; a.click(); }

function getSupplierClassifications(){
  let cats=new Set();
  ['suppliers','suppliersStore','db_suppliers'].forEach(k=>{
    try{ let raw=localStorage.getItem(k); if(!raw) return; let data=JSON.parse(raw); if(Array.isArray(data)) data.forEach(o=>{ let c=o?.category||o?.التصنيف; if(c) cats.add(c.toString().trim()); }); }catch(e){}
  });
  try{ document.querySelectorAll('select').forEach(sel=>{ [...sel.options].forEach(op=>{ let t=op.textContent.trim(); if(['مخزن دواء','شركة دواء','عام','كوزمتكس','مصاريف','المصروفات'].includes(t)) cats.add(t.replace('المصروفات','مصاريف')); }); }); }catch(e){}
  if(cats.size===0) ['مخزن دواء','شركة دواء','عام','كوزمتكس','مصاريف'].forEach(c=>cats.add(c));
  return [...cats].filter(Boolean);
}

function loadProfitConfig(){
  let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":50,"expected":100000,"dist":{"مخزن دواء":40,"شركة دواء":30,"عام":10,"كوزمتكس":15,"مصاريف":5}}');
  setTimeout(()=>{
    if(document.getElementById('desiredProfit')) document.getElementById('desiredProfit').value=cfg.desired||50;
    if(document.getElementById('expectedSales')) document.getElementById('expectedSales').value=cfg.expected||100000;
  },30);

  let cats=getSupplierClassifications();
  let dist=cfg.dist||{};
  let expected=cfg.expected||100000;
  let desired=cfg.desired||50;
  let remainingPerc=100-desired;
  let profitValue=expected*desired/100;
  let remainingValue=expected*remainingPerc/100;

  let html=`
  <div style="overflow:auto;border-radius:14px;border:1.5px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,.04)">
  <table style="min-width:900px">
    <thead>
      <tr>
        <th style="border-radius:0 14px 0 0">البند</th>
        <th>نسبة الربح المطلوبة</th>
        <th>المبيعات (كاش فقط)</th>
        <th>المتبقي بعد الربح</th>
        ${cats.map(c=>`<th>${c}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr style="background:#f8fafc">
        <td style="background:#1e293b;color:#fff;font-weight:900">مثال (النسبة %)</td>
        <td><span style="background:#0f172a;color:#fff;padding:4px 10px;border-radius:20px">${desired}%</span></td>
        <td>100%</td>
        <td>${remainingPerc}%</td>
        ${cats.map(c=>`<td><input data-cat="${c}" value="${dist[c]||0}" oninput="saveProfitConfig()" class="profit-input"> %</td>`).join('')}
      </tr>
      <tr>
        <td style="background:#0f172a;color:#fff">بناء ع المبيعات المفروض كده</td>
        <td style="color:#16a34a;font-size:13px;background:#f0fdf4">${profitValue.toLocaleString()}</td>
        <td style="font-size:13px;background:#fffbeb">${expected.toLocaleString()}</td>
        <td style="font-size:13px;background:#f0f9ff">${remainingValue.toLocaleString()}</td>
        ${cats.map(c=>{ let p=dist[c]||0; let val=remainingValue*p/100; return `<td data-val="${c}" style="background:#f8fafc">${val.toLocaleString()}</td>`; }).join('')}
      </tr>
      <tr style="background:#fef9c3">
        <td style="background:#f59e0b;color:#000;font-weight:900">الفعلي بقا (من الشهر الحالي)</td>
        <td data-actual="profit" style="font-weight:900">-</td>
        <td data-actual="sales" style="font-weight:900">-</td>
        <td data-actual="remaining" style="font-weight:900">-</td>
        ${cats.map(c=>`<td data-actual="${c}" style="font-weight:900">-</td>`).join('')}
      </tr>
      <tr style="background:#fee2e2">
        <td style="background:#dc2626;color:#fff;font-weight:900">الفرق (المشاكل)</td>
        <td data-diff="profit">-</td>
        <td data-diff="sales">-</td>
        <td data-diff="remaining">-</td>
        ${cats.map(c=>`<td data-diff="${c}" style="font-weight:900">-</td>`).join('')}
      </tr>
    </tbody>
  </table>
  </div>
  <div id="distSum" style="text-align:center;margin-top:10px;font-weight:800;font-size:11px;background:#f8fafc;padding:8px;border-radius:10px;border:1px dashed #cbd5e1"></div>
  `;
  document.getElementById('profitDistTable').innerHTML=html;
  calcProfitPreview();
}

function saveProfitConfig(){
  let desired=calcNumTotal(document.getElementById('desiredProfit')?.value||50);
  let expected=calcNumTotal(document.getElementById('expectedSales')?.value||100000);
  let dist={};
  document.querySelectorAll('input[data-cat]').forEach(inp=>{ dist[inp.dataset.cat]=calcNumTotal(inp.value); });
  localStorage.setItem('profitConfigTotal', JSON.stringify({desired, expected, dist}));
  loadProfitConfig();
  renderTotalTable();
}

function calcProfitPreview(){
  try{
    let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{}');
    let sum=Object.values(cfg.dist||{}).reduce((a,b)=>a+b,0);
    let el=document.getElementById('distSum');
    if(el) el.innerHTML=`مجموع التوزيع: ${sum}% ${sum===100?'<span style="color:#16a34a">✓ تمام</span>':'<span style="color:#dc2626">لازم 100%</span>'} | اجمالي مبيعات الشهر الحالي كاش: ${monthCashTotal.toLocaleString()} جنيه (بدون انستا وفودافون)`;
  }catch(e){}
}

function goToDaily(dateKey){ localStorage.setItem('jumpToDate', dateKey); if(typeof showTab==='function') showTab('daily'); if(typeof renderDaily==='function') setTimeout(()=>renderDaily(),200); }
function goToSupplier(supName){ if(!supName||supName=='-') return; localStorage.setItem('supplierFilter', supName); if(typeof showTab==='function') showTab('qawaed'); }

function renderTotalTable(){
  try{
    let dailyStore=JSON.parse(localStorage.getItem('dailyStore')||'{}');
    let fromV=document.getElementById('totalFrom')?.value||'', toV=document.getElementById('totalTo')?.value||'';
    let fromD=parseDateForFilterTotal(fromV), toD=parseDateForFilterTotal(toV);
    const monthNames=['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','اغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'];

    let months={};
    let sortedDates=Object.keys(dailyStore).sort((a,b)=>{ let da=parseDateForFilterTotal(a), db=parseDateForFilterTotal(b); if(!da||!db) return 0; return db-da; });

    sortedDates.forEach(dateKey=>{
      let d=parseDateForFilterTotal(dateKey); if(!d) return;
      if(fromD && d<fromD) return; if(toD && d>toD) return;
      let monthKey=`${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}`;
      if(!months[monthKey]) months[monthKey]={days:[],monthNum:d.getMonth(),year:d.getFullYear()};
      let data=dailyStore[dateKey]; if(!Array.isArray(data)) return;
      let empRows={}, instaSum=0, vodaSum=0;
      data.forEach(it=>{
        if(!it||!it.id) return;
        if(it.id.startsWith('t1_')){
          let m=it.id.match(/t1_r(\d+)_c(\d+)/); if(!m) return;
          let r=m[1], c=m[2]; if(!empRows[r]) empRows[r]={emp:'',shift:0,diff:0,val:0,sup:'',cat:''};
          if(c==='1') empRows[r].emp=(it.val||'').trim();
          if(c==='2') empRows[r].shift=calcNumTotal(it.val);
          if(c==='3') empRows[r].diff=calcNumTotal(it.val);
          if(c==='4') empRows[r].cat=(it.val||'').trim();
          if(c==='5') empRows[r].sup=(it.val||'').trim();
          if(c==='6') empRows[r].val=calcNumTotal(it.val);
        }
        if(it.id.includes('insta_')) instaSum+=calcNumTotal(it.val);
        if(it.id.includes('voda_')) vodaSum+=calcNumTotal(it.val);
      });
      months[monthKey].days.push({dateKey, empRows, instaSum, vodaSum});
    });

    let monthKeys=Object.keys(months).sort((a,b)=> b.localeCompare(a));
    if(!activeMonthTab ||!months[activeMonthTab]){ activeMonthTab=monthKeys[0]||null; if(activeMonthTab) localStorage.setItem('activeMonthTab',activeMonthTab); }

    document.getElementById('monthTabs').innerHTML=monthKeys.map(m=>{
      let isActive=m===activeMonthTab?'active':'';
      let label=monthNames[months[m].monthNum];
      return `<div class="month-tab ${isActive}" onclick="activeMonthTab='${m}';localStorage.setItem('activeMonthTab','${m}');renderTotalTable()">${label}</div>`;
    }).join('') || '<div style="font-size:11px">مفيش بيانات</div>';

    // حساب المبيعات كاش فقط للشهر الحالي
    let rows=''; monthCashTotal=0; let totalCatActual={}; let totalInsta=0, totalVoda=0;
    let activeData=months[activeMonthTab]?.days||[];
    activeData.forEach(({dateKey, empRows, instaSum, vodaSum})=>{
      totalInsta+=instaSum; totalVoda+=vodaSum;
      Object.values(empRows).forEach(r=>{
        if(!r.emp &&!r.sup && r.shift==0 && r.diff==0 && r.val==0) return;
        monthCashTotal+=r.shift; // كاش فقط
        if(r.cat) totalCatActual[r.cat]=(totalCatActual[r.cat]||0)+r.val;
        let safi=r.shift + r.diff - r.val; // الصافي بدون انستا وفودافون لانهم ربح صيدلية
        let safiWithProfit = safi + (Object.keys(empRows).indexOf(Object.keys(empRows)[0])===0? 0 : 0); // هنسيبه كاش فقط
        rows+=`<tr>
          <td onclick="goToDaily('${dateKey}')">${dateKey}</td>
          <td onclick="goToDaily('${dateKey}')">${r.emp||'-'}</td>
          <td onclick="goToDaily('${dateKey}')">${r.shift?r.shift.toLocaleString():'-'}</td>
          <td style="${r.diff<0?'color:#dc2626':'color:#16a34a'}" onclick="goToDaily('${dateKey}')">${r.diff||0}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')">${r.cat?`<span style="background:#f1f5f9;padding:3px 7px;border-radius:10px;font-size:9px">${r.cat}</span>`:''} ${r.val?r.val.toLocaleString():'-'}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')">${r.sup||'-'}</td>
          <td style="color:#7c3aed;font-weight:900" onclick="goToDaily('${dateKey}')">${instaSum?instaSum.toLocaleString()+' ↻ ربح': '-'}</td>
          <td style="color:#dc2626;font-weight:900" onclick="goToDaily('${dateKey}')">${vodaSum?vodaSum.toLocaleString()+' ↻ ربح': '-'}</td>
          <td class="safi" onclick="goToDaily('${dateKey}')">${safi.toLocaleString()}</td>
        </tr>`;
      });
    });

    let cashLabel=document.getElementById('monthCashLabel');
    if(cashLabel) cashLabel.textContent=`مبيعات ${activeMonthTab?monthNames[months[activeMonthTab].monthNum]:''} كاش: ${monthCashTotal.toLocaleString()} جنيه - انستا: ${totalInsta.toLocaleString()} - فودافون: ${totalVoda.toLocaleString()} (ارباح منفصلة)`;

    // تحديث الفعلي
    setTimeout(()=>{
      try{
        let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{}');
        let desired=cfg.desired||50;
        let expected=cfg.expected||100000;
        let actualProfit=monthCashTotal*desired/100;
        document.querySelectorAll('[data-actual]').forEach(td=>{
          let k=td.getAttribute('data-actual');
          if(k==='sales') td.textContent=monthCashTotal.toLocaleString();
          if(k==='profit') td.textContent=actualProfit.toLocaleString();
          if(k==='remaining') td.textContent=(monthCashTotal-actualProfit).toLocaleString();
          if(totalCatActual[k]!==undefined) td.textContent=totalCatActual[k].toLocaleString();
        });
        document.querySelectorAll('[data-diff]').forEach(td=>{
          let k=td.getAttribute('data-diff');
          let valEl=document.querySelector(`[data-val="${k}"]`);
          let actEl=document.querySelector(`[data-actual="${k}"]`);
          if(valEl && actEl){
            let ev=calcNumTotal(valEl.textContent);
            let av=calcNumTotal(actEl.textContent);
            let diff=av-ev;
            td.textContent=(diff>0?'+':'')+diff.toLocaleString();
            td.style.color=diff>0?'#dc2626':'#16a34a';
          }
        });
      }catch(e){}
      calcProfitPreview();
    },150);

    document.getElementById('totalTableCard').innerHTML=`<div class="glass"><b>📅 ${activeMonthTab?monthNames[months[activeMonthTab].monthNum]+' '+months[activeMonthTab].year:''} - الكاش فقط هو اللي داخل في المبيعات</b><div style="overflow:auto;max-height:70vh;margin-top:10px"><table><thead><tr><th>تاريخ اليوم</th><th>الموظف</th><th>قيمة الشيفت (كاش)</th><th>العجز/الزيادة</th><th>قيمة المورد [التصنيف]</th><th>اسم مورد</th><th>انستا (ربح)</th><th>فودافون (ربح)</th><th>الصافي كاش</th></tr></thead><tbody>${rows||'<tr><td colspan=9>مفيش بيانات</td></tr>'}</tbody></table></div></div>`;
  }catch(e){ console.error(e); document.getElementById('totalTableCard').innerHTML='Error: '+e.message; }
}
