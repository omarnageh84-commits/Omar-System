// V15 FINAL - اسماء شيتات عربي مفهومة
(function(){
  function getStore(n){ try{ if(window[n]&&typeof window[n]==='object') return window[n]; let v=localStorage.getItem(n); if(v) return JSON.parse(v);}catch(e){} return null; }
  function killOld(){ document.querySelectorAll('button').forEach(b=>{ let t=(b.innerText||''); if((t.includes('تصدير')||t.includes('اكسل'))&&b.id!=='unified-all-global') b.remove(); }); }
  setInterval(killOld, 800);

  window.unifiedExportAll=function(){
    if(typeof XLSX==='undefined'){ alert('استنى ثانية'); return; }
    let wb=XLSX.utils.book_new();

    // 1- اليومية - اسم واضح
    let daily=getStore('dailyStore')||{};
    let r1=[['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد','انستا','فودافون']];
    Object.keys(daily).forEach(d=>{
      let arr=Array.isArray(daily[d])?daily[d]:Object.values(daily[d]||{});
      arr.forEach(x=>{
        let emp=x.emp||x['1']||''; let val=x.val||x['6']||'';
        if(emp||val) r1.push([d,emp,x.shift||x['2']||'',x.diff||x['3']||'',val,x.sup||x['5']||'',x.insta||'',x.voda||'']);
      });
    });
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r1),'اليومية - 211 يوم');

    // 2- المشتريات
    let purch=getStore('purchaseStore')||[];
    if(purch.length){
      let r=[['التاريخ','المورد','النوع','طريقة الدفع','الصافي']];
      purch.forEach(x=>r.push([x.date||'',x.supplier||'',x.type||'',x.pay||'',x.value||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'المشتريات');
    }

    // 3- المبيعات للمخزن
    let sales=getStore('zakhStore')||getStore('salesStore')||[];
    if(sales.length){
      let arr=Array.isArray(sales)?sales:Object.values(sales);
      let r=[['التاريخ','الصنف','العدد','السعر','الخصم','الاجمالي']];
      arr.forEach(o=>r.push([o.date||'',o.name||o.asnaf||'',o.count||'',o.price||'',o.discount||'',o.total||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'المبيعات للمخزن');
    }

    // 4- قواعد البيانات - كل حاجة باسمها الحقيقي
    let db=getStore('dbStore')||{};
    if(db.employees?.length){
      let r=[['الموظفين']]; db.employees.forEach(e=>r.push([e.name||e]));
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
    if(db.tasnef?.length){
      let r=[['الاسم','التصنيف']]; db.tasnef.forEach(t=>r.push([t.name||'',t.category||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'التصنيف الشامل');
    }
    if(db.arba7?.length){
      let r=[['الارباح']]; db.arba7.forEach(a=>r.push([a.c1||a.name||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'الارباح');
    }
    if(db.masrofat?.length){
      let r=[['المصروفات']]; db.masrofat.forEach(m=>r.push([m.c1||m.name||'']));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),'المصروفات');
    }

    // 5- الخاص
    let mas=getStore('masrofatyStore')||getStore('masrofat')||[];
    if(mas.length){
      let arr=Array.isArray(mas)?mas:Object.values(mas);
      let h=Object.keys(arr[0]||{}); let rows=[h].concat(arr.map(o=>h.map(x=>o[x])));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'مصروفاتي الخاصة');
    }

    XLSX.writeFile(wb,'Omar-System-كامل-مفهوم-'+new Date().toISOString().slice(0,10)+'.xlsx');
  }
})();
