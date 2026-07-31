/* dyon.js - V8 FINAL - مسح مضمون + نفس نظام المصروفات */
if (typeof dyonFilter === 'undefined') var dyonFilter = { type: 'الكل', search: '', sort: 'newest' };

// **تحميل مرة واحدة بس - زي مصروفاتي**
if (typeof window.privateStore === 'undefined') window.privateStore = {};
if (!window.privateStore.dyon) window.privateStore.dyon = [];
if (!window.privateStore.masrofaty) window.privateStore.masrofaty = [];
if (!window.privateStore.masrofatyIncome) window.privateStore.masrofatyIncome = [];

(function initDyonOnce() {
  try {
    let s = JSON.parse(localStorage.getItem('privateStore') || '{}');
    if (s.dyon && s.dyon.length > window.privateStore.dyon.length) window.privateStore.dyon = s.dyon;
    if (s.masrofaty) window.privateStore.masrofaty = s.masrofaty;
    if (s.masrofatyIncome) window.privateStore.masrofatyIncome = s.masrofatyIncome;
    // اصلاح ID مكرر
    let seen = new Set();
    window.privateStore.dyon = window.privateStore.dyon.map(r => {
      if (!r.id) r.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      if (seen.has(String(r.id))) {
        r.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      }
      seen.add(String(r.id));
      return r;
    });
  } catch (e) { }
})();

function savePrivateDyon() {
  localStorage.setItem('privateStore', JSON.stringify(window.privateStore));
  if (typeof renderMasrofaty === 'function') renderMasrofaty();
}

function renderDyon() {
  let p = document.getElementById('pane-dyon'); if (!p) return;
  let allList = [...window.privateStore.dyon].sort((a, b) => new Date(b.date) - new Date(a.date));
  let filtered = allList.filter(r => (dyonFilter.type === 'الكل' || r.type === dyonFilter.type) && (!dyonFilter.search || r.person.toLowerCase().includes(dyonFilter.search.toLowerCase())));
  let leyaTotal = allList.filter(r => r.type === 'ليا').reduce((s, r) => s + (+r.amount - (+r.paid || 0)), 0);
  let alyaTotal = allList.filter(r => r.type === 'عليا').reduce((s, r) => s + (+r.amount - (+r.paid || 0)), 0);

  p.innerHTML = `
  <style>#pane-dyon{font-family:'Tajawal',system-ui;direction:rtl} .dy-row{background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:10px 14px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center} .icon-btn{width:28px; height:28px; border:none; border-radius:7px; cursor:pointer; font-size:12px} .del{ background:#fee2e2 } .edit{ background:#e0f2fe } .pay{ background:#fef9c3 }</style>
  <div style="display:flex; gap:8px; margin-bottom:10px; flex-wrap:wrap">
    <input id="d-person" placeholder="الاسم" style="flex:1; min-width:120px; height:36px; border:1px solid #e2e8f0; border-radius:8px; padding:0 10px">
    <input type="number" id="d-amount" placeholder="المبلغ" style="width:90px; height:36px; border:1px solid #e2e8f0; border-radius:8px; padding:0 10px">
    <select id="d-type" style="height:36px; border-radius:8px"><option value="ليا">💚 ليا</option><option value="عليا">❤ عليا</option></select>
    <input id="d-reason" placeholder="السبب" style="width:120px; height:36px; border:1px solid #e2e8f0; border-radius:8px; padding:0 10px">
    <button onclick="addDyon()" style="background:#0f172a; color:#fff; border:none; border-radius:8px; padding:0 14px; height:36px; font-weight:800; cursor:pointer">+ إضافة</button>
    <button onclick="clearAllDyon()" style="background:#ef4444; color:#fff; border:none; border-radius:8px; padding:0 10px; height:36px; font-size:11px; cursor:pointer">🗑 مسح الكل</button>
  </div>
  <div style="background:#f8fafc; padding:8px; border-radius:10px; margin-bottom:8px; font-size:12px; display:flex; justify-content:space-between"><span>💚 ليا ${leyaTotal.toLocaleString()}ج</span><span>❤ عليا ${alyaTotal.toLocaleString()}ج</span><span>الصافي ${(leyaTotal - alyaTotal).toLocaleString()}ج</span></div>
  <div>${filtered.map((r, idx) => {
    let rem = +r.amount - (+r.paid || 0); return `
    <div class="dy-row">
      <div style="display:flex; flex-direction:column"><b style="font-size:13px">${r.person} <span style="font-size:9px; color:#94a3b8">ID:${String(r.id).slice(-4)}</span></b><small style="font-size:10px; color:#64748b">${r.reason || ''} • ${r.date} • ${r.type} • متبقي ${rem.toLocaleString()}ج</small></div>
      <div style="display:flex; gap:6px; align-items:center">
        <span style="font-weight:800; font-size:13px">${(+r.amount).toLocaleString()}ج</span>
        <button class="icon-btn pay" onclick="payDyon('${r.id}')">💰</button>
        <button class="icon-btn edit" onclick="editDyon('${r.id}')">✏</button>
        <button class="icon-btn del" onclick="deleteDyon('${r.id}','${r.person}',${idx})">✕</button>
      </div>
    </div>`}).join('') || '<div style="padding:30px; text-align:center; color:#94a3b8">مفيش ديون</div>'}</div>`;
}

