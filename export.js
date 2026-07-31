// V17 - زرار واحد بس
function getStore(n){ try{ let v=localStorage.getItem(n); if(v) return JSON.parse(v);}catch(e){} return null; }
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
  XLSX.writeFile(wb,'Omar-'+new Date().toISOString().slice(0,10)+'.xlsx');
}
