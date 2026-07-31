// ==================== الاجمالي - كامل محدث 3 كروت في الصف ====================
let activeMonthTab = localStorage.getItem('activeMonthTab') || null;

function renderTotal() {
  let el = document.getElementById('total'); if (!el) return;
  el.innerHTML = `<div id="total-wrap">
    <style>
   .glass{background:#fff;border-radius:14px;padding:12px;margin-bottom:12px;border:1px solid #e2e8f0;box-shadow:0 1px 2px rgba(0,0,0,.04)}
   .filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
   .filters input{padding:8px 12px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:11px;font-weight:700}
   .filters button{padding:8px 16px;border:none;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer;color:#fff}
     table{width:100%;border-collapse:collapse;font-size:11px}
     th{background:#0f172a;color:#fff;padding:10px 6px;font-size:10px;text-align:center;position:sticky;top:0;z-index:1}
     td{padding:8px 6px;text-align:center;border-bottom:1px solid #f1f5f9;cursor:pointer}
     tr:hover td{background:#f8fafc}
   .safi{background:#0f172a;color:#fff;border-radius:8px;font-weight:900}
   .month-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
   .month-tab{padding:9px 16px;border-radius:22px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:900;font-size:11px;cursor:pointer;transition:.2s}
   .month-tab.active{background:#0f172a;color:#fff;border-color:#0f172a}
   .profit-input{width:100%;padding:8px;border-radius:10px;border:1.5px solid #e2e8f0;text-align:center;font-weight:900;font-size:12px}
    </style>

    <div class="glass">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <b>⚙️ توزيع الارباح - حسب التصنيف (مخزن دواء / شركة دواء / عام / كوزمتكس / مصاريف)</b>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:11px;font-weight:800">نسبة الربح اللي عاوز تكسبها %</span>
          <input id="desiredProfit" type="number" class="profit-input" style="width:80px" oninput="saveProfitConfig()" placeholder="30">
          <button onclick="saveProfitConfig();renderTotalTable()" style="background:#0f172a;padding:7px 12px;border:none;border-radius:8px;color:#fff;font-weight:800;font-size:10px">حفظ</button>
        </div>
      <div id="profitDistTable" style="margin-top:14px;"></div>
    </div>

    <div class="glass">
      <div class="filters">
        <input id="totalFrom" placeholder="من تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <input id="totalTo" placeholder="إلى تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <button onclick="clearTotalFilters()" style="background:#64748b">مسح الفلتر</button>
        <button onclick="fetchSheetData()" style="background:#16a34a">🔄 مزامنة من الشيت</button>
        <button onclick="exportTotalExcel()" style="background:#0f172a">📥 تصدير Excel</button>
      </div>
    </div>
    <div id="monthTabs" class="month-tabs"></div>
    <div id="totalTableCard"></div>
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
  let cats = new Set();
  let keysToTry = ['suppliers','suppliersStore','db_suppliers','suppliersData'];
  keysToTry.forEach(k=>{
    try{
      let raw=localStorage.getItem(k); if(!raw) return;
      let data=JSON.parse(raw);
      if(Array.isArray(data)){
        data.forEach(o=>{ let c=o?.category||o?.classification||o?.التصنيف||o?.تصنيف; if(c) cats.add(c.toString().trim()); });
      }
    }catch(e){}
  });
  try{
    document.querySelectorAll('select').forEach(sel=>{
      [...sel.options].forEach(op=>{
        let t=op.textContent.trim();
        if(['مخزن دواء','شركة دواء','عام','كوزمتكس','مصاريف'].includes(t)) cats.add(t);
      });
    });
  }catch(e){}
  if(cats.size===0){ ['مخزن دواء','شركة دواء','عام','كوزمتكس','مصاريف'].forEach(c=>cats.add(c)); }
  return [...cats].filter(Boolean);
}

// ====== هنا التعديل اللي طلبته - 3 في الصف ورؤوس فوق ======
function loadProfitConfig(){
  let cfg = JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":30,"dist":{"مخزن دواء":40,"شركة دواء":30,"عام":10,"كوزمتكس":15,"مصاريف":5}}');
  setTimeout(()=>{ let inp=document.getElementById('desiredProfit'); if(inp) inp.value=cfg.desired||30; },30);
  let cats = getSupplierClassifications();
  let dist = cfg.dist||{};
  let html = `<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;">`;
  cats.forEach(cat=>{
    if(dist[cat]===undefined) dist[cat]=0;
    html+=`
      <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:12px;text-align:center">
        <div style="font-size:10px;font-weight:800;color:#64748b">التصنيف (من جدول الموردين)</div>
        <div style="font-size:13px;font-weight:900;margin:6px 0 10px 0">${cat}</div>

        <div style="font-size:10px;font-weight:800;color:#64748b">نسبة من الباقي %</div>
        <input class="profit-input" data-cat="${cat}" value="${dist[cat]}" oninput="saveProfitConfig()" type="number">

        <div style="font-size:10px;font-weight:800;color:#64748b;margin-top:10px">الحصة من الاجمالي</div>
        <div data-calc="${cat}" style="background:#0f172a;color:#fff;border-radius:10px;padding:8px 4px;font-weight:900;font-size:11px;margin-top:6px;line-height:1.4">-</div>
      </div>`;
  });
  html+=`</div><div id="distSum" style="font-size:11px;margin-top:12px;font-weight:800;text-align:center;background:#f8fafc;padding:8px;border-radius:10px"></div>`;
  document.getElementById('profitDistTable').innerHTML=html;
  calcProfitPreview();
}
function saveProfitConfig(){
  let desired = calcNumTotal(document.getElementById('desiredProfit')?.value||0);
  let dist={};
  document.querySelectorAll('#profitDistTable input[data-cat]').forEach(inp=>{ dist[inp.dataset.cat]=calcNumTotal(inp.value); });
  localStorage.setItem('profitConfigTotal', JSON.stringify({desired, dist}));
  calcProfitPreview();
}
function calcProfitPreview(){
  try{
    let cfg=JSON.parse(localStorage.getItem('profitConfigTotal')||'{"desired":30,"dist":{}}');
    let remaining=100-(cfg.desired||0);
    let sum=0;
    Object.values(cfg.dist||{}).forEach(v=>sum+=calcNumTotal(v));
    document.querySelectorAll('[data-calc]').forEach(td=>{
      let cat=td.getAttribute('data-calc');
      let p=cfg.dist[cat]||0;
      let finalShare=(remaining*p/100);
      td.innerHTML=`${p}% من الباقي = <br>${finalShare.toFixed(1)}% اجمالي`;
    });
    let sumEl=document.getElementById('distSum');
    if(sumEl) sumEl.innerHTML=`مجموع التوزيع: ${sum}% ${sum!==100?'<span style="color:#dc2626">لازم 100%</span>':'<span style="color:#16a34a">✓ تمام</span>'} | الباقي بعد ربحك: ${remaining}% | البرنامج بياخد نسبة ربحك والباقي بيتوزع على التصنيفات اللي انت عاملها في جدول الموردين`;
  }catch(e){}
}