window.addDyon = function () {
  let person = document.getElementById('d-person').value.trim(), amount = document.getElementById('d-amount').value, type = document.getElementById('d-type').value, reason = document.getElementById('d-reason').value.trim();
  if (!person || !amount) return alert('اكتب الاسم والمبلغ');
  window.privateStore.dyon.push({ id: Date.now().toString() + Math.random().toString(36).substr(2, 4), person, amount: +amount, paid: 0, type, reason, date: new Date().toISOString().slice(0, 10) });
  savePrivateDyon(); renderDyon();
  document.getElementById('d-person').value = ''; document.getElementById('d-amount').value = ''; document.getElementById('d-reason').value = '';
}
window.payDyon = function (id) {
  let r = window.privateStore.dyon.find(x => String(x.id) === String(id)); if (!r) return alert('مش لاقي الدين');
  let rem = +r.amount - (+r.paid || 0);
  let pay = prompt(`سداد لـ ${r.person} - متبقي ${rem}ج`, rem); if (pay === null) return;
  let num = +pay; if (isNaN(num) || num <= 0) return;
  r.paid = (+r.paid || 0) + Math.min(num, rem); savePrivateDyon(); renderDyon();
}
window.editDyon = function (id) {
  let r = window.privateStore.dyon.find(x => String(x.id) === String(id)); if (!r) return;
  let p = prompt('الاسم:', r.person); if (p === null) return;
  let a = prompt('المبلغ:', r.amount); if (a === null) return;
  r.person = p.trim() || r.person; r.amount = parseFloat(a) || r.amount; savePrivateDyon(); renderDyon();
}

// **المسح الجديد المضمون**
window.deleteDyon = function (id, personName, idx) {
  if (!confirm(`تمسح دين ${personName} ؟`)) return;
  let before = window.privateStore.dyon.length;
  // 1- بالـ ID
  window.privateStore.dyon = window.privateStore.dyon.filter(r => String(r.id) !== String(id));
  // 2- لو فشل بالاسم والتاريخ
  if (window.privateStore.dyon.length === before) {
    window.privateStore.dyon = window.privateStore.dyon.filter(r => !(r.person === personName && String(r.id) === String(id)));
  }
  // 3- لو فشل بالـ index
  if (window.privateStore.dyon.length === before && idx !== undefined) {
    window.privateStore.dyon.splice(idx, 1);
  }
  console.log(`مسح ديون: قبل ${before} بعد ${window.privateStore.dyon.length}`);
  savePrivateDyon();
  renderDyon();
}
window.clearAllDyon = function () {
  if (!confirm('امسح كل الديون نهائيا؟')) return;
  window.privateStore.dyon = [];
  savePrivateDyon();
  renderDyon();
}
setTimeout(() => { if (document.getElementById('pane-dyon')) renderDyon(); }, 200);