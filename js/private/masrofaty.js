/* masrofaty.js - V17 - ثابت شمال / يومي يمين - مضبوط */
let masrofatyFilter = { search: '' };
const defaultFixed = [
  { id: 'f1', name: 'الايجار', icon: '🏠' }, { id: 'f2', name: 'الجراج', icon: '🚗' },
  { id: 'f3', name: 'الكهرباء', icon: '⚡' }, { id: 'f4', name: 'الغاز', icon: '🔥' },
  { id: 'f5', name: 'النت', icon: '🌐' }, { id: 'f6', name: 'المياه', icon: '💧' },
];
let monthlyFixed = []; let dailyCats = [];
try { monthlyFixed = JSON.parse(localStorage.getItem('monthlyFixed_v16')) || defaultFixed.map(x => ({ ...x, amount: 0 })) } catch { monthlyFixed = defaultFixed.map(x => ({ ...x, amount: 0 })) }
try { dailyCats = JSON.parse(localStorage.getItem('dailyCats_v16')) || ['عام', 'أكل', 'مواصلات', 'شغل', 'شيسيش', 'بنزين', 'علاج'] } catch { dailyCats = ['عام', 'أكل', 'مواصلات', 'شغل'] }

if (typeof window.privateStore === 'undefined') window.privateStore = {};
if (!window.privateStore.masrofaty) window.privateStore.masrofaty = [];
if (!window.privateStore.masrofatyIncome) window.privateStore.masrofatyIncome = [];
(function () { try { let s = JSON.parse(localStorage.getItem('privateStore') || '{}'); if (s.masrofaty) window.privateStore.masrofaty = s.masrofaty; if (s.masrofatyIncome) window.privateStore.masrofatyIncome = s.masrofatyIncome; } catch { } })();

function savePrivate() { localStorage.setItem('privateStore', JSON.stringify(window.privateStore)); localStorage.setItem('monthlyFixed_v16', JSON.stringify(monthlyFixed)); localStorage.setItem('dailyCats_v16', JSON.stringify(dailyCats)); }
function isPaid(n) { let m = new Date().getMonth(), y = new Date().getFullYear(); return window.privateStore.masrofaty.some(r => { let d = new Date(r.date); return r.cat === n && d.getMonth() === m && d.getFullYear() === y }) }

window.addIncome = function () { let s = document.getElementById('inc-source').value.trim(); let a = parseFloat(document.getElementById('inc-amount').value) || 0; let d = document.getElementById('inc-date').value || new Date().toISOString().slice(0, 10); if (!s || !a) return alert('اكتب الجهة والمبلغ'); window.privateStore.masrofatyIncome.push({ id: Date.now().toString(), source: s, amount: a, date: d }); document.getElementById('inc-source').value = ''; document.getElementById('inc-amount').value = ''; savePrivate(); renderMasrofaty(); }
window.delIncome = function (id) { window.privateStore.masrofatyIncome = window.privateStore.masrofatyIncome.filter(r => String(r.id) !== String(id)); savePrivate(); renderMasrofaty(); }
window.updateFixedAmount = function (id, val) { let it = monthlyFixed.find(x => String(x.id) === String(id)); if (it) { it.amount = parseFloat(val) || 0; savePrivate(); } }
window.payFixed = function (name) { let it = monthlyFixed.find(x => x.name === name); if (!it || !it.amount) return alert('حدد المبلغ'); if (isPaid(name)) return alert('مدفوع'); window.privateStore.masrofaty.push({ id: 'paid_' + Date.now(), date: new Date().toISOString().slice(0, 10), bayan: name, amount: it.amount, cat: name, pay: 'ثابت' }); savePrivate(); renderMasrofaty(); }
window.addNewFixed = function () { let n = prompt('اسم البند الثابت:'); if (!n) return; let a = prompt('المبلغ:', '0'); monthlyFixed.push({ id: Date.now().toString(), name: n.trim(), icon: '📌', amount: parseFloat(a) || 0 }); savePrivate(); renderMasrofaty(); }
window.delFixed = function (id) { if (!confirm('تمسح الثابت؟')) return; monthlyFixed = monthlyFixed.filter(x => String(x.id) !== String(id)); savePrivate(); renderMasrofaty(); }
window.addDailyCategory = function () { let n = prompt('اسم البند اليومي الجديد:'); if (!n) return; n = n.trim(); if (dailyCats.includes(n)) return alert('موجود'); dailyCats.push(n); savePrivate(); renderMasrofaty(); }
window.delDailyCategory = function (name) { if (!confirm(`تمسح بند ${name}؟`)) return; dailyCats = dailyCats.filter(c => c !== name); savePrivate(); renderMasrofaty(); }
window.addDaily = function () { let d = document.getElementById('m-date').value, b = document.getElementById('m-bayan').value.trim(), a = document.getElementById('m-amount').value, c = document.getElementById('m-cat').value, p = document.getElementById('m-pay').value; if (!b || !a) return alert('اكتب البيان والمبلغ'); window.privateStore.masrofaty.push({ id: Date.now().toString() + Math.random().toString(36).substr(2, 3), date: d, bayan: b, amount: parseFloat(a), cat: c, pay: p }); savePrivate(); document.getElementById('m-bayan').value = ''; document.getElementById('m-amount').value = ''; renderMasrofaty(); }
window.delDaily = function (id, bayan) { if (!confirm(`تمسح ${bayan}؟`)) return; window.privateStore.masrofaty = window.privateStore.masrofaty.filter(r => String(r.id) !== String(id)); savePrivate(); renderMasrofaty(); }
window.clearAllExamples = function () { if (!confirm('امسح كل اليومي؟')) return; window.privateStore.masrofaty = []; savePrivate(); renderMasrofaty(); }

