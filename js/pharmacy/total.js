// ==================== الاجمالي - احترافي جدا - مبيعات من اجمالي البيع كاش ====================
let activeMonthTab = localStorage.getItem('activeMonthTab') || null;
let monthCashTotal = 0;

function renderTotal() {
  let el = document.getElementById('total'); if (!el) return;
  el.innerHTML = `<div id="total-wrap">
    <style>
   .glass{background:#fff;border-radius:18px;padding:16px;margin-bottom:16px;border:1px solid #eef2f7;box-shadow:0 6px 18px rgba(15,23,42,.06)}
   .filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
   .filters input{padding:8px 12px;border-radius:12px;border:1.5px solid #e2e8f0;font-size:11px;font-weight:700}
   .filters button{padding:9px 16px;border:none;border-radius:12px;font-weight:800;font-size:11px;cursor:pointer;color:#fff;transition:.2s}
   .month-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
   .month-tab{padding:10px 20px;border-radius:24px;border:1.5px solid #e2e8f0;background:#fff;font-weight:900;font-size:12px;cursor:pointer}
   .month-tab.active{background:#0f172a;color:#fff;border-color:#0f172a;box-shadow:0 6px 14px rgba(0,0,0,.15)}
    table{width:100%;border-collapse:separate;border-spacing:0;font-size:11px;overflow:hidden;border-radius:14px}
    th{background:#0f172a;color:#fff;padding:14px 8px;font-size:11px;text-align:center;font-weight:900}
    td{padding:12px 6px;text-align:center;border-bottom:1px solid #f1f5f9;font-weight:700;background:#fff}
    tr:last-child td{border-bottom:none}
   .safi{background:#0f172a;color:#fff;border-radius:10px;font-weight:900}
   .profit-input{width:64px;padding:6px;border-radius:10px;border:1.5px solid #cbd5e1;text-align:center;font-weight:900}
   .kpi-card{flex:1;min-width:140px;background:linear-gradient(135deg,#f8fafc,#fff);border:1px solid #e2e8f0;border-radius:14px;padding:12px;text-align:center}
   .kpi-card b{display:block;font-size:18px;margin-top:4px}
   .badge{padding:4px 10px;border-radius:20px;font-size:10px;font-weight:900;display:inline-block}
    </style>

    <div class="glass">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div style="display:flex;gap:10px;align-items:center">
          <div style="width:42px;height:42px;background:linear-gradient(135deg,#0f172a,#334155);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff">📊</div>
          <div><div style="font-weight:900;font-size:14px">توزيع الارباح - حسب التصنيف</div><div style="font-size:10px;color:#64748b">المبيعات = اجمالي بيع الشهر كاش فقط (قيمة الشيفت) - انستا وفودافون ارباح منفصلة للصيدلية</div></div>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <div class="kpi-card" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#bfdbfe">
            <span style="font-size:10px;color:#1e40af">مبيعات الشهر كاش</span>
            <b id="autoSalesKPI" style="color:#1e40af">0</b>
            <span style="font-size:9px;color:#64748b">من اجمالي البيع</span>
          </div>
          <div class="kpi-card" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-color:#bbf7d0">
            <span style="font-size:10px;color:#166534">نسبة الربح المطلوبة %</span>
            <input id="desiredProfit" type="number" class="profit-input" style="width:70px;margin-top:6px;font-size:14px" oninput="saveProfitConfig()">
          </div>
          <button onclick="saveProfitConfig();renderTotalTable()" style="background:#0f172a;padding:10px 16px;border-radius:12px;color:#fff;font-weight:900">تحديث</button>
        </div>
      </div>
      <div id="profitDistTable" style="margin-top:14px;overflow:auto"></div>
    </div>

    <div class="glass">
      <div class="filters">
        <input id="totalFrom" placeholder="من تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <input id="totalTo" placeholder="إلى تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <button onclick="clearTotalFilters()" style="background:#64748b">مسح الفلتر</button>
        <button onclick="fetchSheetData()" style="background:#16a34a">🔄 مزامنة من الشيت</button>
        <button onclick="exportTotalExcel()" style="background:#0f172a">📥 تصدير Excel</button>
      </div>
      <div id="monthTabs" class="month-tabs" style="margin-top:12px"></div>
      <div id="totalTableCard" style="margin-top:10px"></div>
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
  try{ document.querySelectorAll('select').forEach(sel=>{ [...sel.options].forEach(op=>{ let t=op.textContent.trim(); if(['مخزن دواء','شركة دواء','عام','كوزمتكس','مصاريف'].includes(t)) cats.add(t); }); }); }catch(e){}
  if(cats.size===0) ['مخزن دواء','شركة دواء','عام','كوزمتكس','مصاريف'].forEach(c=>cats.add(c));
  return [...cats].filter(Boolean);
}

function loadProfitConfig(){
  let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":50,"dist":{"مخزن دواء":40,"شركة دواء":30,"عام":10,"كوزمتكس":15,"مصاريف":5}}');
  setTimeout(()=>{ if(document.getElementById('desiredProfit')) document.getElementById('desiredProfit').value=cfg.desired||50; },30);

  let cats=getSupplierClassifications();
  let dist=cfg.dist||{};
  let sales = monthCashTotal || 0; // من اجمالي البيع كاش
  let desired=cfg.desired||50;
  let remainingPerc=100-desired;
  let profitValue=sales*desired/100;
  let remainingValue=sales*remainingPerc/100;

  if(document.getElementById('autoSalesKPI')) document.getElementById('autoSalesKPI').textContent=sales.toLocaleString();

  let html=`
  <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
    <div class="badge" style="background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe">المبيعات كاش: ${sales.toLocaleString()}</div>
    <div class="badge" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0">ربح مطلوب ${desired}% = ${profitValue.toLocaleString()}</div>
    <div class="badge" style="background:#f8fafc;color:#334155;border:1px solid #e2e8f0">المتبقي ${remainingPerc}% = ${remainingValue.toLocaleString()}</div>
  </div>
  <div style="overflow:auto;border-radius:14px;border:1px solid #eef2f7">
  <table>
    <thead>
      <tr>
        <th style="width:140px">البند</th>
        ${cats.map(c=>`<th>${c}<div style="font-size:9px;font-weight:400;opacity:.7;margin-top:2px"><input data-cat="${c}" value="${dist[c]||0}" oninput="saveProfitConfig()" class="profit-input" style="width:50px"> %</div></th>`).join('')}
        <th>الاجمالي</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="background:#f8fafc;font-weight:900">المفروض كده</td>
        ${cats.map(c=>{ let p=dist[c]||0; let val=remainingValue*p/100; return `<td data-val="${c}"><div style="font-size:12px;font-weight:900">${val.toLocaleString()}</div><div style="font-size:9px;color:#64748b">${p}% من المتبقي</div></td>`; }).join('')}
        <td style="background:#f1f5f9;font-weight:900">${remainingValue.toLocaleString()}</td>
      </tr>
      <tr style="background:#fffbeb">
        <td style="background:#fef3c7;font-weight:900;color:#92400e">الفعلي بقا</td>
        ${cats.map(c=>`<td data-actual="${c}" style="background:#fffbeb;font-weight:900">-</td>`).join('')}
        <td data-actual="totalCat" style="background:#fef3c7;font-weight:900">-</td>
      </tr>
      <tr>
        <td style="background:#fee2e2;font-weight:900;color:#991b1b">الفرق (المشاكل)</td>
        ${cats.map(c=>`<td data-diff="${c}" style="font-weight:900">-</td>`).join('')}
        <td data-diff="totalCat">-</td>
      </tr>
    </tbody>
  </table>
  </div>
  <div id="distSum" style="text-align:center;margin-top:10px;font-weight:800;font-size:11px"></div>
  `;
  document.getElementById('profitDistTable').innerHTML=html;
  calcPreview();
}

function saveProfitConfig(){
  let desired=calcNumTotal(document.getElementById('desiredProfit')?.value||50);
  let dist={};
  document.querySelectorAll('input[data-cat]').forEach(inp=>{ dist[inp.dataset.cat]=calcNumTotal(inp.value); });
  let old=JSON.parse(localStorage.getItem('profitConfigTotal')||'{}');
  localStorage.setItem('profitConfigTotal', JSON.stringify({desired, expected: monthCashTotal, dist}));
  loadProfitConfig();
}

function calcPreview(){
  try{
    let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{}');
    let sum=Object.values(cfg.dist||{}).reduce((a,b)=>a+b,0);
    let el=document.getElementById('distSum');
    if(el) el.innerHTML=`مجموع التوزيع: <span style="background:${sum===100?'#dcfce7':'#fee2e2'};padding:4px 10px;border-radius:20px">${sum}% ${sum===100?'✓':'لازم 100%'}</span> - محسوب تلقائي من مبيعات الشهر كاش بدون انستا وفودافون`;
  }catch(e){}
}

function goToDaily(dateKey){ localStorage.setItem('jumpToDate', dateKey); if(typeof showTab==='function') showTab('daily'); }
function goToSupplier(supName){ if(!supName||supName=='-') return; localStorage.setItem('supplierFilter', supName); if(typeof showTab==='function') showTab('qawaed'); }

function renderTotalTable(){
  try{
    let dailyStore=JSON.parse(localStorage.getItem('dailyStore')||'{}');
    let fromV=document.getElementById('totalFrom')?.value||'', toV=document.getElementById('totalTo')?.value||'';
    let fromD=parseDateForFilterTotal(fromV), toD=parseDateForFilterTotal(toV);
    const monthNames=['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','اغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'];
    let months={};
    Object.keys(dailyStore).sort((a,b)=> parseDateForFilterTotal(b)-parseDateForFilterTotal(a)).forEach(dateKey=>{
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
      return `<div class="month-tab ${isActive}" onclick="activeMonthTab='${m}';localStorage.setItem('activeMonthTab','${m}');renderTotalTable()">${monthNames[months[m].monthNum]}</div>`;
    }).join('') || '<div>مفيش بيانات</div>';

    let rows=''; monthCashTotal=0; let totalCatActual={}; let totalInsta=0, totalVoda=0;
    let activeData=months[activeMonthTab]?.days||[];
    activeData.forEach(({dateKey, empRows, instaSum, vodaSum})=>{
      totalInsta+=instaSum; totalVoda+=vodaSum;
      Object.values(empRows).forEach(r=>{
        if(!r.emp &&!r.sup && r.shift==0 && r.diff==0 && r.val==0) return;
        monthCashTotal+=r.shift;
        if(r.cat) totalCatActual[r.cat]=(totalCatActual[r.cat]||0)+r.val;
        let safi=r.shift + r.diff - r.val;
        rows+=`<tr>
          <td onclick="goToDaily('${dateKey}')">${dateKey}</td>
          <td>${r.emp||'-'}</td>
          <td><span style="background:#eff6ff;padding:4px 8px;border-radius:8px">${r.shift?r.shift.toLocaleString():'-'}</span></td>
          <td style="${r.diff<0?'color:#dc2626':'color:#16a34a'}">${r.diff||0}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')"><span style="font-size:9px;background:#f1f5f9;padding:3px 7px;border-radius:20px">${r.cat||''}</span> ${r.val?r.val.toLocaleString():'-'}</td>
          <td>${r.sup||'-'}</td>
          <td style="color:#7c3aed">${instaSum?instaSum.toLocaleString(): '-'}</td>
          <td style="color:#dc2626">${vodaSum?vodaSum.toLocaleString(): '-'}</td>
          <td class="safi">${safi.toLocaleString()}</td>
        </tr>`;
      });
    });

    // تحديث الـ KPI والفعلي
    setTimeout(()=>{
      if(document.getElementById('autoSalesKPI')) document.getElementById('autoSalesKPI').textContent=monthCashTotal.toLocaleString();
      let totalCatSum=Object.values(totalCatActual).reduce((a,b)=>a+b,0);
      document.querySelectorAll('[data-actual]').forEach(td=>{
        let k=td.getAttribute('data-actual');
        if(k==='totalCat') td.textContent=totalCatSum.toLocaleString();
        else if(totalCatActual[k]!==undefined) td.textContent=totalCatActual[k].toLocaleString();
        else if(k!=='profit' && k!=='sales' && k!=='remaining' && k!=='totalCat') td.textContent='0';
      });
      document.querySelectorAll('[data-diff]').forEach(td=>{
        let k=td.getAttribute('data-diff');
        let valEl=document.querySelector(`[data-val="${k}"]`);
        let actEl=document.querySelector(`[data-actual="${k}"]`);
        if(k==='totalCat'){
          let expectedVal=Object.values(document.querySelectorAll('[data-val]')).reduce((a,el)=>a+calcNumTotal(el.textContent),0);
          let diff=totalCatSum-expectedVal;
          td.textContent=(diff>0?'+':'')+diff.toLocaleString();
          td.style.color=diff>0?'#dc2626':'#16a34a';
        } else if(valEl && actEl){
          let ev=calcNumTotal(valEl.textContent); let av=calcNumTotal(actEl.textContent); let diff=av-ev;
          td.textContent=(diff>0?'+':'')+diff.toLocaleString();
          td.style.color=diff>0?'#dc2626':'#16a34a';
          if(Math.abs(diff)>0) td.style.background=diff>0?'#fee2e2':'#dcfce7';
        }
      });
      calcPreview();
    },100);

    document.getElementById('totalTableCard').innerHTML=`<div class="glass"><div style="display:flex;justify-content:space-between"><b>📅 ${activeMonthTab?monthNames[months[activeMonthTab].monthNum]+' '+months[activeMonthTab].year:''} - كاش فقط: ${monthCashTotal.toLocaleString()} جنيه</b><span style="font-size:10px;color:#64748b">انستا ${totalInsta.toLocaleString()} + فودافون ${totalVoda.toLocaleString()} ارباح منفصلة</span></div><div style="overflow:auto;max-height:70vh;margin-top:12px;border-radius:14px;border:1px solid #eef2f7"><table><thead><tr><th>التاريخ</th><th>الموظف</th><th>الشيفت كاش</th><th>العجز</th><th>المورد [تصنيف]</th><th>اسم مورد</th><th>انستا</th><th>فودافون</th><th>الصافي كاش</th></tr></thead><tbody>${rows||'<tr><td colspan=9>مفيش بيانات</td></tr>'}</tbody></table></div></div>`;
  }catch(e){ console.error(e); document.getElementById('totalTableCard').innerHTML='Error: '+e.message; }
}
