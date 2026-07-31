// js/export.js - تصدير اكسل لكل الصفحات
function exportToExcel(filename, rows) {
  if (!rows ||!rows.length) { alert('مفيش داتا تتصدر'); return; }
  // بنستخدم CSV عشان يشتغل بدون مكتبات
  let csv = rows.map(r => r.map(c => `"${(c||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
  let blob = new Blob(["\uFEFF" + csv], {type: 'text/csv;charset=utf-8;'});
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a'); a.href = url; a.download = filename + '.csv'; a.click();
}

// 1- تصدير اليومية
function exportDaily() {
  let date = localStorage.getItem('selectedDate') || new Date().toLocaleDateString('en-GB');
  let store = JSON.parse(localStorage.getItem('dailyStore')||'{}');
  let data = store[date]; if(!data){ alert('مفيش يومية لليوم ده'); return; }
  let arr = Array.isArray(data)? data : Object.values(data);
  let rows = [['الموظف','الشيفت','العجز','المورد','القيمة']];
  arr.forEach(it => {
    if(!it.id ||!it.id.startsWith('t1_')) return;
    let m = it.id.match(/t1_r(\d+)_c(\d+)/); if(!m) return;
    // هنجمع الصفوف
  });
  // طريقة اسهل: ناخد من الجدول نفسه اللي ظاهر
  let table = document.querySelector('#daily table') || document.querySelector('table');
  if(table){
    let r = [...table.querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('th,td')].map(td => td.innerText));
    exportToExcel('يومية-'+date, r); return;
  }
  alert('افتح صفحة اليومية الاول');
}

// 2- تصدير الاجمالي (اللي عندك already بس هنخليه احسن)
function exportTotalAll() {
  let rows = [['التاريخ','دواء','كوزمتكس','مصاريف','الاجمالي']];
  document.querySelectorAll('#dailyTrend tr').forEach(tr=>{
    let tds = [...tr.querySelectorAll('td')].map(td=>td.innerText);
    if(tds.length) rows.push(tds);
  });
  exportToExcel('الاجمالي-'+new Date().toLocaleDateString('en-GB'), rows);
}

// 3- تصدير قواعد البيانات - الاصناف والموردين
function exportDatabase(type) {
  let tbody = document.getElementById('db-'+type);
  if(!tbody){ alert('افتح قواعد البيانات الاول'); return; }
  let rows = [];
  let head = [...document.querySelector(`#db-${type}`)?.closest('.db-card')?.querySelectorAll('th')||[]].map(th=>th.innerText);
  if(head.length) rows.push(head);
  [...tbody.querySelectorAll('tr')].forEach(tr=>{
    let cols = [...tr.querySelectorAll('input,select')].map(el=>el.value);
    if(cols.length) rows.push(cols);
  });
  exportToExcel(type+'-'+new Date().toLocaleDateString('en-GB'), rows);
}

// 4- زر عام يضاف فوق اي صفحة
function addExportBtn(pageId, funcName, label){
  let container = document.getElementById(pageId);
  if(!container || container.querySelector('.my-export-btn')) return;
  let btn = document.createElement('button');
  btn.className = 'my-export-btn';
  btn.textContent = label || '📥 تصدير اكسل';
  btn.style.cssText = 'background:#0f172a;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-weight:800;cursor:pointer;margin:6px';
  btn.onclick = window[funcName];
  container.prepend(btn);
}
