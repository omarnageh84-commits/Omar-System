// V9 - XLSX عربي مظبوط
function getTableData(table){
  let rows=[];
  let h=[...table.querySelectorAll('th')].map(th=>th.innerText.trim());
  if(h.length && h.join('').length>2) rows.push(h);
  [...table.querySelectorAll('tr')].forEach(tr=>{
    let cols=[...tr.querySelectorAll('td')].map(td=>{
      let inp=td.querySelector('input,select');
      return inp? inp.value : td.innerText.trim();
    });
    if(cols.join('').trim() && cols.length>1) rows.push(cols);
  });
  return rows;
}
function exportCurrentTab(){
  let tab=document.querySelector('#pharmacyApp.tab-content.active')?.id||'daily';
  let cont=document.getElementById(tab);
  let tables=[...cont.querySelectorAll('table')];
  if(!tables.length){alert('مفيش جدول');return;}
  let wb=XLSX.utils.book_new();
  tables.forEach((t,i)=>{
    let data=getTableData(t);
    if(data.length>0){
      let ws=XLSX.utils.aoa_to_sheet(data);
      ws['!cols']=data[0].map(()=>({wch:18}));
      XLSX.utils.book_append_sheet(wb,ws,('جدول '+(i+1)).slice(0,31));
    }
  });
  XLSX.writeFile(wb, tab+'-'+new Date().toLocaleDateString('ar-EG')+'.xlsx');
}
function exportAllInOne(){
  let wb=XLSX.utils.book_new();
  ['daily','total','purchases','sales','database'].forEach(id=>{
    let c=document.getElementById(id); if(!c) return;
    [...c.querySelectorAll('table')].forEach((t,i)=>{
      let d=getTableData(t); if(d.length<2) return;
      let ws=XLSX.utils.aoa_to_sheet(d); ws['!cols']=d[0].map(()=>({wch:16}));
      XLSX.utils.book_append_sheet(wb,ws,(id+'_'+(i+1)).slice(0,31));
    });
  });
  XLSX.writeFile(wb,'Omar-System-كامل-'+new Date().toISOString().slice(0,10)+'.xlsx');
}
window.addExportButtons=function(){
  let nav=document.getElementById('navBar');
  if(nav &&!document.getElementById('btn-all')){
    let b=document.createElement('button'); b.id='btn-all'; b.textContent='📦 تصدير كله';
    b.style='background:#7c3aed;color:#fff;border:none;padding:8px 14px;border-radius:10px;font-weight:800;margin-right:8px;cursor:pointer;';
    b.onclick=exportAllInOne; nav.appendChild(b);
  }
  ['daily','total','purchases','sales','database'].forEach(id=>{
    let cont=document.getElementById(id);
    if(!cont || cont.querySelector('.btn-export')) return;
    let btn=document.createElement('button'); btn.className='btn-export';
    btn.textContent='📥 تصدير اكسل'; btn.style='background:#0f172a;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;cursor:pointer;margin:8px;float:left;';
    btn.onclick=exportCurrentTab; cont.prepend(btn);
  });
}
