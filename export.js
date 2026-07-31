// V18 - تصدير شغال 100%
function getStore(n){ try{ let v=localStorage.getItem(n); if(v) return JSON.parse(v);}catch(e){} return null; }

window.unifiedExportAll=function(){
  try{
    if(typeof XLSX==='undefined'){ alert('مكتبة الاكسل لسه بتحمل - دوس تاني بعد ثانيتين'); return; }

    let wb = XLSX.utils.book_new();
    let store = getStore('dailyStore')||{};

    if(!Object.keys(store).length){ alert('مفيش داتا في dailyStore!'); return; }

    // نفس طريقة الاجمالي بالظبط
    let rows = [['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد','انستا','فودافون','ملاحظة']];

    Object.keys(store).forEach(dateKey=>{
      let data = store[dateKey];
      let arr = [];
      if(Array.isArray(data)) arr = data;
      else if(typeof data==='object') arr = Object.values(data);

      let empRows = {};
      arr.forEach(it=>{
        if(!it ||!it.id) return;
        let id = it.id+'';
        let m = id.match(/t1_r(\d+)_c(\d+)/);
        if(!m) return;
        let r = m[1], c = m[2];
        if(!empRows[r]) empRows[r] = {emp:'',shift:'',diff:'',sup:'',val:'',note:''};
        if(c==='1') empRows[r].emp = it.val||'';
        if(c==='2') empRows[r].shift = it.val||'';
        if(c==='3') empRows[r].diff = it.val||'';
        if(c==='5') empRows[r].sup = it.val||'';
        if(c==='6') empRows[r].val = it.val||'';
        if(c==='7') empRows[r].note = it.val||'';
      });

      Object.values(empRows).forEach(r=>{
        if(r.emp || r.val || r.sup){
          rows.push([dateKey, r.emp, r.shift, r.diff, r.val, r.sup, '', '', r.note]);
        }
      });
    });

    console.log('عدد الصفوف:', rows.length);

    if(rows.length<=1){ alert('الجدول فاضي'); return; }

    let ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{wch:12},{wch:15},{wch:10},{wch:10},{wch:12},{wch:18},{wch:12},{wch:18}];
    XLSX.utils.book_append_sheet(wb, ws, 'اليومية');

    // مشتريات
    let purch = getStore('purchaseStore')||[];
    if(purch.length){
      let r=[['التاريخ','المورد','النوع','الدفع','القيمة']];
      purch.forEach(x=>r.push([x.date||'',x.supplier||'',x.type||'',x.pay||'',x.value||'']));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(r), 'المشتريات');
    }

    // قواعد البيانات
    let db = getStore('dbStore')||{};
    if(db.suppliers?.length){
      let r=[['المورد','التصنيف']]; db.suppliers.forEach(s=>r.push([s.name||'',s.category||'']));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(r), 'الموردين');
    }

    XLSX.writeFile(wb, 'Omar-System-'+new Date().toISOString().slice(0,10)+'.xlsx');
    alert('✅ اتصدر '+ (rows.length-1) +' صف');

  }catch(e){
    alert('خطأ في التصدير: '+ e.message);
    console.error(e);
  }
}
