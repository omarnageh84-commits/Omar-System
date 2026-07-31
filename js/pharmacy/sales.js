    let salesStore = JSON.parse(localStorage.getItem('salesStore') || '[]');

    function getDB() { try { return JSON.parse(localStorage.getItem('dbStore') || '{}'); } catch { return {}; } }
    function getSuppliersForSales() {
        try {
            let db = getDB();
            let sup = (db.suppliers || []).map(s => s.name || s.c1).filter(Boolean);
            let mas = (db.masrofat || []).map(m => m.c1).filter(Boolean);
            return [...new Set([...sup, ...mas])];
        } catch { return []; }
    }
    function getItemsMap() {
        try {
            let db = getDB();
            let raw = db.items || db.asnaf || db.products || db.inventory || db.itemsList || [];
            let map = {};
            raw.forEach(r => {
                let name = (r.name || r.itemName || r.asnaf || r.c1 || r.productName || '').toString().trim();
                if (!name) return;
                let price = r.price ?? r.publicPrice ?? r.salePrice ?? r.s3rGomhor ?? r.c2 ?? r.c3 ?? r.buyPrice ?? 0;
                map[name.toLowerCase()] = { orig: name, price: (price + '').replace(/,/g, '') };
            });
            return map;
        } catch { return {}; }
    }

    function parseDateSmartSales(v) { if (!v) return ''; v = v.trim().replace(/-/g, '/'); let p = v.split('/'); let y = new Date().getFullYear(); if (p.length == 2) return `${p[0]}/${p[1]}/${y}`; if (p.length == 3) { if (p[2].length == 2) p[2] = '20' + p[2]; return p.join('/'); } return v; }
    function calcNumSales(v) { try { if (!v) return 0; let e = (v + '').toString().replace(/,/g, '').replace(/%/g, '').trim(); if (!e) return 0; if (/[\+\-\*\/]/.test(e)) return Function('"use strict";return (' + e + ')')(); return parseFloat(e) || 0; } catch { return 0; } }
    function formatNumSales(n) { return Number(n || 0).toLocaleString('en-US'); }
    function parseDateForFilterSales(s) { if (!s) return null; let p = s.split('/'); if (p.length !== 3) return null; let d = new Date(p[2], p[1] - 1, p[0]); return isNaN(d) ? null : d; }

    function renderSales() {
        let supList = getSuppliersForSales();
        let itemsMap = getItemsMap();
        let itemNames = Object.values(itemsMap).map(x => x.orig);

        let dl = `<datalist id="storeList">${supList.map(n => `<option value="${n}">`).join('')}</datalist><datalist id="itemsList">${itemNames.map(n => `<option value="${n}">`).join('')}</datalist>`;

        const el = document.getElementById('sales');
        if (!el) return;
        el.innerHTML = `
        ${dl}
        <style>
    .pro-table td{white-space:normal!important;vertical-align:middle!important;padding:6px!important}
    .pro-table input,.pro-table select{min-height:40px!important;border-radius:8px;border:1.5px solid #e2e8f0;padding:8px!important}
    .input-item{width:100%!important;text-align:right;font-weight:700;background:#eff6ff;border:1.5px solid #bfdbfe!important;font-size:13px}
    .invalid{border-color:#ef4444!important;background:#fee2e2!important}
    .error-msg{font-size:10px;color:#dc2626;font-weight:800;display:block}
    .bayan-تحضير{background:#fef9c3;color:#854d0e}.bayan-مردود{background:#fee2e2;color:#991b1b}.bayan-تم{background:#dcfce7;color:#166534}
    .filter-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#fff;border:1px solid #e2e8f0;padding:12px;border-radius:12px;margin-bottom:12px}
    .summary-card{margin-bottom:14px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#fff}
    .summary-title{background:#0f172a;color:#fff;padding:10px 14px;font-weight:800;font-size:13px}
        </style>

        <div class="filter-bar">
        <b>📊 فلترة:</b>
        <label>من:</label><input id="fFrom" style="width:90px" placeholder="1/7" onblur="this.value=parseDateSmartSales(this.value);applyFilter()">
        <label>إلى:</label><input id="fTo" style="width:90px" placeholder="31/7" onblur="this.value=parseDateSmartSales(this.value);applyFilter()">
        <label>المورد:</label><input id="fStore" list="storeList" style="width:130px;background:#f0fdf4" placeholder="الكل" oninput="applyFilter()">
        <label>التجميع:</label>
        <select id="fGroup" onchange="applyFilter()" style="background:#0f172a;color:#fff;font-weight:800"><option value="sendDate">تاريخ الارسال</option><option value="store">المورد</option></select>
        <button onclick="clearFilter()" style="padding:6px 12px;background:#fff;border:1px solid #ddd;border-radius:8px;cursor:pointer">مسح</button>
        <span id="filterInfo" style="margin-right:auto;font-size:11px;color:#64748b"></span>
        </div>

        <div id="summaryTable"></div>

        <div class="pro-table-card">
        <div class="pro-table-title dark">المبيعات - المخازن <div style="display:flex;gap:8px"><span style="cursor:pointer;background:#22c55e;color:#fff;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:800" onclick="addSalesRow()">+ إضافة صف</span><span style="cursor:pointer;background:#fff;color:#000;padding:6px 14px;border-radius:8px;font-size:12px" onclick="saveSales()">💾 حفظ</span></div></div>
        <div style="overflow:auto"><table class="pro-table" style="min-width:1600px;width:100%"><thead><tr><th>العدد</th><th style="width:350px">الصنف (كامل)</th><th>تاريخ الصلاحية</th><th>المورد</th><th>البيان</th><th>تاريخ الارسال</th><th>الخصم%</th><th>السعر</th><th>الإجمالي</th><th>بعد الخصم</th><th>حذف</th></tr></thead><tbody id="salesEntryBody"></tbody></table></div>
        </div>
    `;
        loadSalesEntry();
    }

    function loadSalesEntry() {
        let tbody = document.getElementById('salesEntryBody'); if (!tbody) return;
        tbody.innerHTML = '';
        if (salesStore.length === 0) { addSalesRow(); } else { salesStore.forEach(r => addSalesRow(r)); }
        // استنى الـ DOM يرسم
        setTimeout(() => { applyFilter(); }, 50);
    }

    function addSalesRow(data) {
        let tbody = document.getElementById('salesEntryBody'); if (!tbody) { renderSales(); return; }
        let row = data || { count: '', item: '', expDate: '', store: '', bayan: 'تحضير', sendDate: '', discount: '', price: '' };
        let tr = document.createElement('tr'); tr.className = 'entry-row';
        tr.innerHTML = `
        <td><input class="inp-count" style="width:100%;text-align:center" value="${row.count || ''}" placeholder="10" oninput="calcRowByTr(this)" onblur="updateSalesStore()"></td>
        <td><div><input class="input-item inp-item" value="${row.item || ''}" list="itemsList" placeholder="اسم الصنف" title="${row.item || ''}" onblur="checkItem(this);updateSalesStore()"></div></td>
        <td><input class="inp-exp" style="width:100%;text-align:center" value="${row.expDate || ''}" placeholder="1/2027" onblur="this.value=parseDateSmartSales(this.value);updateSalesStore()"></td>
        <td><div><input class="inp-store" style="width:100%;text-align:center;background:#f0fdf4" value="${row.store || ''}" list="storeList" placeholder="المورد" onblur="checkStore(this);updateSalesStore()"></div></td>
        <td><select class="bayan-select inp-bayan bayan-${row.bayan || 'تحضير'}" onchange="this.className='bayan-select inp-bayan bayan-'+this.value;calcRowByTr(this);updateSalesStore()"><option value="تحضير" ${row.bayan === 'تحضير' ? 'selected' : ''}>تحضير</option><option value="مردود" ${row.bayan === 'مردود' ? 'selected' : ''}>مردود</option><option value="تم" ${row.bayan === 'تم' ? 'selected' : ''}>تم</option></select></td>
        <td><input class="inp-send" style="width:100%;text-align:center" value="${row.sendDate || ''}" placeholder="5/7/2026" onblur="this.value=parseDateSmartSales(this.value);updateSalesStore()"></td>
        <td><input class="inp-disc" style="width:100%;text-align:center" value="${row.discount || ''}" placeholder="50" oninput="calcRowByTr(this)" onblur="updateSalesStore()"></td>
        <td><input class="inp-price" style="width:100%;text-align:center;background:#fffbeb" value="${row.price || ''}" placeholder="100" oninput="calcRowByTr(this)" onblur="updateSalesStore()"></td>
        <td style="background:#f8fafc;font-weight:800;text-align:center" class="calc-total">0</td>
        <td style="background:#dcfce7;font-weight:900;text-align:center" class="calc-final">0</td>
        <td><span style="cursor:pointer;color:#dc2626;font-weight:900" onclick="this.closest('tr').remove();updateSalesStore()">✖</span></td>
    `;
        tbody.appendChild(tr); calcRowByTr(tr.querySelector('.inp-count'));
    }

    function checkItem(input) {
        let v = input.value.trim().toLowerCase(); if (!v) { input.classList.remove('invalid'); return true; }
        let map = getItemsMap();
        if (!map[v]) {
            input.classList.add('invalid');
            input.title = 'صنف غير موجود - اختار من القائمة';
            return false;
        } else {
            input.classList.remove('invalid');
            let tr = input.closest('tr');
            let pr = tr.querySelector('.inp-price');
            if (!pr.value) pr.value = map[v].price;
            input.title = input.value;
            return true;
        }
    }
    function checkStore(input) {
        let v = input.value.trim().toLowerCase(); if (!v) { input.classList.remove('invalid'); return true; }
        let list = getSuppliersForSales().map(s => s.toLowerCase());
        if (!list.includes(v)) {
            input.classList.add('invalid'); return false;
        } else { input.classList.remove('invalid'); return true; }
    }

    function calcRowByTr(el) { try { let tr = el.closest('tr'); if (!tr) return; let c = calcNumSales(tr.querySelector('.inp-count')?.value); let p = calcNumSales(tr.querySelector('.inp-price')?.value); let d = calcNumSales(tr.querySelector('.inp-disc')?.value); let tot = c * p; let fin = tot * (1 - d / 100); if (tr.querySelector('.inp-bayan')?.value === 'مردود') { tot = -Math.abs(tot); fin = -Math.abs(fin); } tr.querySelector('.calc-total').textContent = formatNumSales(tot); tr.querySelector('.calc-final').textContent = formatNumSales(fin); } catch (e) { } }
    function updateSalesStore() {
        let arr = [];
        document.querySelectorAll('#salesEntryBody tr.entry-row').forEach(tr => {
            let c = tr.querySelector('.inp-count')?.value || '';
            let it = tr.querySelector('.inp-item')?.value || '';
            let ex = tr.querySelector('.inp-exp')?.value || '';
            let st = tr.querySelector('.inp-store')?.value || '';
            let by = tr.querySelector('.inp-bayan')?.value || 'تحضير';
            let sd = tr.querySelector('.inp-send')?.value || '';
            let ds = tr.querySelector('.inp-disc')?.value || '';
            let pr = tr.querySelector('.inp-price')?.value || '';
            if (!c && !it && !st && !pr) return;
            if (tr.querySelector('.invalid')) return; // ميحفظش الغلط
            arr.push({ count: c, item: it, expDate: ex, store: st, bayan: by, sendDate: sd, discount: ds, price: pr });
        });
        salesStore = arr; localStorage.setItem('salesStore', JSON.stringify(arr)); applyFilter();
    }
    function saveSales() { updateSalesStore(); if (document.querySelectorAll('.invalid').length > 0) { alert('❌ فيه صنف او مورد غلط بالاحمر - صلحه الاول'); return; } alert('✅ اتحفظ'); }

    function applyFilter() {
        try {
            let fromV = document.getElementById('fFrom')?.value || ''; let toV = document.getElementById('fTo')?.value || ''; let storeF = (document.getElementById('fStore')?.value || '').trim().toLowerCase(); let groupBy = document.getElementById('fGroup')?.value || 'sendDate';
            let fromD = parseDateForFilterSales(fromV); let toD = parseDateForFilterSales(toV);
            let grouped = {}; let visible = 0;

            document.querySelectorAll('#salesEntryBody tr.entry-row').forEach(tr => {
                let sd = tr.querySelector('.inp-send')?.value || ''; let d = parseDateForFilterSales(sd); let st = (tr.querySelector('.inp-store')?.value || '').toLowerCase();
                let show = true;
                if (fromD && d && d < fromD) show = false; if (toD && d && d > toD) show = false;
                if (storeF && !st.includes(storeF)) show = false;
                tr.style.display = show ? '' : 'none';
                if (!show) return;
                visible++;
                let key = groupBy === 'store' ? (tr.querySelector('.inp-store')?.value || 'بدون مورد') : (sd || 'بدون تاريخ');
                if (!grouped[key]) grouped[key] = { تحضير: 0, مردود: 0, تم: 0, الصافي: 0, العدد: 0 };
                let by = tr.querySelector('.inp-bayan')?.value || 'تحضير';
                let fin = calcNumSales(tr.querySelector('.calc-final')?.textContent);
                let cnt = calcNumSales(tr.querySelector('.inp-count')?.value);
                grouped[key][by] += fin; grouped[key].الصافي += fin; grouped[key].العدد += cnt;
            });

            let rows = Object.keys(grouped).sort().map(k => {
                let g = grouped[k];
                return `<tr><td style="font-weight:800;text-align:right">${k}</td><td style="background:#fef9c3">${formatNumSales(g.تحضير)}</td><td style="background:#fee2e2">${formatNumSales(g.مردود)}</td><td style="background:#dcfce7">${formatNumSales(g.تم)}</td><td style="background:#0f172a;color:#fff;font-weight:900">${formatNumSales(g.الصافي)}</td><td>${g.العدد}</td></tr>`;
            }).join('') || `<tr><td colspan=6 style="text-align:center;padding:15px;color:#999">لا يوجد بيانات</td></tr>`;

            let t1 = Object.values(grouped).reduce((s, o) => s + o.تحضير, 0), t2 = Object.values(grouped).reduce((s, o) => s + o.مردود, 0), t3 = Object.values(grouped).reduce((s, o) => s + o.تم, 0), tp = Object.values(grouped).reduce((s, o) => s + o.الصافي, 0), tc = Object.values(grouped).reduce((s, o) => s + o.العدد, 0);

            let summary = document.getElementById('summaryTable');
            if (summary) {
                summary.innerHTML = `<div class="summary-card"><div class="summary-title">📈 الإجمالي الذكي - حسب ${groupBy === 'store' ? 'المورد' : 'تاريخ الارسال'} (${Object.keys(grouped).length}) - الصافي = تحضير + تم + مردود</div><div style="overflow:auto"><table class="pro-table" style="width:100%"><thead><tr><th>${groupBy === 'store' ? 'المورد' : 'التاريخ'}</th><th>تحضير</th><th>مردود</th><th>تم</th><th>الصافي</th><th>العدد</th></tr></thead><tbody>${rows}</tbody><tfoot><tr style="background:#0f172a;color:#fff;font-weight:900"><td>الإجمالي</td><td>${formatNumSales(t1)}</td><td>${formatNumSales(t2)}</td><td>${formatNumSales(t3)}</td><td style="background:#166534">${formatNumSales(tp)}</td><td>${tc}</td></tr></tfoot></table></div></div>`;
            }
            let info = document.getElementById('filterInfo'); if (info) info.textContent = `ظاهر ${visible} صف`;
        } catch (e) { console.log(e); }
    }
    function clearFilter() { let a = document.getElementById('fFrom'); if (a) a.value = ''; let b = document.getElementById('fTo'); if (b) b.value = ''; let c = document.getElementById('fStore'); if (c) c.value = ''; applyFilter(); }