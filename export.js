// export.js V9 - تصدير XLSX حقيقي بالعربي مرتب

function getTableData(table){
  let rows = [];
  let header = [...table.querySelectorAll('thead th, tr:first-child th')].map(th=>th.innerText.trim());
  if(header.length) rows.push(header);
  [...table.querySelectorAll('tbody tr, tr')].forEach(tr=>{
    let cols = [...tr.querySelectorAll('td, th')].map(td=>{
      let input = td.querySelector('input,select');
      if(input) return input.value;
      return td.innerText.trim();
    });
    if(cols.join('').trim() && cols.length>1) rows.push(cols);
  });
  // شيل التكرار
  let uniq = []; let seen = new Set();
  rows.forEach(r=>{ let k=r.join('|'); if(!seen.has(k)){ seen.add(k); uniq.push(r); } });
  return uniq.length? uniq : [['مفيش داتا']];
}

function exportSheet(filename, rows){
  if(!rows ||!rows.length){ alert('مفيش داتا'); return; }
  let ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = rows[0].map(()=>({wch:20}));
  // خلي العربي من اليمين
  ws['!dir'] = 'rtl';
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "البيانات");
  XLSX.writeFile(wb, filename + ".xlsx");
}

function exportAllInOne(){
  let wb = XLSX.utils.book_new();
  let tabs = ['daily','total','purchases','sales','database'];
  let found = false;
  tabs.forEach(id=>{
    let container = document.getElementById(id);
    if(!container) return;
    let tables = container.querySelectorAll('table');
    if(!tables.length) return;
    tables.forEach((t,i)=>{
      let data = getTableData(t);
      if(data.length<=1) return;
      let ws = XLSX.utils.aoa_to_sheet(data);
      ws['!dir']='rtl';
      XLSX.utils.book_append_sheet(wb, ws, (id+'-'+(i+1)).slice(0,31));
      found = true;
    });
  });
  if(!found){ alert('مفيش جداول ظاهرة للتصدير'); return; }
  XLSX.writeFile(wb, 'Omar-System-كامل-'+new Date().toISOString().slice(0,10)+'.xlsx');
}

window.exportCurrentTab = function(){
  let tab = document.querySelector('#pharmacyApp.tab-content.active')?.id || 'daily';
  let container = document.getElementById(tab);
  let tables = container.querySelectorAll('table');
  if(!tables.length){ alert('مفيش جدول'); return; }
  // لو فيه اكتر من جدول في نفس الصفحة (زي الاجمالي) هنحطهم كلهم في شيتات
  if(tables.length>1){
    let wb = XLSX.utils.book_new();
    tables.forEach((t,i)=>{
      let data = getTableData(t);
      if(data.length>1){
        let ws = XLSX.utils.aoa_to_sheet(data);
        ws['!dir']='rtl';
        XLSX.utils.book_append_sheet(wb, ws, ('جدول '+(i+1)).slice(0,31));
      }
    });
    XLSX.writeFile(wb, tab+'-'+new Date().toISOString().slice(0,10)+'.xlsx');
  } else {
    let data = getTableData(tables[0]);
    exportSheet(tab+'-'+new Date().toISOString().slice(0,10), data);
  }
}

window.addExportButtons = function(){
  // زرار يصدر كل حاجة مرة واحدة فوق خالص
  let nav = document.getElementById('navBar');
  if(nav &&!document.getElementById('btn-export-all-system')){
    let allBtn = document.createElement('button');
    allBtn.id='btn-export-all-system';
    allBtn.textContent='📦 تصدير كله XLSX';
    allBtn.style.cssText='background:#7c3aed;color:#fff;border:none;padding:8px 14px;border-radius:10px;font-weight:800;cursor:pointer;margin-right:8px;';
    allBtn.onclick=exportAllInOne;
    nav.appendChild(allBtn);
  }

  ['daily','total','purchases','sales','database'].forEach(id=>{
    let cont = document.getElementById(id);
    if(!cont || cont.querySelector('.btn-export-all')) return;
    let btn = document.createElement('button');
    btn.className='btn-export-all';
    btn.innerHTML='📥 تصدير الصفحة دي اكسل';
    btn.style.cssText='background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;cursor:pointer;margin:8px;float:left;';
    btn.onclick=exportCurrentTab;
    cont.prepend(btn);
  });
}
