// V10 - يصدر من المخزن الداخلي فحتى لو الجدول فاضي هيجيب الداتا
function getStore(name){
  try{
    if(window[name] && typeof window[name]==='object') return window[name];
    let v = localStorage.getItem(name);
    if(v) return JSON.parse(v);
  }catch(e){}
  return null;
}

function exportCurrentTab(){
  let tab = document.querySelector('#pharmacyApp.tab-content.active')?.id || 'daily';
  let wb = XLSX.utils.book_new();
  let rows = [];

  if(tab==='daily'){
    let store = getStore('dailyStore') || {};
    rows.push(['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد','انستا','فودافون','الفعلي','ملاحظة']);
    Object.keys(store).forEach(date=>{
      let day = store[date];
      let arr = Array.isArray(day)? day : Object.values(day||{});
      arr.forEach(r=>{
        if(!r || (!r.val &&!r.emp)) return;
        rows.push([date, r.emp||'', r.shift||'', r.diff||'', r.val||'', r.sup||'', r.insta||'', r.voda||'', r.actual||'', r.note||'']);
      });
    });
  } else if(tab==='total'){
    let store = getStore('dailyStore') || {};
    rows.push(['الموظف','مجموع القيمة','مجموع العجز','عدد الايام']);
    let agg={};
    Object.values(store).forEach(day=>{
      let arr = Array.isArray(day)?day:Object.values(day||{});
      arr.forEach(r=>{
        if(!r.emp) return;
        if(!agg[r.emp]) agg[r.emp]={val:0,diff:0,cnt:0};
        agg[r.emp].val+=Number(r.val||0);
        agg[r.emp].diff+=Number(r.diff||0);
        agg[r.emp].cnt++;
      });
    });
    Object.keys(agg).forEach(emp=>{
      rows.push([emp, agg[emp].val, agg[emp].diff, agg[emp].cnt]);
    });
  } else if(tab==='purchases'){
    let store = getStore('purchasesStore') || getStore('purchases') || [];
    let arr = Array.isArray(store)?store:Object.values(store||{});
    rows.push(['التاريخ','المورد','القيمة','ملاحظة']);
    arr.forEach(r=> rows.push([r.date||'', r.sup||r.supplier||'', r.val||r.amount||'', r.note||'']));
  } else if(tab==='sales'){
    let store = getStore('salesStore') || getStore('sales') || [];
    let arr = Array.isArray(store)?store:Object.values(store||{});
    rows.push(['التاريخ','الصنف','الكمية','السعر']);
    arr.forEach(r=> rows.push([r.date||'', r.name||'', r.qty||'', r.price||'']));
  } else {
    // database - صدر كل الجداول اللي في الشاشة
    [...document.getElementById(tab).querySelectorAll('table')].forEach(t=>{
      let data=[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('th,td')].map(td=>td.innerText.trim()));
      if(data.length) rows = rows.concat(data).concat([[]]);
    });
  }

  if(rows.length<=1){ alert('مفيش داتا متخزنة في '+tab); return; }
  let ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols']=rows[0].map(()=>({wch:16}));
  XLSX.utils.book_append_sheet(wb, ws, tab.slice(0,31));
  XLSX.writeFile(wb, tab+'-مليان-'+new Date().toISOString().slice(0,10)+'.xlsx');
}

function exportAllInOne(){
  let wb = XLSX.utils.book_new();
  let dailyStore = getStore('dailyStore')||{};
  let rows1=[['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد','انستا','فودافون']];
  Object.keys(dailyStore).forEach(d=>{
    let arr=Array.isArray(dailyStore[d])?dailyStore[d]:Object.values(dailyStore[d]||{});
    arr.forEach(r=>{ if(r.emp||r.val) rows1.push([d,r.emp||'',r.shift||'',r.diff||'',r.val||'',r.sup||'',r.insta||'',r.voda||'']); });
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows1), 'اليومية');

  // مشتريات ومبيعات لو موجودة
  ['purchasesStore','salesStore','databaseStore'].forEach(key=>{
    let s=getStore(key); if(!s) return;
    let arr=Array.isArray(s)?s:Object.values(s);
    if(!arr.length) return;
    let sample=arr[0]; let headers=Object.keys(sample);
    let rows=[headers].concat(arr.map(o=>headers.map(h=>o[h])));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), key.slice(0,31));
  });

  XLSX.writeFile(wb, 'Omar-System-كامل-مليان-'+new Date().toISOString().slice(0,10)+'.xlsx');
}

window.addExportButtons=function(){
  let nav=document.getElementById('navBar');
  if(nav &&!document.getElementById('btn-all')){
    let b=document.createElement('button'); b.id='btn-all'; b.textContent='📦 تصدير كله مليان';
    b.style='background:#7c3aed;color:#fff;border:none;padding:8px 14px;border-radius:10px;font-weight:800;margin-right:8px;cursor:pointer;';
    b.onclick=exportAllInOne; nav.appendChild(b);
  }
  ['daily','total','purchases','sales','database'].forEach(id=>{
    let cont=document.getElementById(id);
    if(!cont || cont.querySelector('.btn-export')) return;
    let btn=document.createElement('button'); btn.className='btn-export';
    btn.textContent='📥 تصدير اكسل مليان'; btn.style='background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;cursor:pointer;margin:8px;float:left;';
    btn.onclick=exportCurrentTab; cont.prepend(btn);
  });
}
