// export.js V13 - زرار واحد بس يصدر كله + شغال في الصيدلية والخاص
(function(){
  function getStore(n){ try{ if(window[n] && typeof window[n]==='object') return window[n]; let v=localStorage.getItem(n); if(v) return JSON.parse(v);}catch(e){} return null; }

  // ده اهم سطر - بيمسح اي زرار تصدير قديم في كل الصفح
  function killOldExports(){
    document.querySelectorAll('button').forEach(b=>{
      let t=(b.innerText||'').trim();
      if((t.includes('تصدير')||t.includes('اكسل')||t.includes('Excel')) && b.id!=='unified-all'){
        b.remove();
      }
    });
  }

  window.unifiedExportAll=function(){
    if(typeof XLSX==='undefined'){ alert('استنى ثانية المكتبة بتحمل'); return; }
    killOldExports();
    let wb=XLSX.utils.book_new();

    // 1- اليومية - كل الـ 211 يوم اللي عندك
    let daily=getStore('dailyStore')||{};
    let rowsDaily=[['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد','انستا','فودافون']];
    Object.keys(daily).forEach(d=>{
      let arr=Array.isArray(daily[d])?daily[d]:Object.values(daily[d]||{});
      arr.forEach(r=>{
        let emp=r.emp||r['1']||''; let val=r.val||r['6']||'';
        if(emp||val) rowsDaily.push([d,emp,r.shift||r['2']||'',r.diff||r['3']||'',val,r.sup||r['5']||'',r.insta||'',r.voda||'']);
      });
    });
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rowsDaily),'اليومية');

    // 2- المشتريات
    let purch=getStore('purchaseStore')||getStore('purchasesStore')||[];
    if(purch.length){
      let arr=Array.isArray(purch)?purch:Object.values(purch);
      let rows=[['التاريخ','المورد','النوع','الدفع','القيمة']];
      arr.forEach(r=>rows.push([r.date||'',r.supplier||'',r.type||'',r.pay||'',r.value||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'المشتريات');
    }

    // 3- المبيعات للمخزن
    let sales=getStore('salesStore')||getStore('zakhStore')||[];
    if(sales.length){
      let arr=Array.isArray(sales)?sales:Object.values(sales);
      let headers=Object.keys(arr[0]||{}); let rows=[headers].concat(arr.map(o=>headers.map(h=>o[h])));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'المبيعات للمخزن');
    }

    // 4- قواعد البيانات
    let db=getStore('dbStore')||{};
    Object.keys(db).forEach(k=>{
      let arr=db[k]; if(!Array.isArray(arr)||!arr.length) return;
      let headers=Object.keys(arr[0]||{}); let rows=[headers].concat(arr.map(o=>headers.map(h=>o[h])));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),k.slice(0,31));
    });

    // 5- الخاص
    ['masrofatyStore','dyonStore','hodorStore','notesStore','privateStore'].forEach(key=>{
      let s=getStore(key); if(!s) return;
      let arr=Array.isArray(s)?s:Object.values(s); if(!arr.length) return;
      let headers=Object.keys(arr[0]||{}); let rows=[headers].concat(arr.map(o=>headers.map(h=>o[h])));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),key.replace('Store','').slice(0,31));
    });

    XLSX.writeFile(wb,'Omar-System-كامل-'+new Date().toISOString().slice(0,10)+'.xlsx');
  }

  window.addExportButtons=function(){
    killOldExports();
    // زرار واحد بس فوق في الناف بار
    if(!document.getElementById('unified-all')){
      let nav=document.getElementById('navBar');
      if(!nav) return;
      let b=document.createElement('button'); b.id='unified-all';
      b.innerHTML='📦 تصدير كله XLSX';
      b.style='background:#7c3aed;color:#fff;border:none;padding:8px 16px;border-radius:12px;font-weight:900;cursor:pointer;margin-right:8px;';
      b.onclick=unifiedExportAll;
      nav.appendChild(b);
    }
    // زرار للخاص برضه
    let privNav=document.querySelector('#privateApp')?.previousElementSibling || document.querySelector('#privateApp');
    if(privNav &&!document.getElementById('unified-private')){
      let b2=document.createElement('button'); b2.id='unified-private';
      b2.innerHTML='📦 تصدير الخاص';
      b2.style='background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;cursor:pointer;margin:8px;float:left;';
      b2.onclick=unifiedExportAll;
      let container=document.querySelector('#privateApp'); if(container) container.prepend(b2);
    }
  }

  // شغل كل ثانية وامسح القديم
  setInterval(()=>{ if(typeof XLSX!=='undefined') addExportButtons(); }, 1000);
})();
