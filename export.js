function downloadCSV(filename, rows){
  if(!rows || rows.length===0){ alert('مفيش داتا'); return; }
  let csv = rows.map(r=> r.map(c=> `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  let blob = new Blob(["\uFEFF"+csv], {type:'text/csv;charset=utf-8;'});
  let a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename+'.csv'; a.click();
}

function getTableRows(table){
  return [...table.querySelectorAll('tr')].map(tr=> [...tr.querySelectorAll('th,td,input,select')].map(el=>{
    if(el.tagName==='INPUT' || el.tagName==='SELECT') return el.value;
    return el.innerText.trim();
  })).filter(r=> r.join('').trim()!=='');
}

window.exportCurrentTab = function(){
  let tab = document.querySelector('#pharmacyApp .tab-content.active')?.id || 'daily';
  let table = document.querySelector(`#${tab} table`) || document.querySelector(`#${tab} .db-card table`) || document.querySelector(`#${tab} table`);
  if(!table){ 
    // صفحة الاجمالي مفيهاش table واحد، هناخد كل الجداول
    let allRows = [['البيانات']];
    document.querySelectorAll(`#${tab} table`).forEach(t=>{
      allRows = allRows.concat(getTableRows(t));
      allRows.push(['---']);
    });
    if(allRows.length>1){ downloadCSV(tab+'-'+new Date().toISOString().slice(0,10), allRows); return; }
    alert('مفيش جدول في الصفحة دي'); return;
  }
  let rows = getTableRows(table);
  downloadCSV(tab+'-'+new Date().toISOString().slice(0,10), rows);
}

window.addExportButtons = function(){
  ['daily','total','purchases','sales','database'].forEach(id=>{
    let cont = document.getElementById(id);
    if(!cont || cont.querySelector('.btn-export-all')) return;
    let btn = document.createElement('button');
    btn.className = 'btn-export-all';
    btn.innerHTML = '📥 تصدير اكسل';
    btn.style.cssText = 'background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;cursor:pointer;margin:8px;float:left;';
    btn.onclick = exportCurrentTab;
    cont.prepend(btn);
  });
}
