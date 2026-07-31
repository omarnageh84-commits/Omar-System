// js/private/private.js - V-FINAL
function renderPrivate(){
  let container = document.getElementById('private');
  if(!container) return;

  // لو مرسوم قبل كده متعيدش الرسم عشان ميكررش
  if(container.dataset.rendered === '1'){
    showPrivateTab('hodor'); // افتح الحضور افتراضي
    if(typeof renderHodor === 'function') renderHodor();
    return;
  }

  container.innerHTML = `
    <div class="private-nav" style="display:flex;gap:8px;flex-wrap:wrap;padding:12px;background:#f8fafc;border-radius:12px;margin-bottom:12px">
      <button class="private-tab" data-private="masrofaty">💸 مصروفاتي</button>
      <button class="private-tab" data-private="dyon">📒 الديون</button>
      <button class="private-tab active" data-private="hodor">🗓 الحضور والانصراف</button>
      <button class="private-tab" data-private="notes">📝 ملاحظاتي</button>
    </div>
    <div class="private-content">
      <div id="pane-masrofaty" class="private-pane"></div>
      <div id="pane-dyon" class="private-pane"></div>
      <div id="pane-hodor" class="private-pane active"></div>
      <div id="pane-notes" class="private-pane"></div>
    </div>
  `;
  container.dataset.rendered = '1';

  // شغل اول تاب
  setTimeout(()=>{
    showPrivateTab('hodor');
    if(typeof renderHodor === 'function') renderHodor();
    if(typeof renderMasrofaty === 'function') renderMasrofaty();
    if(typeof renderDyon === 'function') renderDyon();
    if(typeof renderNotes === 'function') renderNotes();
  }, 50);
}

function showPrivateTab(name){
  document.querySelectorAll('.private-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.private-pane').forEach(p=>p.classList.remove('active'));
  
  let btn = document.querySelector(`[data-private="${name}"]`);
  if(btn) btn.classList.add('active');
  
  let pane = document.getElementById(`pane-${name}`);
  if(pane) pane.classList.add('active');

  // لما يفتح الحضور ارسمه
  if(name === 'hodor' && typeof renderHodor === 'function'){
    renderHodor();
  }
  if(name === 'masrofaty' && typeof renderMasrofaty === 'function') renderMasrofaty();
  if(name === 'dyon' && typeof renderDyon === 'function') renderDyon();
  if(name === 'notes' && typeof renderNotes === 'function') renderNotes();
}
