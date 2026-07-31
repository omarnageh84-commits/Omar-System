// export.js V12 - مكان التصدير الوحيد في السيستم كله
(function(){
  function getStore(n){ try{ if(window[n] && typeof window[n]==='object') return window[n]; let v=localStorage.getItem(n); if(v) return JSON.parse(v);}catch(e){} return null; }

  // امسح اي زرار تصدير قديم
  function cleanOld(){
    document.querySelectorAll('button').forEach(b=>{
      let t=(b.innerText||'').toLowerCase();
      if((t.includes('تصدير')||t.includes('اكسل')||t.includes('excel')) &&!b.id.startsWith('unified-')){
        if(b.closest('#pharmacyApp')||b.closest('#privateApp')||b.closest('#total-wrap')) b.remove();
      }
    });
  }

  window.unifiedExportCurrent=function(){
    if(typeof XLSX==='undefined'){ alert('مكتبة الاكسل لسه بتحمل'); return; }
    let isPrivate = document.getElementById('privateApp')?.style.display!=='none';
    let wb=XLSX.utils.book_new();
    if(isPrivate){
      ['masrofatyStore','dyonStore','hodorStore','notesStore'].forEach(k=>{
        let s=getStore(k); if(!s) return;
        let arr=Array.isArray(s)?s:Object.values(s); if(!arr.length) return;
        let headers=Object.keys(arr[0]); let rows=[headers].concat(arr.map(o=>headers.map(h=>o[h])));
        XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),k.replace('Store','').slice(0,31));
      });
    } else {
      let tab=document.querySelector('#pharmacyApp.tab-content.active')?.id||'total';
      if(tab==='daily'||tab==='total'){
        let store=getStore('dailyStore')||{};
        let rows=[['التاريخ','الموظف','الشيفت','العجز','القيمة','المورد','انستا','فودافون']];
        Object.keys(store).forEach(d=>{
          let arr=Array.isArray(store[d])?store[d]:Object.values(store[d]||{});
          arr.forEach(r=>{
            let emp=r.emp||r['1']||''; let val=r.val||r['6']||'';
            if(emp||val) rows.push([d,emp,r.shift||r['2']||'',r.diff||r['3']||'',val,r.sup||r['5']||'',r.insta||'',r.voda||'']);
          });
        });
        XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),tab);
      } else {
        let s=getStore('purchaseStore')||[];
        let rows=[['التاريخ','المورد','النوع','الدفع','القيمة']];
        s.forEach(r=>rows.push([r.date||'',r.supplier||'',r.type||'',r.pay||'',r.value||'']));
        XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),tab);
      }
    }
    if(wb.SheetNames.length===0){ alert('مفيش داتا'); return; }
    XLSX.writeFile(wb,'تصدير-'+new Date().toISOString().slice(0,10)+'.xlsx');
  }

  window.unifiedExportAll=function(){
    if(typeof XLSX==='undefined'){ alert('مكتبة الاكسل لسه بتحمل'); return; }
    let wb=XLSX.utils.book_new();
    let daily=getStore('dailyStore')||{};
    let rows=[['التاريخ','الموظف','القيمة']];
    Object.keys(daily).forEach(d=>{
      let arr=Array.isArray(daily[d])?daily[d]:Object.values(daily[d]||{});
      arr.forEach(r=>{ if(r.emp||r.val) rows.push([d,r.emp||'',r.val||'']); });
    });
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'الكل');
    XLSX.writeFile(wb,'Omar-System-كامل-'+new Date().toISOString().slice(0,10)+'.xlsx');
  }

  window.addExportButtons=function(){
    cleanOld();
    if(!document.getElementById('unified-all')){
      let b=document.createElement('button'); b.id='unified-all'; b.textContent='📦 تصدير كله';
      b.style='background:#7c3aed;color:#fff;border:none;padding:8px 16px;border-radius:12px;font-weight:800;cursor:pointer;margin-right:8px;';
      b.onclick=unifiedExportAll;
      document.getElementById('navBar')?.appendChild(b);
    }
    ['daily','total','purchases','sales','database'].forEach(id=>{
      let c=document.getElementById(id); if(!c||c.querySelector('#unified-'+id)) return;
      let btn=document.createElement('button'); btn.id='unified-'+id; btn.textContent='📥 تصدير اكسل';
      btn.style='background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;margin:8px;float:left;cursor:pointer;';
      btn.onclick=unifiedExportCurrent; c.prepend(btn);
    });
  }
  setInterval(()=>{ if(typeof XLSX!=='undefined') addExportButtons(); }, 800);
})();