function renderMasrofaty() {
  let pane = document.getElementById('pane-masrofaty'); if (!pane) return;
  let curM = new Date().getMonth(), curY = new Date().getFullYear();
  let incomes = window.privateStore.masrofatyIncome.filter(r => { let d = new Date(r.date); return d.getMonth() === curM && d.getFullYear() === curY });
  let totalIncome = incomes.reduce((s, x) => s + (+x.amount || 0), 0);
  let totalFixed = monthlyFixed.reduce((s, x) => s + (+x.amount || 0), 0);
  let monthExpenses = [...window.privateStore.masrofaty].filter(r => { let d = new Date(r.date); return d.getMonth() === curM && d.getFullYear() === curY });
  let spent = monthExpenses.reduce((s, r) => s + (+r.amount || 0), 0);
  let fixedNames = monthlyFixed.map(f => f.name);

  pane.innerHTML = `
  <style>
    #pane-masrofaty{font-family:'Tajawal',system-ui; direction:rtl; --b:#e2e8f0}
    .wrap{max-width:1350px; margin:0 auto; display:flex; flex-direction:column; gap:8px}
    .top-bar{background:#0f172a; border-radius:12px; padding:8px 12px; display:flex; justify-content:space-between; align-items:center; color:#fff; flex-wrap:wrap; gap:8px}
    /* هنا الترتيب الصح: عمودين - اليمين يومي 1fr والشمال ثابت 380px */
    .main-tables{display:grid; grid-template-columns: 1fr 380px; gap:8px; align-items:start}
    .card{background:#fff; border:1px solid var(--b); border-radius:12px; overflow:hidden; display:flex; flex-direction:column}
    .card-h{padding:8px 10px; border-bottom:1px solid var(--b); display:flex; justify-content:space-between; align-items:center; background:#f8fafc; font-size:12px; font-weight:800}
    .row{padding:8px 10px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; font-size:12px}
    @media(max-width:1000px){.main-tables{grid-template-columns:1fr} .card.daily{order:1} .card.fixed{order:2}}
  </style>
  <div class="wrap">
    <div class="top-bar"><span>💰 إجمالي ${totalIncome.toLocaleString()}ج | ثابت ${totalFixed.toLocaleString()}ج | صرفت ${spent.toLocaleString()}ج | الباقي ${(totalIncome - spent).toLocaleString()}ج</span><div style="display:flex; gap:6px"><button onclick="clearAllExamples()" style="background:#ef4444; border:none; color:#fff; padding:5px 10px; border-radius:6px; font-size:11px; cursor:pointer">🗑 مسح اليومي</button></div></div>
    <div style="background:#fff; border:1px solid var(--b); border-radius:10px; padding:6px; display:flex; gap:6px; flex-wrap:wrap"><input type="date" id="inc-date" value="${new Date().toISOString().slice(0, 10)}" style="height:32px; border:1px solid var(--b); border-radius:7px"><input id="inc-source" placeholder="مصدر الدخل" style="flex:1; height:32px; border:1px solid var(--b); border-radius:7px; padding:0 8px"><input type="number" id="inc-amount" placeholder="المبلغ" style="width:90px; height:32px; border:1px solid var(--b); border-radius:7px"><button onclick="addIncome()" style="background:#0f172a; color:#fff; border:none; border-radius:7px; padding:0 12px; height:32px; cursor:pointer">+ إضافة</button><div style="display:flex; gap:4px; flex-wrap:wrap">${incomes.map(r => `<span style="background:#f1f5f9; padding:2px 6px; border-radius:10px; font-size:11px">${r.source} ${r.amount}ج <button onclick="delIncome('${r.id}')" style="border:none; background:none; color:red; cursor:pointer">✕</button></span>`).join('')}</div></div>

    <div class="main-tables">
      <!-- يمين: اليومي -->
      <div class="card daily">
        <div class="card-h"><span>📋 المصاريف اليومية - يمين (${monthExpenses.length}) - ${monthExpenses.reduce((s, r) => s + (+r.amount || 0), 0).toLocaleString()}ج</span><button onclick="addDailyCategory()" style="background:#0ea5e9; color:#fff; border:none; padding:4px 8px; border-radius:6px; font-size:10px; cursor:pointer">+ بند يومي</button></div>
        <div style="padding:6px; background:#f8fafc; border-bottom:1px solid var(--b)">
          <div style="display:flex; gap:4px; flex-wrap:wrap; margin-bottom:6px">${dailyCats.map(c => `<span style="background:#e0f2fe; padding:2px 6px; border-radius:12px; font-size:10px">${c} ${!['عام', 'أكل', 'مواصلات', 'شغل'].includes(c) ? `<button onclick="delDailyCategory('${c}')" style="border:none; background:none; color:#ef4444; cursor:pointer">✕</button>` : ''}</span>`).join('')}</div>
          <div style="display:grid; grid-template-columns:100px 1fr 80px 90px 70px 60px; gap:5px">
            <input type="date" id="m-date" value="${new Date().toISOString().slice(0, 10)}" style="height:30px; border:1px solid var(--b); border-radius:7px">
            <input id="m-bayan" placeholder="البيان" style="height:30px; border:1px solid var(--b); border-radius:7px; padding:0 6px">
            <input type="number" id="m-amount" placeholder="المبلغ" style="height:30px; border:1px solid var(--b); border-radius:7px">
            <select id="m-cat" style="height:30px; border:1px solid var(--b); border-radius:7px"><optgroup label="📌 ثابت">${monthlyFixed.map(c => `<option>${c.name}</option>`).join('')}</optgroup><optgroup label="📋 يومي">${dailyCats.map(c => `<option>${c}</option>`).join('')}</optgroup></select>
            <select id="m-pay" style="height:30px; border:1px solid var(--b); border-radius:7px"><option>كاش</option><option>فيزا</option></select>
            <button onclick="addDaily()" style="background:#0f172a; color:#fff; border:none; border-radius:7px; cursor:pointer">+ إضافة</button>
          </div>
        </div>
        <div style="max-height:520px; overflow:auto">${monthExpenses.map(r => `<div class="row"><div><b>${r.bayan}</b><div style="font-size:10px; color:#64748b">${r.date} • ${r.cat} • ${r.pay}</div></div><div style="display:flex; gap:6px; align-items:center"><b>${(+r.amount).toLocaleString()}ج</b><button onclick="delDaily('${r.id}','${r.bayan}')" style="border:none; background:#fee2e2; width:28px; height:28px; border-radius:6px; cursor:pointer">✕</button></div></div>`).join('') || '<div style="padding:20px; text-align:center; color:#94a3b8">فاضي</div>'}</div>
      </div>

      <!-- شمال: الثابت -->
      <div class="card fixed">
        <div class="card-h"><span>📌 المصاريف الثابتة - شمال (${monthlyFixed.length})</span><button onclick="addNewFixed()" style="background:#0f172a; color:#fff; border:none; padding:4px 8px; border-radius:6px; font-size:10px; cursor:pointer">+ بند ثابت</button></div>
        <div style="padding:6px; max-height:520px; overflow:auto; display:flex; flex-direction:column; gap:4px">
          ${monthlyFixed.map(it => `<div style="border:1px solid var(--b); border-radius:8px; padding:6px 8px; display:flex; justify-content:space-between; align-items:center; background:${isPaid(it.name) ? '#f0fdf4' : '#fff'}"><div><b style="font-size:11px">${it.icon} ${it.name}</b></div><div style="display:flex; gap:4px; align-items:center"><input type="number" value="${it.amount}" onchange="updateFixedAmount('${it.id}',this.value)" style="width:60px; height:24px; border:1px solid var(--b); border-radius:6px; text-align:center"><button onclick="payFixed('${it.name}')" style="height:24px; padding:0 8px; border-radius:6px; border:none; background:#0f172a; color:#fff; font-size:9px; cursor:pointer">${isPaid(it.name) ? '✔' : 'دفع'}</button><button onclick="delFixed('${it.id}')" style="width:22px; height:22px; border:none; background:#fee2e2; border-radius:5px; cursor:pointer">✕</button></div></div>`).join('')}
        </div>
        <div style="padding:8px; background:#f8fafc; border-top:1px solid var(--b); font-size:11px; text-align:center">إجمالي الثابت: <b>${totalFixed.toLocaleString()}ج</b></div>
      </div>
    </div>
  </div>`;
}
setTimeout(() => { if (document.getElementById('pane-masrofaty')) renderMasrofaty() }, 100);