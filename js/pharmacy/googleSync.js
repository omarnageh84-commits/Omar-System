const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyjaqh-UHt7bqMv0EkVz4Y4ee2OKJUTE7n88hcm9PlW2H26w1bmRJS732JpGKrUY7GsCg/exec";

async function fetchSheetData() {
    try {
        let res = await fetch(GOOGLE_SHEET_URL);
        let json = await res.json();
        if (json.status !== "ok") { console.error(json); return; }

        let dailyStore = {};
        json.data.forEach(row => {
            if (!row.date) return;
            if (!dailyStore[row.date]) dailyStore[row.date] = [];
            let r = dailyStore[row.date].length + 1;

            // موظف وشيفت وعجز ومورد
            if (row.emp || row.sup || row.shift || row.diff || row.val) {
                if (row.emp) dailyStore[row.date].push({ id: `t1_r${r}_c1`, val: row.emp });
                if (row.shift) dailyStore[row.date].push({ id: `t1_r${r}_c2`, val: String(row.shift) });
                if (row.diff) dailyStore[row.date].push({ id: `t1_r${r}_c3`, val: String(row.diff) });
                if (row.sup) dailyStore[row.date].push({ id: `t1_r${r}_c5`, val: row.sup });
                if (row.val) dailyStore[row.date].push({ id: `t1_r${r}_c6`, val: String(row.val) });
            }
            // انستا وفودافون حتى لو الصف فاضي - ده اللي كان ناقص
            if (row.insta && row.insta != 0) dailyStore[row.date].push({ id: `insta_${r}_c2`, val: String(row.insta) });
            if (row.voda && row.voda != 0) dailyStore[row.date].push({ id: `voda_${r}_c2`, val: String(row.voda) });
        });

        localStorage.setItem('dailyStore', JSON.stringify(dailyStore));
        console.log("✅ تمت المزامنة - ايام:", Object.keys(dailyStore).length);
        if (typeof renderTotal === 'function') renderTotal();
        if (typeof renderDaily === 'function') renderDaily();
    } catch (e) { console.error("فشل السحب", e); }
}