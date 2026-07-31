function renderTotal() {
  let el = document.getElementById('total'); if (!el) return;
  el.innerHTML = `<div id="total-wrap">
    <style>
      .glass{background:#fff;border-radius:14px;padding:12px;margin-bottom:12px;border:1px solid #e2e8f0}
      .filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      .filters input{padding:8px 12px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:11px;font-weight:700}
      .filters button{padding:8px 16px;border:none;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer;color:#fff}
      table{width:100%;border-collapse:collapse;font-size:11px}
      th{background:#0f172a;color:#fff;padding:10px 6px;font-size:10px;text-align:center}
      td{padding:8px 6px;text-align:center;border-bottom:1px solid #f1f5f9}
      .safi{background:#0f172a;color:#fff;border-radius:8px;font-weight:900}
    </style>
    <div class="glass">
      <div class="filters">
        <input id="totalFrom" placeholder="من تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <input id="totalTo" placeholder="إلى تاريخ" onblur="this.value=parseDateSmartTotal(this.value);renderTotalTable()">
        <button onclick="clearTotalFilters()" style="background:#64748b">مسح الفلتر</button>
        <button onclick="fetchSheetData()" style="background:#16a34a">🔄 مزامنة من الشيت</button>
        <button onclick="exportTotalExcel()" style="background:#0f172a">📥 تصدير Excel</button>
      </div>
    </div>
    <div id="totalTableCard"></div>
  </div>`;
  renderTotalTable();
}
function parseDateSmartTotal(v) { if (!v) return ''; v = v.trim().replace(/-/g, '/'); let p = v.split('/'); let y = new Date().getFullYear(); if (p.length == 2) return p[0] + '/' + p[1] + '/' + y; if (p.length == 3) { if (p[2].length == 2) p[2] = '20' + p[2]; return p.join('/'); } return v; }
function parseDateForFilterTotal(s) { if (!s) return null; let p = s.split('/'); if (p.length !== 3) return null; return new Date(p[2], p[1] - 1, p[0]); }
function calcNumTotal(v) { try { if (!v) return 0; let e = (v + '').toString().replace(/,/g, '').trim(); if (/[\+\-\*\/]/.test(e)) return Function('"use strict";return (' + e + ')')(); return parseFloat(e) || 0; } catch { return 0; } }
function clearTotalFilters() { let a = document.getElementById('totalFrom'), b = document.getElementById('totalTo'); if (a) a.value = ''; if (b) b.value = ''; renderTotalTable(); }
function exportTotalExcel() { let html = document.getElementById('totalTableCard').innerHTML; let blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel' }); let url = URL.createObjectURL(blob); let a = document.createElement('a'); a.href = url; a.download = 'الاجمالي.xls'; a.click(); }

function renderTotalTable() {
  try {
    let dailyStore = JSON.parse(localStorage.getItem('dailyStore') || '{}');
    let fromV = document.getElementById('totalFrom')?.value || '', toV = document.getElementById('totalTo')?.value || '';
    let fromD = parseDateForFilterTotal(fromV), toD = parseDateForFilterTotal(toV);
    let rows = '';

    Object.keys(dailyStore).sort((a, b) => parseDateForFilterTotal(a) - parseDateForFilterTotal(b)).forEach(dateKey => {
      let d = parseDateForFilterTotal(dateKey);
      if (fromD && d && d < fromD) return; if (toD && d && d > toD) return;
      let data = dailyStore[dateKey]; if (!Array.isArray(data)) return;

      let empRows = {}, instaSum = 0, vodaSum = 0;
      data.forEach(it => {
        if (!it || !it.id) return;
        if (it.id.startsWith('t1_')) {
          let m = it.id.match(/t1_r(\d+)_c(\d+)/); if (!m) return;
          let r = m[1], c = m[2]; if (!empRows[r]) empRows[r] = { emp: '', shift: 0, diff: 0, val: 0, sup: '' };
          if (c === '1') empRows[r].emp = (it.val || '').trim();
          if (c === '2') empRows[r].shift = calcNumTotal(it.val);
          if (c === '3') empRows[r].diff = calcNumTotal(it.val);
          if (c === '5') empRows[r].sup = (it.val || '').trim();
          if (c === '6') empRows[r].val = calcNumTotal(it.val);
        }
        if (it.id.includes('insta_')) instaSum += calcNumTotal(it.val);
        if (it.id.includes('voda_')) vodaSum += calcNumTotal(it.val);
      });

      let first = true;
      Object.values(empRows).forEach(r => {
        if (!r.emp && !r.sup && r.shift == 0 && r.diff == 0 && r.val == 0) return;
        let safi = r.shift + r.diff - r.val + (first ? (instaSum + vodaSum) : 0);
        rows += `<tr>
          <td style="font-weight:900">${dateKey}</td>
          <td>${r.emp || '-'}</td>
          <td>${r.shift ? r.shift.toLocaleString() : '-'}</td>
          <td style="font-weight:800;${r.diff < 0 ? 'color:#dc2626' : 'color:#16a34a'}">${r.diff || 0}</td>
          <td>${r.val ? r.val.toLocaleString() : '-'}</td>
          <td>${r.sup || '-'}</td>
          <td style="color:#7c3aed;font-weight:900">${first && instaSum ? instaSum.toLocaleString() : '-'}</td>
          <td style="color:#dc2626;font-weight:900">${first && vodaSum ? vodaSum.toLocaleString() : '-'}</td>
          <td class="safi">${safi.toLocaleString()}</td>
        </tr>`;
        first = false;
      });
      // لو يوم مفهوش موظفين بس فيه انستا
      if (Object.keys(empRows).length === 0 && (instaSum || vodaSum)) {
        rows += `<tr style="background:#f5f3ff"><td>${dateKey}</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>${instaSum.toLocaleString()}</td><td>${vodaSum.toLocaleString()}</td><td class="safi">${(instaSum + vodaSum).toLocaleString()}</td></tr>`;
      }
    });

    document.getElementById('totalTableCard').innerHTML = `
      <div class="glass"><b>📅 التفصيلي اليومي - (تاريخ - موظف - شيفت - عجز - مورد - انستا - فودا - صافي)</b>
      <div style="overflow:auto;max-height:70vh;margin-top:10px"><table><thead><tr>
        <th>تاريخ اليوم</th><th>الموظف</th><th>قيمة الشيفت</th><th>العجز/الزيادة</th>
        <th>قيمة المورد</th><th>اسم مورد</th><th>انستا</th><th>فودافون</th><th>الصافي (حساب المشروع)</th>
      </tr></thead><tbody>${rows || '<tr><td colspan=9>اعمل مزامنة</td></tr>'}</tbody></table></div></div>`;
  } catch (e) { console.error(e); document.getElementById('totalTableCard').innerHTML = 'Error: ' + e.message; }
}