function goToDaily(dateKey){ localStorage.setItem('jumpToDate', dateKey); if(typeof showTab==='function') showTab('daily'); if(typeof renderDaily==='function') setTimeout(()=>renderDaily(),200); }
function goToSupplier(supName){ if(!supName||supName=='-') return; localStorage.setItem('supplierFilter', supName); if(typeof showTab==='function') showTab('qawaed'); if(typeof renderSuppliers==='function') setTimeout(()=>renderSuppliers(),200); }

function renderTotalTable(){
  try{
    let dailyStore=JSON.parse(localStorage.getItem('dailyStore')||'{}');
    let fromV=document.getElementById('totalFrom')?.value||'', toV=document.getElementById('totalTo')?.value||'';
    let fromD=parseDateForFilterTotal(fromV), toD=parseDateForFilterTotal(toV);
    const monthNames=['يناير','فبراير','مارس','ابريل','مايو','يونيو','يوليو','اغسطس','سبتمبر','اكتوبر','نوفمبر','ديسمبر'];
    function formatMonthLabel(key){ let [y,m]=key.split('/'); let num=parseInt(m); return `${num}/${y} - ${monthNames[num-1]} ${y} (${new Date(y,num,0).getDate()} يوم)`; }

    let months={};
    let sortedDates=Object.keys(dailyStore).sort((a,b)=>{ let da=parseDateForFilterTotal(a), db=parseDateForFilterTotal(b); if(!da||!db) return 0; return db-da; });

    sortedDates.forEach(dateKey=>{
      let d=parseDateForFilterTotal(dateKey); if(!d) return;
      if(fromD && d<fromD) return; if(toD && d>toD) return;
      let monthKey=`${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}`;
      if(!months[monthKey]) months[monthKey]=[];
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
      months[monthKey].push({dateKey, empRows, instaSum, vodaSum});
    });

    let monthKeys=Object.keys(months).sort((a,b)=> b.localeCompare(a));
    if(!activeMonthTab ||!months[activeMonthTab]){ activeMonthTab=monthKeys[0]||null; if(activeMonthTab) localStorage.setItem('activeMonthTab',activeMonthTab); }

    document.getElementById('monthTabs').innerHTML=monthKeys.map(m=>{
      let isActive=m===activeMonthTab?'active':'';
      return `<div class="month-tab ${isActive}" onclick="activeMonthTab='${m}';localStorage.setItem('activeMonthTab','${m}');renderTotalTable()">${formatMonthLabel(m)}</div>`;
    }).join('') || '<div style="font-size:11px">مفيش بيانات</div>';

    let rows='';
    let activeData=months[activeMonthTab]||[];
    activeData.forEach(({dateKey, empRows, instaSum, vodaSum})=>{
      let first=true; let hasEmp=false;
      Object.values(empRows).forEach(r=>{
        if(!r.emp &&!r.sup && r.shift==0 && r.diff==0 && r.val==0) return;
        hasEmp=true;
        let safi=r.shift + r.diff - r.val + (first? (instaSum + vodaSum):0);
        rows+=`<tr>
          <td style="font-weight:900" onclick="goToDaily('${dateKey}')">${dateKey}</td>
          <td onclick="goToDaily('${dateKey}')">${r.emp||'-'}</td>
          <td onclick="goToDaily('${dateKey}')">${r.shift?r.shift.toLocaleString():'-'}</td>
          <td style="font-weight:800;${r.diff<0?'color:#dc2626':'color:#16a34a'}" onclick="goToDaily('${dateKey}')">${r.diff||0}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')"><span style="font-size:9px;background:#f1f5f9;padding:2px 6px;border-radius:10px">${r.cat||''}</span> ${r.val?r.val.toLocaleString():'-'}</td>
          <td onclick="event.stopPropagation();goToSupplier('${r.sup}')">${r.sup||'-'}</td>
          <td style="color:#7c3aed;font-weight:900" onclick="goToDaily('${dateKey}')">${first&&instaSum?instaSum.toLocaleString():'-'}</td>
          <td style="color:#dc2626;font-weight:900" onclick="goToDaily('${dateKey}')">${first&&vodaSum?vodaSum.toLocaleString():'-'}</td>
          <td class="safi" onclick="goToDaily('${dateKey}')">${safi.toLocaleString()}</td>
        </tr>`;
        first=false;
      });
      if(!hasEmp && (instaSum||vodaSum)){
        rows+=`<tr style="background:#f5f3ff" onclick="goToDaily('${dateKey}')"><td>${dateKey}</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>${instaSum.toLocaleString()}</td><td>${vodaSum.toLocaleString()}</td><td class="safi">${(instaSum+vodaSum).toLocaleString()}</td></tr>`;
      }
    });

    document.getElementById('totalTableCard').innerHTML=`<div class="glass"><b>📅 ${activeMonthTab?formatMonthLabel(activeMonthTab):'الاجمالي'} - اضغط على الصف يوديك لليوم</b><div style="overflow:auto;max-height:70vh;margin-top:10px"><table><thead><tr><th>تاريخ اليوم</th><th>الموظف</th><th>قيمة الشيفت</th><th>العجز/الزيادة</th><th>قيمة المورد [التصنيف]</th><th>اسم مورد</th><th>انستا</th><th>فودافون</th><th>الصافي</th></tr></thead><tbody>${rows||'<tr><td colspan=9>مفيش بيانات</td></tr>'}</tbody></table></div></div>`;
  }catch(e){ console.error(e); document.getElementById('totalTableCard').innerHTML='Error: '+e.message; }
}
