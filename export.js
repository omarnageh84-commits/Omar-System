// V14 - زرار واحد ثابت في كل الموقع
(function(){
  function getStore(n){ try{ if(window[n]&&typeof window[n]==='object') return window[n]; let v=localStorage.getItem(n); if(v) return JSON.parse(v);}catch(e){} return null; }

  // امسح اي زرار تصدير قديم من كل الملفات
  function killOld(){
    document.querySelectorAll('button').forEach(b=>{
      let t=(b.innerText||'');
      if(t.includes('تصدير')||t.includes('اكسل')){
        if(b.id!=='unified-all-global') b.remove();
      }
    });
  }
  setInterval(killOld, 800);

  window.unifiedExportAll=function(){
    if(typeof XLSX==='undefined'){ alert('استنى ثانية'); return; }
    let wb=XLSX.utils.book_new();

    let daily=getStore('dailyStore')||{};
    let r1=[['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد']];
    Object.keys(daily).forEach(d=>{
      let arr=Array.isArray(daily[d])?daily[d]:Object.values(daily[d]||{});
      arr.forEach(x=>{ if(x.emp||x.val) r1.push([d,x.emp||'',x.shift||'',x.diff||'',x.val||'',x.sup||'']); });
    });
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r1),'اليومية');

    let purch=getStore('purchaseStore')||[];
    if(purch.length){
      let r=[['التاريخ','المورد','النوع','الدفع','القيمة']];
      purch.forEach(x=>r.push([x.date||'',x.supplier||'',x.type||'',x.pay||'',x.value||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'المشتريات');
    }

    let db=getStore('dbStore')||{};
    Object.keys(db).forEach(k=>{
      let arr=db[k]; if(!Array.isArray(arr)||!arr.length) return;
      let h=Object.keys(arr[0]||{}); let rows=[h].concat(arr.map(o=>h.map(x=>o[x])));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),k.slice(0,31));
    });

    ['masrofatyStore','dyonStore','hodorStore','notesStore'].forEach(key=>{
      let s=getStore(key); if(!s) return;
      let arr=Array.isArray(s)?s:Object.values(s); if(!arr.length) return;
      let h=Object.keys(arr[0]||{}); let rows=[h].concat(arr.map(o=>h.map(x=>o[x])));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),key.replace('Store','').slice(0,31));
    });

    XLSX.writeFile(wb,'Omar-System-كامل-'+new Date().toISOString().slice(0,10)+'.xlsx');
  }
})();
