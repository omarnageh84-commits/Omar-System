// V11 FINAL - زرار واحد بس + شغال في الخاص كمان
(function(){
function cleanOld(){
  // امسح اي زرار قديم فيه كلمة اكسل او تصدير
  document.querySelectorAll('button').forEach(b=>{
    let t=b.innerText||'';
    if( (t.includes('تصدير')||t.includes('اكسل')||t.includes('Excel')) &&!b.id.startsWith('unified-') ){
      if(b.closest('#pharmacyApp') || b.closest('#privateApp')) b.remove();
    }
  });
}
function getStore(n){
  try{
    if(window[n] && typeof window[n]==='object') return window[n];
    let v=localStorage.getItem(n); if(v) return JSON.parse(v);
  }catch(e){} return null;
}
window.unifiedExportCurrent=function(){
  let activePharm = document.getElementById('pharmacyApp').style.display!=='none';
  let wb=XLSX.utils.book_new();
  if(activePharm){
    let tab=document.querySelector('#pharmacyApp.tab-content.active')?.id||'total';
    if(tab==='daily'||tab==='total'){
      let store=getStore('dailyStore')||{};
      let rows=[['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد','انستا','فودافون','الفعلي']];
      Object.keys(store).forEach(d=>{
        let arr=Array.isArray(store[d])?store[d]:Object.values(store[d]||{});
        arr.forEach(r=>{ if(r.emp||r.val) rows.push([d,r.emp||'',r.shift||'',r.diff||'',r.val||'',r.sup||'',r.insta||'',r.voda||'',r.actual||'']); });
      });
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),tab);
    } else {
      let storeName = tab==='purchases'?'purchasesStore':tab==='sales'?'salesStore':'databaseStore';
      let store=getStore(storeName)||getStore(tab)||[];
      let arr=Array.isArray(store)?store:Object.values(store||{});
      if(!arr.length){
        // fallback من الجدول
        let t=document.querySelector(`#${tab} table`); if(t){
          let data=[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('th,td')].map(td=>td.innerText.trim()));
          XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(data),tab);
        }
      } else {
        let headers=Object.keys(arr[0]||{});
        let rows=[headers].concat(arr.map(o=>headers.map(h=>o[h])));
        XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),tab);
      }
    }
  } else {
    // الخاص
    let tab = document.querySelector('#privateApp [class*="active"]')?.id || 'private';
    let stores=['masrofatyStore','dyonStore','hodorStore','notesStore','privateStore'];
    stores.forEach(key=>{
      let s=getStore(key); if(!s) return;
      let arr=Array.isArray(s)?s:Object.values(s); if(!arr.length) return;
      let headers=Object.keys(arr[0]||{});
      let rows=[headers].concat(arr.map(o=>headers.map(h=>o[h])));
      XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),key.slice(0,31));
    });
    if(wb.SheetNames.length===0){
      let t=document.querySelector('#privateApp table'); if(t){
        let data=[...t.querySelectorAll('tr')].map(tr=>[...tr.querySelectorAll('th,td')].map(td=>td.innerText.trim()));
        XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(data),'الخاص');
      }
    }
  }
  if(wb.SheetNames.length===0){ alert('مفيش داتا للتصدير'); return; }
  XLSX.writeFile(wb,'تصدير-'+new Date().toISOString().slice(0,10)+'.xlsx');
}
window.unifiedExportAll=function(){
  let wb=XLSX.utils.book_new();
  let dailyStore=getStore('dailyStore')||{};
  let rows=[['التاريخ','الموظف','الشيفت','العجز','القيمة']];
  Object.keys(dailyStore).forEach(d=>{
    let arr=Array.isArray(dailyStore[d])?dailyStore[d]:Object.values(dailyStore[d]||{});
    arr.forEach(r=>{ if(r.emp||r.val) rows.push([d,r.emp||'',r.shift||'',r.diff||'',r.val||'']); });
  });
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'اليومية والاجمالي');
  ['purchasesStore','salesStore','masrofatyStore','dyonStore','hodorStore'].forEach(key=>{
    let s=getStore(key); if(!s) return;
    let arr=Array.isArray(s)?s:Object.values(s); if(!arr.length) return;
    let headers=Object.keys(arr[0]); let r=[headers].concat(arr.map(o=>headers.map(h=>o[h])));
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(r),key.slice(0,31));
  });
  XLSX.writeFile(wb,'Omar-System-كامل-'+new Date().toISOString().slice(0,10)+'.xlsx');
}
window.addExportButtons=function(){
  cleanOld();
  // زرار تصدير كله - مرة واحدة بس
  if(!document.getElementById('unified-all')){
    let b=document.createElement('button'); b.id='unified-all'; b.innerHTML='📦 تصدير كله';
    b.style='background:#7c3aed;color:#fff;border:none;padding:8px 16px;border-radius:12px;font-weight:800;cursor:pointer;margin-right:8px;';
    b.onclick=unifiedExportAll;
    document.getElementById('navBar')?.appendChild(b);
  }
  // زرار الصفحة الحالية - واحد بس لكل تاب
  ['daily','total','purchases','sales','database'].forEach(id=>{
    let cont=document.getElementById(id); if(!cont) return;
    if(cont.querySelector('#unified-'+id)) return;
    let btn=document.createElement('button'); btn.id='unified-'+id;
    btn.innerHTML='📥 تصدير اكسل'; btn.style='background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;cursor:pointer;margin:8px;float:left;';
    btn.onclick=unifiedExportCurrent; cont.prepend(btn);
  });
  // للخاص كمان
  let priv=document.getElementById('privateApp');
  if(priv &&!priv.querySelector('#unified-private')){
    let btn=document.createElement('button'); btn.id='unified-private';
    btn.innerHTML='📥 تصدير الخاص اكسل'; btn.style='background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;cursor:pointer;margin:8px;';
    btn.onclick=unifiedExportCurrent; priv.prepend(btn);
  }
}
// شغل اول مرة + كل 1 ثانية امسح القديم
setInterval(()=>{ if(typeof XLSX!=='undefined') addExportButtons(); }, 1000);
})();
