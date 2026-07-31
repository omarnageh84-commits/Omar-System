// actions.js - نظيف - ممنوع تعمل override لـ renderDaily او renderTotal هنا
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${type === 'success' ? '#0f172a' : '#dc2626'};color:#fff;padding:10px 18px;border-radius:10px;font-weight:800;font-size:12px;z-index:9999;`;
  setTimeout(() => t.remove(), 2500);
}