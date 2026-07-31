function openMainTab(name, el) {
    document.querySelectorAll('.main-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(name).classList.add('active');
    el.classList.add('active');
}
function openPharmacyTab(name, el) {
    document.querySelectorAll('.ph-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sub-tab-ph').forEach(t => t.classList.remove('active'));
    document.getElementById(name).classList.add('active');
    el.classList.add('active');
    if (name === 'daily') renderDaily();
    if (name === 'total') renderTotal();
    if (name === 'purchases') renderPurchases();
    if (name === 'sales') renderSales();
    if (name === 'database') renderDatabase();
}
// شغل اليومية اول مرة
window.onload = () => { renderDaily(); }