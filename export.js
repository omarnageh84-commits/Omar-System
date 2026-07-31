// V16 - تصدير ثابت وشغال + مفيش زراير مكررة
(function(){
  function getStore(n){ try{ if(window[n]&&typeof window[n]==='object') return window[n]; let v=localStorage.getItem(n); if(v) return JSON.parse(v);}catch(e){} return null; }

  // امسح اي زرار قديم غير الزرار الثابت بتاعي
  function killOld(){
    document.querySelectorAll('button').forEach(b=>{
      if(b.id==='unified-all-global') return;
      let t=(b.innerText||'');
      if(t.includes('تصدير')||t.includes('اكسل')||t.includes('Excel')){
        b.remove();
      }
    });
  }
  setInterval(killOld, 1000);

  window.unifiedExportAll=function(){
    if(typeof XLSX==='undefined'){ alert('المكتبة لسه بتحمل - استنى ثانية ودوس تاني'); return; }
    let wb=XLSX.utils.book_new();

    let daily=getStore('dailyStore')||{};
    let r1=[['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد','انستا باي','فودافون كاش']];
    Object.keys(daily).forEach(d=>{
      let arr=Array.isArray(daily[d])?daily[d]:Object.values(daily[d]||{});
      arr.forEach(x=>{
        let emp=x.emp||x['1']||''; let val=x.val||x['6']||'';
        if(emp||val) r1.push([d,emp,x.shift||x['2']||'',x.diff||x['3']||'',val,x.sup||x['5']||'',x.insta||'',x.voda||'']);
      });
    });
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r1),'اليومية');

    let purch=getStore('purchaseStore')||[];
    if(purch.length){
      let r=[['التاريخ','المورد','النوع','طريقة الدفع','الصافي']];
      purch.forEach(x=>r.push([x.date||'',x.supplier||'',x.type||'',x.pay||'',x.value||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'المشتريات');
    }

    let db=getStore('dbStore')||{};
    if(db.employees?.length){
      let r=[['الموظفون']]; db.employees.forEach(e=>r.push([e.name||e]));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'الموظفون');
    }
    if(db.suppliers?.length){
      let r=[['المورد','التصنيف']]; db.suppliers.forEach(s=>r.push([s.name||'',s.category||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'الموردين');
    }
    if(db.asnaf?.length){
      let r=[['الصنف','السعر']]; db.asnaf.forEach(a=>r.push([a.name||'',a.price||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'الاصناف');
    }

    XLSX.writeFile(wb,'Omar-System-'+new Date().toISOString().slice(0,10)+'.xlsx');
  }
})();
