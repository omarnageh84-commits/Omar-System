// ==================== الاجمالي - نهائي - اسم شهر بس + جدول احترافي ====================
let activeMonthTab = localStorage.getItem('activeMonthTab') || null;

function renderTotal() {
  let el = document.getElementById('total'); if (!el) return;
  el.innerHTML = `<div id="total-wrap">
    <style>
   .glass{background:#fff;border-radius:14px;padding:12px;margin-bottom:12px;border:1px solid #e2e8f0}
   .filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
   .filters input{padding:8px 12px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:11px;font-weight:700}
   .filters button{padding:8px 16px;border:none;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer;color:#fff}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#0f172a;color:#fff;padding:12px 6px;font-size:11px;text-align:center}
    td{padding:10px 6px;text-align:center;border-bottom:1px solid #f1f5f9;cursor:pointer;font-weight:700}
    tr:hover td{background:#f8fafc}
   .safi{background:#0f172a;color:#fff;border-radius:8px;font-weight:900}
   .month-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
   .month-tab{padding:10px 18px;border-radius:22px;border:1.5px solid #e2e8f0;background:#fff;font-weight:900;font-size:12px;cursor:pointer;transition:.2s}
   .month-tab.active{background:#0f172a;color:#fff;border-color:#0f172a;transform:scale(1.05)}
   .profit-input{width:70px;padding:7px;border-radius:8px;border:1.5px solid #cbd5e1;text-align:center;font-weight:900}
   .profit-card{border:1.5px solid #e2e8f0;border-radius:14px;padding:0;overflow:hidden;background:#fff}
   .profit-card-head{background:#f8fafc;padding:8px;font-size:10px;font-weight:800;color:#64748b;text-align:center;border-bottom:1px solid #e2e8f0}
    </style>

    <div class="glass">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">
        <b>⚙️ توزيع الارباح - حسب التصنيف</b>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:11px;font-weight:800">نسبة الربح اللي عاوز تكسبها %</span>
          <input id="desiredProfit" type="number" class="profit-input" style="width:80px" oninput="saveProfitConfig()" placeholder="20">
          <span style="font-size:11px;font-weight:800">اجمالي المبيعات المتوقعة</span>
          <input id="expectedSales" type="number" class="profit-input" style="width:110px" oninput="saveProfitConfig()" placeholder="100000">
          <button onclick="saveProfitConfig();renderTotalTable()" style="background:#0f172a;padding:7px 12px;border:none;border-radius:8px;color:#fff;font-weight:800;font-size:10px">حفظ</button>
        </div>
      </div>
      <div id="profitDistTable" style="margin-top:10px;overflow:auto"></div>
    </div>

    <div class="glass">
      <div class="filters">
        <input id="totalFrom" placeholder="من تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <input id="totalTo" placeholder="إلى تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <button onclick="clearTotalFilters()" style="background:#64748b">مسح الفلتر</button>
        <button onclick="fetchSheetData()" style="background:#16a34a">🔄 مزامنة من الشيت</button>
        <button onclick="exportTotalExcel()" style="background:#0f172a">📥 تصدير Excel</button>
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
    try{
      let raw=localStorage.getItem(k); if(!raw) return;
      let data=JSON.parse(raw);
      if(Array.isArray(data)) data.forEach(o=>{ let c=o?.category||o?.التصنيف; if(c) cats.add(c.toString().trim()); });
    }catch(e){}
  });
  try{
    document.querySelectorAll('select').forEach(sel=>{
      [...sel.options].forEach(op=>{
        let t=op.textContent.trim();
        if(['مخزن دواء','شركة دواء','عام','كوزمتكس','مصاريف','المصروفات'].includes(t)) cats.add(t.replace('المصروفات','مصاريف'));
      });
    });
  }catch(e){}
  if(cats.size===0) ['مخزن دواء','شركة دواء','عام','كوزمتكس','مصاريف'].forEach(c=>cats.add(c));
  return [...cats].filter(Boolean);
}

function loadProfitConfig(){
  let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":20,"expected":100000,"dist":{"مخزن دواء":35,"شركة دواء":25,"عام":10,"كوزمتكس":20,"مصاريف":10}}');
  setTimeout(()=>{
    if(document.getElementById('desiredProfit')) document.getElementById('desiredProfit').value=cfg.desired||20;
    if(document.getElementById('expectedSales')) document.getElementById('expectedSales').value=cfg.expected||100000;
  },30);

  let cats=getSupplierClassifications();
  let dist=cfg.dist||{};
  let expected=cfg.expected||100000;
  let desired=cfg.desired||20;
  let remainingPerc = 100 - desired;
  let remainingValue = expected * remainingPerc / 100;
  let profitValue = expected * desired / 100;

  // جدول احترافي زي الصورة اللي بعتها - صف نسب وصف قيم وصف فعلي
  let html=`
  <div style="overflow:auto;border:1.5px solid #e2e8f0;border-radius:14px">
  <table style="min-width:800px">
    <thead>
      <tr>
        <th>البند</th>
        <th>نسبة الربح المطلوبة</th>
        <th>المبيعات</th>
        <th>المتبقي بعد الربح</th>
        ${cats.map(c=>`<th>${c}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr style="background:#f8fafc">
        <td style="background:#0f172a;color:#fff">مثال (النسبة %)</td>
        <td style="font-size:14px;color:#0f172a">${desired}%</td>
        <td>100%</td>
        <td>${remainingPerc}%</td>
        ${cats.map(c=>`<td><input data-cat="${c}" value="${dist[c]||0}" oninput="saveProfitConfig()" class="profit-input" type="number"> %</td>`).join('')}
      </tr>
      <tr>
        <td style="background:#0f172a;color:#fff">بناء ع المبيعات المفروض كده</td>
        <td style="color:#16a34a;font-size:13px">${profitValue.toLocaleString()}</td>
        <td style="font-size:13px">${expected.toLocaleString()}</td>
        <td style="font-size:13px">${remainingValue.toLocaleString()}</td>
        ${cats.map(c=>{
          let p=dist[c]||0;
          let val=remainingValue * p / 100;
          return `<td data-val="${c}" style="font-size:12px">${val.toLocaleString()}</td>`;
        }).join('')}
      </tr>
      <tr style="background:#fffbeb">
        <td style="background:#f59e0b;color:#000">الفعلي بقا</td>
        <td data-actual="profit">-</td>
        <td data-actual="sales">-</td>
        <td data-actual="remaining">-</td>
        ${cats.map(c=>`<td data-actual="${c}">-</td>`).join('')}
      </tr>
      <tr style="background:#fef2f2">
        <td style="background:#dc2626;color:#fff">الفرق (المشاكل)</td>
        <td data-diff="profit">-</td>
        <td data-diff="sales">-</td>
        <td data-diff="remaining">-</td>
        ${cats.map(c=>`<td data-diff="${c}">-</td>`).join('')}
      </tr>
    </tbody>
  </table>
  </div>
  <div id="distSum" style="text-align:center;margin-top:8px;font-weight:800;font-size:11px"></div>
  `;

  document.getElementById('profitDistTable').innerHTML=html;
  calcProfitPreview();
}

function saveProfitConfig(){
  let desired=calcNumTotal(document.getElementById('desiredProfit')?.value||20);
  let expected=calcNumTotal(document.getElementById('expectedSales')?.value||100000);
  let dist={};
  document.querySelectorAll('input[data-cat]').forEach(inp=>{ dist[inp.dataset.cat]=calcNumTotal(inp.value); });
  localStorage.setItem('profitConfigTotal', JSON.stringify({desired, expected, dist}));
  loadProfitConfig();
}

function calcProfitPreview(){
  try{
    let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{}');
    let sum=Object.values(cfg.dist||{}).reduce((a,b)=>a+b,0);
    let el=document.getElementById('distSum');
    if(el) el.innerHTML=`مجموع التوزيع: ${sum}% ${sum===100?'<span style="color:#16a34a">✓ تمام</span>':'<span style="color:#dc2626">لازم 100%</span>'} - الحل ف صف تاني زي ما طلبت`;
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
      if(!months[monthKey]) months[monthKey]={days:[],monthNum:d.getMonth()};
      let data=dailyStore[dateKey]; if(!Array.isArray(data)) return;
      let empRows={}, instaSum=0, vodaSum=0, catSums={};
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
          if(c==='6') { empRows[r].val=calcNumTotal(it.val); if(empRows[r].cat) catSums[empRows[r].cat]=(catSums[empRows[r].cat]||0)+calcNumTotal(it.val); }
        }
        if(it.id.includes('insta_')) instaSum+=calcNumTotal(it.val);
        if(it.id.includes('voda_')) vodaSum+=calcNumTotal(it.val);
      });
      months[monthKey].days.push({dateKey, empRows, instaSum, vodaSum, catSums});
    });

    // ===== تبويبات باسم الشهر فقط بدون تواريخ =====
    let monthKeys=Object.keys(months).sort((a,b)=> b.localeCompare(a));
    if(!activeMonthTab ||!months[activeMonthTab]){ activeMonthTab=monthKeys[0]||null; if(activeMonthTab) localStorage.setItem('activeMonthTab',activeMonthTab); }

    document.getElementById('monthTabs').innerHTML=monthKeys.map(m=>{
      let isActive=m===activeMonthTab?'active':'';
      let monthNum=months[m].monthNum;
      let label=monthNames[monthNum]; // بس اسم الشهر
      return `<div class="month-tab ${isActive}" onclick="activeMonthTab='${m}';localStorage.setItem('activeMonthTab','${m}');renderTotalTable()">${label}</div>`;
    }).join('') || '<div style="font-size:11px">مفيش بيانات</div>';

    // جدول الاجمالي + حساب الفعلي للجدول الاحترافي
    let rows=''; let totalSales=0; let totalCatActual={};
    let activeData=months[activeMonthTab]?.days||[];
    activeData.forEach(({dateKey, empRows, instaSum, vodaSum, catSums})=>{
      let first=true;
      Object.values(empRows).forEach(r=>{
        if(!r.emp &&!r.sup && r.shift==0 && r.diff==0 && r.val==0) return;
        totalSales+=r.shift;
        if(r.cat) totalCatActual[r.cat]=(totalCatActual[r.cat]||0)+r.val;
        let safi=r.shift + r.diff - r.val + (first? (instaSum + vodaSum):0);
        rows+=`<tr>
          <td onclick="goToDaily('${dateKey}')">${dateKey}</td>
          <td onclick="goToDaily('${dateKey}')">${r.emp||'-'}</td>
          <td onclick="goToDaily('${dateKey}')">${r.shift?r.shift.toLocaleString():'-'}</td>
          <td style="${r.diff<0?'color:#dc2626':'color:#16a34a'}" onclick="goToDaily('${dateKey}')">${r.diff||0}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')">${r.cat?`<span style="background:#f1f5f9;padding:2px 6px;border-radius:10px;font-size:9px">${r.cat}</span>`:''} ${r.val?r.val.toLocaleString():'-'}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')">${r.sup||'-'}</td>
          <td onclick="goToDaily('${dateKey}')">${first&&instaSum?instaSum.toLocaleString():'-'}</td>
          <td onclick="goToDaily('${dateKey}')">${first&&vodaSum?vodaSum.toLocaleString():'-'}</td>
          <td class="safi" onclick="goToDaily('${dateKey}')">${safi.toLocaleString()}</td>
        </tr>`;
        first=false;
      });
    });

    // تحديث صف الفعلي والفرق في الجدول الاحترافي
    setTimeout(()=>{
      try{
        let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{}');
        let expected=cfg.expected||100000;
        let desired=cfg.desired||20;
        let remainingPerc=100-desired;
        let profitActual = totalSales * desired / 100; // مثال
        document.querySelectorAll('[data-actual]').forEach(td=>{
          let k=td.getAttribute('data-actual');
          if(k==='sales') td.textContent=totalSales.toLocaleString();
          if(k==='profit') td.textContent=profitActual.toLocaleString();
          if(k==='remaining') td.textContent=(totalSales-profitActual).toLocaleString();
          if(totalCatActual[k]!==undefined) td.textContent=totalCatActual[k].toLocaleString();
        });
        document.querySelectorAll('[data-diff]').forEach(td=>{
          let k=td.getAttribute('data-diff');
          // الفرق = الفعلي - المفروض
          let catEl=document.querySelector(`[data-val="${k}"]`);
          let actualEl=document.querySelector(`[data-actual="${k}"]`);
          if(catEl && actualEl){
            let expectedVal=calcNumTotal(catEl.textContent);
            let actualVal=calcNumTotal(actualEl.textContent);
            let diff=actualVal-expectedVal;
            td.textContent=diff.toLocaleString();
            td.style.color=diff>0?'#dc2626':'#16a34a';
          }
        });
      }catch(e){}
    },100);

    document.getElementById('totalTableCard').innerHTML=`<div class="glass"><b>📅 ${activeMonthTab?monthNames[months[activeMonthTab].monthNum]:''} - اضغط على الصف يوديك لليوم</b><div style="overflow:auto;max-height:70vh;margin-top:10px"><table><thead><tr><th>تاريخ اليوم</th><th>الموظف</th><th>قيمة الشيفت</th><th>العجز/الزيادة</th><th>قيمة المورد [التصنيف]</th><th>اسم مورد</th><th>انستا</th><th>فودافون</th><th>الصافي</th></tr></thead><tbody>${rows||'<tr><td colspan=9>مفيش بيانات</td></tr>'}</tbody></table></div></div>`;
  }catch(e){ console.error(e); document.getElementById('totalTableCard').innerHTML='Error: '+e.message; }
}
