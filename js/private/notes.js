/* notes.js V6.2 - responsive mind map that expands + full notes & reminders */
let notesFilter = {cat:'الكل', search:'', view:'cards'};
let mindData = null;
let selectedNodeId = null;
let mindDrag = {id:null, offsetX:0, offsetY:0};
let editingId = null;
let drawingCtx=null, isDrawing=false, lastX=0, lastY=0, currentTool='pen', currentColor='#0f172a', currentSize=3;
let mindZoom = 1;

const defaultCats = [
 {name:'الكل', icon:'◉', color:'#0f172a', locked:true},
 {name:'تذكير', icon:'⏰', color:'#f59e0b'},
 {name:'شغل', icon:'💼', color:'#0ea5e9'},
 {name:'هدف', icon:'🎯', color:'#111827'},
 {name:'خطة', icon:'🗺️', color:'#8b5cf6'},
 {name:'رسم', icon:'🎨', color:'#ec4899'},
 {name:'خريطة', icon:'🧠', color:'#facc15'},
 {name:'شخصي', icon:'👤', color:'#10b981'},
 {name:'مالي', icon:'💰', color:'#ef4444'}
];
function getAllCats(){return [...defaultCats, ...(privateStore.customCats||[])];}
function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2);}
function getMindData(){
 if(privateStore.mindMap) return privateStore.mindMap;
 return {id:'root', text:'مهام الصيدلية', color:'#facc15', x:600, y:300, children:[
  {id:uid(), text:'عم جمال', color:'#f59e0b', x:300,y:80, children:[{id:uid(), text:'بيع للعميل فقط', color:'#fbbf24', x:60,y:60, children:[]}]},
  {id:uid(), text:'د. محمد', color:'#22c55e', x:300,y:150, children:[{id:uid(), text:'بيع للعميل', color:'#86efac', x:80,y:130, children:[]},{id:uid(), text:'شراء من العميل', color:'#86efac', x:80,y:180, children:[]}]},
  {id:uid(), text:'د. محمود', color:'#0ea5e9', x:300,y:240, children:[{id:uid(), text:'بيع للعميل', color:'#7dd3fc', x:80,y:220, children:[]},{id:uid(), text:'ادخال طلبيات', color:'#7dd3fc', x:80,y:270, children:[]}]},
  {id:uid(), text:'عمر', color:'#8b5cf6', x:300,y:340, children:[{id:uid(), text:'بيع للعميل', color:'#c4b5fd', x:60,y:310, children:[]},{id:uid(), text:'حسابات', color:'#c4b5fd', x:60,y:350, children:[]},{id:uid(), text:'ادخال طلبيات', color:'#c4b5fd', x:60,y:390, children:[]}]},
  {id:uid(), text:'مدحت', color:'#ec4899', x:300,y:440, children:[{id:uid(), text:'رفوف الصاله', color:'#f9a8d4', x:60,y:430, children:[]}]},
  {id:uid(), text:'عم احمد', color:'#14b8a6', x:300,y:520, children:[{id:uid(), text:'توصيل', color:'#5eead4', x:60,y:510, children:[]},{id:uid(), text:'رفوف كريم وفيتامينات', color:'#5eead4', x:60,y:560, children:[]}]},
  {id:uid(), text:'عم ناصر', color:'#f97316', x:300,y:610, children:[{id:uid(), text:'نظافة الصيدليه', color:'#fdba74', x:60,y:600, children:[]}]},
  {id:uid(), text:'د. خالد', color:'#6366f1', x:300,y:700, children:[]}
 ]};
}
function saveMind(){privateStore.mindMap=mindData; savePrivate();}
function findNode(r,id){if(r.id===id) return r; for(let c of r.children||[]){let f=findNode(c,id); if(f) return f} return null}
function findParent(r,id,p=null){if(r.id===id) return p; for(let c of r.children||[]){let f=findParent(c,id,r); if(f) return f} return null}

function renderNotes(){
 let p=document.getElementById('pane-notes'); if(!p) return;
 if(!mindData) mindData=getMindData();
 if(notesFilter.view==='mindmap'){ renderMindMap(p); return; }

 let allCats=getAllCats();
 let list=[...(privateStore.notes||[])].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||new Date(b.dateRaw||0)-new Date(a.dateRaw||0));
 let reminders = list.filter(n=>n.cat==='تذكير');
 let filtered=list.filter(r=>{
  let catMatch=notesFilter.cat==='الكل'||(r.cat||'شخصي')===notesFilter.cat;
  let q=notesFilter.search.toLowerCase().trim();
  let searchMatch=!q||(r.text||'').toLowerCase().includes(q)||(r.title||'').toLowerCase().includes(q)||(r.tasks||[]).some(t=>t.text.toLowerCase().includes(q));
  return catMatch&&searchMatch;
 });

 p.innerHTML=`
 <style>
  #pane-notes{direction:rtl;font-family:'Tajawal',sans-serif;--dark:#0f172a;--border:#e2e8f0;--bg:#f8fafc}
  .notes-app{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:260px 1fr;gap:16px}
  @media(max-width:900px){.notes-app{grid-template-columns:1fr}}
  .n-side{background:#fff;border:1.5px solid var(--border);border-radius:20px;padding:14px;height:fit-content;position:sticky;top:14px}
  .n-cat-item{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;cursor:pointer;margin-bottom:4px;border:1.5px solid transparent;transition:.15s}
  .n-cat-item:hover{background:var(--bg)} .n-cat-item.active{background:var(--dark);color:#fff;border-color:var(--dark)}
  .n-cat-item .left{display:flex;gap:8px;align-items:center;font-weight:800;font-size:13px} .n-cat-item .dot{width:10px;height:10px;border-radius:50%}
  .n-cat-item .count{font-size:11px;background:#f1f5f9;padding:3px 8px;border-radius:20px;color:#475569;font-weight:800}
  .n-cat-item.active .count{background:rgba(255,255,255,.15);color:#fff}
  .n-main{display:flex;flex-direction:column;gap:14px}
  .n-topbar{background:#fff;border:1.5px solid var(--border);border-radius:20px;padding:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;box-shadow:0 4px 20px rgba(0,0,0,.04)}
  .n-search{flex:1;min-width:200px;position:relative}
  .n-search input{width:100%;height:46px;border-radius:12px;border:1.5px solid var(--border);padding:0 44px 0 14px;font-weight:700;background:var(--bg);outline:none}
  .n-search input:focus{border-color:var(--dark);background:#fff}
  .n-btn{height:46px;padding:0 18px;border-radius:12px;border:none;font-weight:900;font-size:13px;cursor:pointer;display:flex;gap:6px;align-items:center;transition:.2s}
  .n-btn.dark{background:var(--dark);color:#fff}.n-btn.map{background:linear-gradient(135deg,#facc15,#f59e0b);color:#000;border:1.5px solid #facc15}.n-btn.light{background:#fff;border:1.5px solid var(--border);color:#0f172a}
  .n-btn:hover{transform:translateY(-1px)}
  .n-composer{background:#fff;border:1.5px solid var(--border);border-radius:20px;padding:16px;box-shadow:0 8px 30px rgba(0,0,0,.05)}
  .n-composer-top{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
  .n-composer-top input,.n-composer-top select{height:44px;border-radius:12px;border:1.5px solid var(--border);background:var(--bg);font-weight:700;padding:0 14px;outline:none}
  .n-title{flex:1;min-width:180px}.n-textarea{width:100%;min-height:90px;border-radius:12px;border:1.5px solid var(--border);padding:14px;font-weight:600;line-height:1.7;outline:none;resize:vertical;background:var(--bg);font-family:inherit;transition:.2s}
  .n-textarea:focus{border-color:var(--dark);background:#fff;min-height:130px}
  .n-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px}
  .n-card{background:#fff;border:1px solid #f1f5f9;border-radius:20px;padding:16px;display:flex;flex-direction:column;transition:.2s;position:relative}
  .n-card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.08);border-color:#e2e8f0}
  .n-card.pinned{border:1.5px solid #facc15;box-shadow:0 0 0 3px rgba(250,204,21,.15)}
  .n-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
  .n-badge{font-size:11px;font-weight:900;padding:6px 12px;border-radius:100px;color:#fff}
  .n-date{font-size:11px;color:#94a3b8;background:#f8fafc;padding:5px 10px;border-radius:100px;font-weight:700}
  .n-card-title{font-size:15px;font-weight:900;margin:0 0 6px;color:#0f172a}.n-card-text{font-size:13.5px;color:#334155;line-height:1.7;white-space:pre-wrap;flex:1}
  .n-card img.draw{width:100%;border-radius:12px;border:1px solid #f1f5f9;margin-top:8px}
  .n-tasks{margin-top:10px;display:flex;flex-direction:column;gap:6px}.n-task{display:flex;gap:8px;align-items:center;background:#f8fafc;padding:8px 10px;border-radius:10px;font-size:13px;font-weight:600}
  .n-task.done{opacity:.5;text-decoration:line-through}
  .n-actions{display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid #f8fafc}
  .n-act{border:none;height:34px;padding:0 14px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer}
  .n-act.edit{background:var(--dark);color:#fff}.n-act.del{background:#fff1f2;color:#e11d48}.n-act.pin{background:#fefce8;color:#a16207}
  .n-reminder-bar{background:linear-gradient(135deg,#fef3c7,#fde68a);border:1.5px solid #fcd34d;border-radius:16px;padding:12px 14px;display:flex;gap:10px;align-items:center;overflow-x:auto}
  .n-reminder-item{background:#fff;border:1px solid #fcd34d;padding:8px 12px;border-radius:12px;white-space:nowrap;font-size:12px;font-weight:800;display:flex;gap:6px;align-items:center;box-shadow:0 2px 8px rgba(0,0,0,.05)}
  .n-modal-bg{position:fixed;inset:0;background:rgba(15,23,42,.6);backdrop-filter:blur(12px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px}
  .n-modal{background:#fff;width:100%;max-width:720px;border-radius:24px;padding:20px;max-height:90vh;overflow:auto;animation:pop .22s}
  @keyframes pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}
  .draw-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px;background:#f8fafc;border-radius:12px;margin-bottom:12px;border:1px solid #e2e8f0}
  .draw-toolbar button{height:36px;padding:0 12px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-weight:800;font-size:12px;cursor:pointer}
  .draw-toolbar button.active{background:var(--dark);color:#fff}
  .draw-canvas-wrap{background:#fff;border:2px dashed #cbd5e1;border-radius:16px;overflow:hidden}
  canvas#drawCanvas{width:100%;height:420px;display:block;cursor:crosshair;background:#fff}
 </style>
 <div class="notes-app">
  <div class="n-side">
   <h4 style="margin:0 0 12px;font-size:11px;font-weight:900;color:#64748b;letter-spacing:.5px">التصنيفات</h4>
   ${getAllCats().map(c=>{
    let count=c.name==='الكل'?(privateStore.notes||[]).length:(privateStore.notes||[]).filter(n=>(n.cat||'شخصي')===c.name).length;
    return `<div class="n-cat-item ${notesFilter.cat===c.name?'active':''}" onclick="notesFilter.cat='${esc(c.name)}';renderNotes()"><div class="left"><span class="dot" style="background:${c.color}"></span>${c.icon||''} ${esc(c.name)}</div><span class="count">${count}</span></div>`
   }).join('')}
   <button class="n-btn light" style="width:100%;margin-top:12px;justify-content:center" onclick="openCatModal()">+ تصنيف جديد</button>
   <div style="margin-top:14px;padding:12px;background:#fefce8;border:1.5px solid #fde68a;border-radius:14px"><b style="font-size:12px">🧠 الخريطة الذهنية</b><br><small style="font-size:11px;color:#92400e;font-weight:700">بتكبر لوحدها وانت بتكتب</small><button class="n-btn map" style="width:100%;margin-top:8px;justify-content:center" onclick="notesFilter.view='mindmap';renderNotes()">فتح الخريطة 🗺️</button></div>
   ${reminders.length?`<div style="margin-top:14px"><h4 style="font-size:11px;color:#92400e;margin:0 0 8px">⏰ تذكيرات</h4>${reminders.slice(0,3).map(r=>`<div style="background:#fffbeb;border:1px solid #fde68a;padding:8px 10px;border-radius:10px;margin-bottom:6px;font-size:12px;font-weight:700">⏰ ${esc(r.title||r.text||'تذكير').slice(0,30)}</div>`).join('')}</div>`:''}
  </div>
  <div class="n-main">
   <div class="n-topbar">
    <div class="n-search"><span style="position:absolute;right:14px;top:50%;transform:translateY(-50%)">🔍</span><input id="n-search-in" value="${esc(notesFilter.search)}" oninput="notesFilter.search=this.value;renderNotes()" placeholder="ابحث في الملاحظات والخطط..."></div>
    <button class="n-btn dark" onclick="openNewModal('text')">+ ملاحظة</button>
    <button class="n-btn light" onclick="openNewModal('plan')">🗺️ خطة</button>
    <button class="n-btn light" onclick="openDrawModal()">🎨 رسم</button>
    <button class="n-btn map" onclick="notesFilter.view='mindmap';renderNotes()">🧠 خريطة</button>
   </div>

   ${reminders.length?`<div class="n-reminder-bar">⏰ <b style="font-size:12px">تذكيراتك:</b> ${reminders.map(r=>`<div class="n-reminder-item">⏰ ${esc(r.title||'تذكير')} <small style="color:#94a3b8">${esc(r.date||'')}</small></div>`).join('')}</div>`:''}

   <div class="n-composer">
    <div class="n-composer-top"><input id="n-title" class="n-title" placeholder="عنوان سريع... (مثال: تذكير بطلبية)"><select id="n-cat">${getAllCats().filter(c=>c.name!=='الكل').map(c=>`<option value="${esc(c.name)}">${c.icon||''} ${esc(c.name)}</option>`).join('')}</select><button onclick="quickAdd()" class="n-btn dark">حفظ ⚡</button></div>
    <textarea id="n-text" class="n-textarea" placeholder="اكتب فكرة، مهمة، تذكير... الصفحة بتكبر لوحدها وانت بتكتب - دوس Ctrl+Enter للحفظ" oninput="this.style.height=''; this.style.height=this.scrollHeight+'px'" onkeydown="if(event.ctrlKey&&event.key==='Enter')quickAdd()"></textarea>
    <div style="display:flex;gap:8px;margin-top:10px"><small style="color:#94a3b8;font-size:11px;font-weight:700">💡 الخريطة بتتوسع تلقائي وانت بتكتب - والنوتس بتفضل محفوظة</small></div>
   </div>

   <div class="n-grid">
    ${filtered.length?filtered.map(r=>{
     let catObj=getAllCats().find(x=>x.name===(r.cat||'شخصي'))||getAllCats()[1];
     let tasksHtml=(r.tasks||[]).length?`<div class="n-tasks">${r.tasks.map(t=>`<div class="n-task ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} onchange="toggleTask('${r.id}','${t.id}')"><span>${esc(t.text)}</span></div>`).join('')}</div>`:'';
     let drawHtml=r.drawing?`<img class="draw" src="${r.drawing}" />`:'';
     return `<div class="n-card ${r.pinned?'pinned':''}"><div class="n-card-head"><span class="n-badge" style="background:${catObj.color}">${catObj.icon||''} ${esc(catObj.name)}</span><span class="n-date">${esc(r.date||'')}</span></div>${r.title?`<div class="n-card-title">${esc(r.title)}</div>`:''}<div class="n-card-text">${esc(r.text||'')}</div>${drawHtml}${tasksHtml}<div class="n-actions"><button class="n-act pin" onclick="togglePin('${r.id}')">${r.pinned?'إلغاء':'📌'}</button><button class="n-act edit" onclick="openEditModal('${r.id}')">✏ تعديل</button><button class="n-act del" onclick="deleteNote('${r.id}')">🗑 حذف</button></div></div>`
    }).join(''):`<div style="grid-column:1/-1;text-align:center;padding:80px 20px;background:#fff;border:1.5px dashed #e2e8f0;border-radius:20px"><div style="font-size:48px">📝</div><div style="font-weight:900;margin-top:10px">مفيش ملاحظات في ${esc(notesFilter.cat)}</div><div style="font-size:13px;color:#94a3b8;margin-top:6px">ابدأ بكتابة ملاحظة أو افتح الخريطة</div></div>`}
   </div>
  </div>
 </div>
 <div id="n-modal-root"></div>
 `;
}

function renderMindMap(p){
 let all=[]; function collect(n){all.push(n); (n.children||[]).forEach(collect)} collect(mindData);
 // حساب الحجم المطلوب للخريطة عشان تظهر كلها قدامك
 let minX=Math.min(...all.map(n=>n.x)), maxX=Math.max(...all.map(n=>n.x));
 let minY=Math.min(...all.map(n=>n.y)), maxY=Math.max(...all.map(n=>n.y));
 let width = Math.max(1000, maxX - minX + 600);
 let height = Math.max(800, maxY - minY + 600);
 let offsetX = 200 - minX;
 let offsetY = 100 - minY;

 p.innerHTML=`
 <style>
  #pane-notes{padding:0!important;direction:rtl;font-family:Tajawal,sans-serif;overflow:hidden}
  .mind-wrap{width:100%;height:calc(100vh - 40px);background:#050507;position:relative;overflow:hidden;border-radius:20px;border:1.5px solid #1e293b;display:flex;flex-direction:column}
  .mind-topbar{height:62px;min-height:62px;background:#0f0f0f;border-bottom:1px solid #1e293b;display:flex;align-items:center;justify-content:space-between;padding:0 12px;gap:8px;z-index:30;flex-wrap:wrap}
  .mind-topbar .btn{height:38px;padding:0 12px;border-radius:12px;border:1.5px solid #1e293b;background:#1a1a1a;color:#fff;font-weight:800;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:5px;transition:.15s}
  .mind-topbar .btn:hover{transform:translateY(-1px);border-color:#334155}
  .mind-topbar .btn.yellow{background:#facc15;color:#000;border-color:#facc15;font-weight:900}
  .mind-topbar .btn.ghost{background:transparent;border-color:#334155;color:#94a3b8}
  .mind-canvas{flex:1;position:relative;overflow:auto;background:radial-gradient(ellipse at center, #151515 0%, #050507 70%);scroll-behavior:smooth}
  .mind-canvas::-webkit-scrollbar{width:8px;height:8px}.mind-canvas::-webkit-scrollbar-thumb{background:#1e293b;border-radius:10px}
  .mind-viewport{position:relative;transform-origin:0 0;transition:transform .2s}
  .mind-svg{position:absolute;inset:0;pointer-events:none}
  .mind-node{position:absolute;min-width:90px;max-width:220px;padding:10px 14px;border-radius:12px;font-size:12.5px;font-weight:800;text-align:center;cursor:grab;user-select:none;box-shadow:0 4px 20px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:box-shadow .15s, transform .15s}
  .mind-node.root{background:#facc15!important;color:#000!important;font-size:15px;padding:13px 20px;border-radius:14px;font-weight:900;box-shadow:0 0 30px rgba(250,204,21,.5), 0 0 0 1px rgba(0,0,0,.2)}
  .mind-node.selected{outline:2.5px solid #fff;outline-offset:3px;box-shadow:0 0 0 5px rgba(250,204,21,.25), 0 12px 30px rgba(0,0,0,.6);transform:scale(1.06);z-index:10}
  .mind-node:hover{transform:scale(1.04);box-shadow:0 8px 30px rgba(0,0,0,.6)}
  .mind-node .del{position:absolute;left:-8px;top:-8px;width:20px;height:20px;background:#ef4444;color:#fff;border-radius:50%;display:none;place-items:center;font-size:10px;cursor:pointer;border:2px solid #000;font-weight:900}
  .mind-node:hover .del{display:grid}
  .mind-controls{position:absolute;bottom:16px;left:16px;background:rgba(0,0,0,.75);backdrop-filter:blur(12px);border:1px solid #1e293b;padding:10px;border-radius:14px;display:flex;gap:8px;align-items:center;z-index:20}
  .mind-controls button{width:36px;height:36px;border-radius:10px;border:1px solid #1e293b;background:#1a1a1a;color:#fff;font-weight:900;cursor:pointer}
  .mind-legend{position:absolute;bottom:16px;right:16px;background:rgba(0,0,0,.7);backdrop-filter:blur(10px);border:1px solid #1e293b;padding:10px 14px;border-radius:12px;color:#94a3b8;font-size:11px;font-weight:700;z-index:20;line-height:1.6}
  .mind-add-hint{position:absolute;top:16px;left:50%;transform:translateX(-50%);background:#facc15;color:#000;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:900;box-shadow:0 8px 20px rgba(250,204,21,.3);z-index:20;animation:bounce 2s infinite}
  @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-4px)}}
 </style>
 <div class="mind-wrap">
  <div class="mind-topbar">
   <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <button class="btn" onclick="notesFilter.view='cards';renderNotes()">← رجوع للنوتس</button>
    <b style="color:#fff;font-size:13px">🧠 خريطة مهام الصيدلية</b>
    <span style="background:#1e293b;color:#facc15;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:800">${all.length} مهمة - بتكبر لوحدها</span>
   </div>
   <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
    <button class="btn ghost" onclick="fitMindMap()">🔍 احتواء</button>
    <button class="btn" onclick="addChildNode(null)">+ فرع رئيسي</button>
    <button class="btn yellow" onclick="saveMind();this.textContent='✅ اتحفظت'; setTimeout(()=>this.textContent='💾 حفظ',1500)">💾 حفظ</button>
    <button class="btn" style="background:#1e293b" onclick="if(confirm('تمسح الخريطة كلها؟')){privateStore.mindMap=null; mindData=getMindData(); saveMind(); renderMindMap(document.getElementById('pane-notes'))}">🗑</button>
   </div>
  </div>
  <div class="mind-canvas" id="mindCanvas">
   <div class="mind-add-hint">✨ الخريطة بتكبر لوحدها وانت بتكتب - اسحب أي عقدة</div>
   <div class="mind-viewport" id="mindViewport" style="width:${width}px;height:${height}px;transform:scale(${mindZoom})">
    <svg class="mind-svg" id="mindSvg" width="${width}" height="${height}"></svg>
    <div id="mindNodes" style="position:absolute;inset:0;width:${width}px;height:${height}px"></div>
   </div>
   <div class="mind-controls">
    <button onclick="changeZoom(-0.1)">−</button>
    <span style="color:#fff;font-size:11px;font-weight:800;min-width:40px;text-align:center">${Math.round(mindZoom*100)}%</span>
    <button onclick="changeZoom(0.1)">+</button>
    <button onclick="fitMindMap()" title="احتواء الخريطة" style="margin-right:6px">⛶</button>
   </div>
   <div class="mind-legend">💡 <b style="color:#fff">ازاي تستخدمها:</b><br>• اسحب العقدة للتحريك<br>• اضغط عليها تغير الاسم واللون<br>• كل ما تكتب فرع جديد الخريطة بتتوسع<br>• دوس ⛶ عشان تشوفها كلها قدامك</div>
  </div>
 </div>
 <div id="n-modal-root"></div>
 `;
 // خزن ال offset عشان الرسم
 window._mindOffsetX = offsetX;
 window._mindOffsetY = offsetY;
 setTimeout(()=>{ drawMindNodes(offsetX, offsetY); fitMindMap(true); },60);
}

function drawMindNodes(offX=200, offY=100){
 let svg=document.getElementById('mindSvg'), container=document.getElementById('mindNodes');
 if(!svg||!container) return;
 container.innerHTML=''; svg.innerHTML='';
 let ox = window._mindOffsetX||offX;
 let oy = window._mindOffsetY||offY;
 function drawNode(node, parent){
  let el=document.createElement('div');
  el.className='mind-node'+(node.id===mindData.id?' root':'');
  if(node.id===selectedNodeId) el.classList.add('selected');
  el.style.left=(node.x+ox)+'px'; el.style.top=(node.y+oy)+'px';
  el.style.background=node.color||'#f59e0b';
  let light=['#ffffff','#facc15','#fbbf24','#fde68a','#a3e635','#fde047','#86efac','#7dd3fc','#c4b5fd','#f9a8d4','#5eead4','#fdba74'].includes(node.color);
  el.style.color=light?'#000':'#fff';
  el.textContent=node.text;
  let del=document.createElement('div'); del.className='del'; del.textContent='✕'; del.onclick=(e)=>{e.stopPropagation(); deleteNode(node.id)}; el.appendChild(del);
  el.addEventListener('mousedown',(e)=>{
   selectedNodeId=node.id;
   mindDrag.id=node.id;
   mindDrag.offsetX=e.clientX - (node.x+ox)*mindZoom;
   mindDrag.offsetY=e.clientY - (node.y+oy)*mindZoom;
   container.querySelectorAll('.mind-node').forEach(x=>x.classList.remove('selected'));
   el.classList.add('selected');
  });
  el.addEventListener('click',(e)=>{ if(mindDrag.id) return; e.stopPropagation(); openNodeEdit(node.id); });
  container.appendChild(el);
  if(parent){
   let line=document.createElementNS('http://www.w3.org/2000/svg','path');
   let x1=parent.x+ox+60, y1=parent.y+oy+18, x2=node.x+ox+10, y2=node.y+oy+18, mid=(x1+x2)/2;
   line.setAttribute('d',`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);
   line.setAttribute('stroke',parent.color||'#facc15'); line.setAttribute('stroke-width','2.8'); line.setAttribute('fill','none'); line.setAttribute('opacity','0.9');
   svg.appendChild(line);
  }
  (node.children||[]).forEach(ch=>drawNode(ch,node));
 }
 drawNode(mindData,null);
 let canvas=document.getElementById('mindCanvas');
 let viewport=document.getElementById('mindViewport');
 let moveHandler = (e)=>{
  if(mindDrag.id){
   let n=findNode(mindData,mindDrag.id);
   if(n){
    n.x = (e.clientX - mindDrag.offsetX)/mindZoom - ox;
    n.y = (e.clientY - mindDrag.offsetY)/mindZoom - oy;
    let el=container.querySelector('.mind-node.selected');
    if(el){ el.style.left=(n.x+ox)+'px'; el.style.top=(n.y+oy)+'px'; }
    redrawLines(ox, oy);
    // لو قرب من الحافة كبر الخريطة
    expandIfNeeded();
   }
  }
 };
 canvas.addEventListener('mousemove', moveHandler);
 canvas.addEventListener('mouseup', ()=>{ if(mindDrag.id){ mindDrag.id=null; saveMind(); } });
}
function redrawLines(ox,oy){
 let svg=document.getElementById('mindSvg'); if(!svg) return;
 ox = ox || window._mindOffsetX || 200;
 oy = oy || window._mindOffsetY || 100;
 svg.innerHTML='';
 function walk(n){ (n.children||[]).forEach(c=>{
  let l=document.createElementNS('http://www.w3.org/2000/svg','path');
  let x1=n.x+ox+60, y1=n.y+oy+18, x2=c.x+ox+10, y2=c.y+oy+18, mid=(x1+x2)/2;
  l.setAttribute('d',`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);
  l.setAttribute('stroke',n.color||'#facc15'); l.setAttribute('stroke-width','2.8'); l.setAttribute('fill','none'); l.setAttribute('opacity','0.9');
  svg.appendChild(l); walk(c);
 });}
 walk(mindData);
}
function expandIfNeeded(){
 // لو اي عقدة قربت من الحافة كبر ال viewport
 let all=[]; function collect(n){all.push(n); (n.children||[]).forEach(collect)} collect(mindData);
 let maxX=Math.max(...all.map(n=>n.x)), maxY=Math.max(...all.map(n=>n.y));
 let minX=Math.min(...all.map(n=>n.x)), minY=Math.min(...all.map(n=>n.y));
 let vp=document.getElementById('mindViewport');
 let svg=document.getElementById('mindSvg');
 if(!vp||!svg) return;
 let needW = maxX - minX + 800;
 let needH = maxY - minY + 800;
 if(needW > vp.offsetWidth || needH > vp.offsetHeight){
  vp.style.width = Math.max(vp.offsetWidth, needW+400)+'px';
  vp.style.height = Math.max(vp.offsetHeight, needH+400)+'px';
  svg.setAttribute('width', vp.style.width);
  svg.setAttribute('height', vp.style.height);
 }
}
function fitMindMap(initial=false){
 let canvas=document.getElementById('mindCanvas');
 let vp=document.getElementById('mindViewport');
 if(!canvas||!vp) return;
 let all=[]; function collect(n){all.push(n); (n.children||[]).forEach(collect)} collect(mindData);
 let minX=Math.min(...all.map(n=>n.x)), maxX=Math.max(...all.map(n=>n.x));
 let minY=Math.min(...all.map(n=>n.y)), maxY=Math.max(...all.map(n=>n.y));
 let centerX = (minX+maxX)/2 + (window._mindOffsetX||200);
 let centerY = (minY+maxY)/2 + (window._mindOffsetY||100);
 let scrollX = centerX * mindZoom - canvas.clientWidth/2;
 let scrollY = centerY * mindZoom - canvas.clientHeight/2;
 if(initial){ setTimeout(()=>{ canvas.scrollLeft=scrollX; canvas.scrollTop=scrollY; },100); }
 else { canvas.scrollTo({left:scrollX, top:scrollY, behavior:'smooth'}); }
}
function changeZoom(d){
 mindZoom = Math.min(2, Math.max(0.4, mindZoom+d));
 let vp=document.getElementById('mindViewport');
 if(vp) vp.style.transform=`scale(${mindZoom})`;
}
function deleteNode(id){if(id===mindData.id) return alert('مينفعش تمسح الجذر'); let p=findParent(mindData,id); if(!p) return; p.children=p.children.filter(c=>c.id!==id); saveMind(); renderMindMap(document.getElementById('pane-notes'));}
function addChildNode(pid){
 let parent=pid?findNode(mindData,pid):mindData;
 let colors=['#f59e0b','#22c55e','#0ea5e9','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1','#eab308','#10b981','#ef4444','#facc15'];
 let col=colors[Math.floor(Math.random()*colors.length)];
 let nn={id:uid(), text:'مهمة جديدة', color:col, x:parent.x-180+Math.random()*80, y:parent.y+70+Math.random()*40, children:[]};
 parent.children=parent.children||[]; parent.children.push(nn);
 saveMind();
 // اعادة حساب الحجم لو احتاج
 renderMindMap(document.getElementById('pane-notes'));
 setTimeout(()=>openNodeEdit(nn.id),150);
}
function openNodeEdit(id){
 let node=findNode(mindData,id); if(!node) return;
 let root=document.getElementById('n-modal-root');
 let colors=['#facc15','#f59e0b','#22c55e','#0ea5e9','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1','#ef4444','#10b981','#a3e635','#ffffff','#000000','#f472b6','#fb7185'];
 root.innerHTML=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this)closeModal()"><div style="background:#0f0f0f;color:#fff;border:1px solid #1e293b;width:100%;max-width:420px;border-radius:24px;padding:20px"><h3 style="margin:0 0 12px;font-weight:900">✏️ تعديل العقدة</h3><input id="node-text" value="${esc(node.text)}" placeholder="اكتب المهمة..." style="width:100%;height:46px;border-radius:12px;border:1.5px solid #1e293b;background:#1a1a1a;color:#fff;padding:0 14px;font-weight:800;margin-bottom:12px;outline:none" oninput="this.style.borderColor='#facc15'" onkeydown="if(event.key==='Enter'){document.getElementById('save-node-btn').click()}"><div style="font-size:12px;font-weight:800;color:#94a3b8;margin-bottom:8px">🎨 اختر اللون:</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">${colors.map(c=>`<div style="background:${c};width:30px;height:30px;border-radius:50%;cursor:pointer;border:2.5px solid ${node.color===c?'#fff':'transparent'};box-shadow:${node.color===c?'0 0 0 2px #facc15':''}" onclick="document.getElementById('node-text').dataset.color='${c}'; document.querySelectorAll('[data-color-dot]').forEach(d=>d.style.borderColor='transparent'); this.style.borderColor='#fff'; this.style.boxShadow='0 0 0 2px #facc15'" data-color-dot></div>`).join('')}</div><div style="display:flex;gap:8px"><button id="save-node-btn" onclick="let n=findNode(mindData,'${id}'); n.text=document.getElementById('node-text').value.trim()||'بدون عنوان'; let col=document.getElementById('node-text').dataset.color; if(col) n.color=col; saveMind(); closeModal(); renderMindMap(document.getElementById('pane-notes'))" style="flex:1;height:46px;background:#facc15;color:#000;border:none;border-radius:12px;font-weight:900;cursor:pointer">💾 حفظ وتكبير الخريطة</button><button onclick="addChildNode('${id}'); closeModal();" style="flex:1;height:46px;background:#1a1a1a;color:#fff;border:1.5px solid #1e293b;border-radius:12px;font-weight:800;cursor:pointer">+ فرع جديد</button></div><button onclick="closeModal()" style="width:100%;margin-top:8px;height:36px;background:transparent;color:#64748b;border:none;font-weight:700;cursor:pointer">إلغاء</button></div></div>`;
 document.getElementById('node-text').dataset.color=node.color;
 document.getElementById('node-text').focus(); document.getElementById('node-text').select();
}
function closeModal(){let r=document.getElementById('n-modal-root'); if(r) r.innerHTML='';}
function quickAdd(){let t=document.getElementById('n-title'), c=document.getElementById('n-cat'), x=document.getElementById('n-text'); if(!x.value.trim()&&!t.value.trim()){x.focus(); return;} if(!privateStore.notes) privateStore.notes=[]; privateStore.notes.push({id:uid(), title:t.value.trim(), cat:c.value, text:x.value.trim(), tasks:[], date:new Date().toLocaleDateString('ar-EG',{day:'2-digit',month:'short'}), dateRaw:new Date().toISOString(), pinned:false}); savePrivate(); t.value=''; x.value=''; x.style.height='90px'; renderNotes();}
function openCatModal(){let root=document.getElementById('n-modal-root'); root.innerHTML=`<div class="n-modal-bg" onclick="if(event.target===this)closeModal()"><div class="n-modal" style="max-width:420px"><h3 style="margin:0 0 14px;font-weight:900">تصنيف جديد</h3><input id="cat-name" placeholder="مثال: دراسة" style="width:100%;height:46px;border-radius:12px;border:1.5px solid #e2e8f0;padding:0 14px;font-weight:700;margin-bottom:10px"><div style="display:flex;gap:10px;align-items:center;margin-bottom:14px"><input type="color" id="cat-color" value="#0ea5e9" style="width:56px;height:44px"><span style="font-size:12px;font-weight:800;color:#64748b">لون</span></div><div style="display:flex;gap:10px;justify-content:flex-end"><button class="n-btn light" onclick="closeModal()">إلغاء</button><button class="n-btn dark" onclick="saveCat()">إضافة</button></div></div></div>`;}
function saveCat(){let name=document.getElementById('cat-name').value.trim(); if(!name) return; if(getAllCats().some(c=>c.name===name)) return alert('موجود'); let color=document.getElementById('cat-color').value; if(!privateStore.customCats) privateStore.customCats=[]; privateStore.customCats.push({name,color,icon:'📁'}); savePrivate(); closeModal(); renderNotes();}
function deleteNote(id){if(!confirm('تمسحها؟'))return; privateStore.notes=privateStore.notes.filter(r=>r.id!==id); savePrivate(); renderNotes();}
function togglePin(id){let r=privateStore.notes.find(x=>x.id===id); if(!r)return; r.pinned=!r.pinned; savePrivate(); renderNotes();}
function toggleTask(nid,tid){let n=privateStore.notes.find(x=>x.id===nid); let t=(n.tasks||[]).find(x=>x.id===tid); if(t){t.done=!t.done; savePrivate(); renderNotes();}}
function openNewModal(type){
 let root=document.getElementById('n-modal-root'); let allCats=getAllCats().filter(c=>c.name!=='الكل');
 root.innerHTML=`<div class="n-modal-bg" onclick="if(event.target===this)closeModal()"><div class="n-modal"><h3 style="margin:0 0 14px;font-weight:900">${type==='plan'?'🗺️ خطة جديدة':'📝 ملاحظة / تذكير'}</h3><input id="m-title" placeholder="العنوان (مثال: تذكير بطلبية)" style="width:100%;height:46px;border-radius:12px;border:1.5px solid #e2e8f0;padding:0 14px;font-weight:700;margin-bottom:10px"><select id="m-cat" style="width:100%;height:46px;border-radius:12px;border:1.5px solid #e2e8f0;padding:0 14px;margin-bottom:10px">${allCats.map(c=>`<option value="${esc(c.name)}" ${type==='plan'&&c.name==='خطة'?'selected':''} ${c.name==='تذكير'?'':''}>${c.icon||''} ${esc(c.name)}</option>`).join('')}</select><textarea id="m-text" placeholder="الوصف... الخريطة بتكبر لوحدها وانت بتكتب" style="width:100%;min-height:100px;border-radius:12px;border:1.5px solid #e2e8f0;padding:12px;margin-bottom:10px"></textarea>${type==='plan'?`<div id="plan-tasks"></div><div style="display:flex;gap:8px"><input id="new-task-in" placeholder="مهمة + Enter" style="flex:1;height:44px;border-radius:12px;border:1.5px dashed #cbd5e1;padding:0 12px"><button class="n-btn light" onclick="addTaskToForm()">+ مهمة</button></div>`:''}<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:14px"><button class="n-btn light" onclick="closeModal()">إلغاء</button><button class="n-btn dark" onclick="saveNewNote('${type}')">حفظ ✨</button></div></div></div>`;
 if(type==='plan'){ document.getElementById('new-task-in').addEventListener('keydown',e=>{if(e.key==='Enter') addTaskToForm();}); } window._tempTasks=[];
}
function addTaskToForm(){let inp=document.getElementById('new-task-in'); if(!inp.value.trim())return; window._tempTasks.push({id:uid(), text:inp.value.trim(), done:false}); inp.value=''; renderTempTasks();}
function renderTempTasks(){let box=document.getElementById('plan-tasks'); if(!box)return; box.innerHTML=window._tempTasks.map(t=>`<div style="display:flex;justify-content:space-between;background:#f8fafc;padding:10px 12px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:6px"><span>• ${esc(t.text)}</span><button onclick="window._tempTasks=window._tempTasks.filter(x=>x.id!=='${t.id}');renderTempTasks()" style="border:none;background:#fff1f2;color:#e11d48;border-radius:8px;padding:4px 8px">✕</button></div>`).join('');}
function saveNewNote(type){let title=document.getElementById('m-title').value.trim(); let cat=document.getElementById('m-cat').value; let text=document.getElementById('m-text').value.trim(); if(!text&&!title&&window._tempTasks.length===0) return; if(!privateStore.notes) privateStore.notes=[]; privateStore.notes.push({id:uid(), title, cat, text, tasks:type==='plan'?[...window._tempTasks]:[], drawing:null, date:new Date().toLocaleDateString('ar-EG',{day:'2-digit',month:'short', hour:'2-digit', minute:'2-digit'}), dateRaw:new Date().toISOString(), pinned:cat==='تذكير'}); savePrivate(); closeModal(); renderNotes();}
function openEditModal(id){let r=privateStore.notes.find(x=>x.id===id); if(!r)return; editingId=id; let allCats=getAllCats().filter(c=>c.name!=='الكل'); let root=document.getElementById('n-modal-root'); root.innerHTML=`<div class="n-modal-bg" onclick="if(event.target===this)closeModal()"><div class="n-modal"><h3>تعديل</h3><input id="e-title" value="${esc(r.title||'')}" style="width:100%;height:46px;border-radius:12px;border:1.5px solid #e2e8f0;padding:0 14px;margin-bottom:10px"><select id="e-cat" style="width:100%;height:46px;border-radius:12px;border:1.5px solid #e2e8f0;padding:0 14px;margin-bottom:10px">${allCats.map(c=>`<option value="${esc(c.name)}" ${c.name===r.cat?'selected':''}>${esc(c.name)}</option>`).join('')}</select><textarea id="e-text" style="width:100%;min-height:120px;border-radius:12px;border:1.5px solid #e2e8f0;padding:12px;margin-bottom:10px">${esc(r.text||'')}</textarea><div style="display:flex;gap:10px;justify-content:flex-end"><button class="n-btn light" onclick="closeModal()">إلغاء</button><button class="n-btn dark" onclick="saveEdit()">حفظ</button></div></div></div>`;}
function saveEdit(){let r=privateStore.notes.find(x=>x.id===editingId); if(!r)return; r.title=document.getElementById('e-title').value.trim(); r.cat=document.getElementById('e-cat').value; r.text=document.getElementById('e-text').value.trim(); savePrivate(); closeModal(); renderNotes();}
function openDrawModal(){
 let root=document.getElementById('n-modal-root');
 root.innerHTML=`<div class="n-modal-bg" onclick="if(event.target===this)closeModal()"><div class="n-modal" style="max-width:780px"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><h3 style="margin:0;font-weight:900">🎨 رسم - بيتوسع معاك</h3><button class="n-btn light" onclick="closeModal()">✕</button></div><div class="draw-toolbar"><button id="tool-pen" class="active" onclick="setTool('pen')">🖊️ قلم</button><button id="tool-eraser" onclick="setTool('eraser')">🧽 ممحاة</button><input type="color" id="draw-color" value="${currentColor}" onchange="currentColor=this.value" style="width:44px;height:36px"><select id="draw-size" onchange="currentSize=+this.value" style="height:36px;border-radius:10px;border:1.5px solid #e2e8f0"><option value="2">رفيع</option><option value="3" selected>متوسط</option><option value="6">سميك</option><option value="12">عريض</option></select><button onclick="clearCanvas()" style="margin-right:auto;background:#fff1f2;color:#e11d48;height:36px;padding:0 12px;border-radius:10px;border:1.5px solid #fecdd3;cursor:pointer">🗑 مسح</button><button class="n-btn dark" onclick="saveDrawing()">💾 حفظ</button></div><div class="draw-canvas-wrap"><canvas id="drawCanvas"></canvas></div></div></div>`;
 setTimeout(initCanvas,50);
}
function initCanvas(){let canvas=document.getElementById('drawCanvas'); if(!canvas)return; let rect=canvas.getBoundingClientRect(); canvas.width=rect.width*2; canvas.height=420*2; drawingCtx=canvas.getContext('2d'); drawingCtx.scale(2,2); drawingCtx.lineCap='round'; drawingCtx.lineJoin='round'; drawingCtx.strokeStyle=currentColor; drawingCtx.lineWidth=currentSize; canvas.addEventListener('mousedown',startDraw); canvas.addEventListener('mousemove',draw); canvas.addEventListener('mouseup',stopDraw); canvas.addEventListener('mouseout',stopDraw); canvas.addEventListener('touchstart',e=>{e.preventDefault(); let t=e.touches[0]; let m=new MouseEvent('mousedown',{clientX:t.clientX,clientY:t.clientY}); canvas.dispatchEvent(m);}); canvas.addEventListener('touchmove',e=>{e.preventDefault(); let t=e.touches[0]; let m=new MouseEvent('mousemove',{clientX:t.clientX,clientY:t.clientY}); canvas.dispatchEvent(m);}); canvas.addEventListener('touchend',e=>{e.preventDefault(); let m=new MouseEvent('mouseup',{}); canvas.dispatchEvent(m);});}
function getPos(e){let canvas=document.getElementById('drawCanvas'); let rect=canvas.getBoundingClientRect(); return {x:e.clientX-rect.left, y:e.clientY-rect.top};}
function startDraw(e){isDrawing=true; let p=getPos(e); lastX=p.x; lastY=p.y;}
function draw(e){if(!isDrawing)return; let p=getPos(e); drawingCtx.beginPath(); drawingCtx.moveTo(lastX,lastY); drawingCtx.lineTo(p.x,p.y); if(currentTool==='eraser'){drawingCtx.globalCompositeOperation='destination-out'; drawingCtx.lineWidth=currentSize*3;} else {drawingCtx.globalCompositeOperation='source-over'; drawingCtx.strokeStyle=currentColor; drawingCtx.lineWidth=currentSize;} drawingCtx.stroke(); lastX=p.x; lastY=p.y;}
function stopDraw(){isDrawing=false;}
function setTool(t){currentTool=t; document.getElementById('tool-pen')?.classList.toggle('active',t==='pen'); document.getElementById('tool-eraser')?.classList.toggle('active',t==='eraser');}
function clearCanvas(){let c=document.getElementById('drawCanvas'); if(c&&drawingCtx) drawingCtx.clearRect(0,0,c.width,c.height);}
function saveDrawing(){let c=document.getElementById('drawCanvas'); if(!c)return; let data=c.toDataURL('image/png'); if(!privateStore.notes) privateStore.notes=[]; privateStore.notes.push({id:uid(), title:'رسم - '+new Date().toLocaleDateString('ar-EG'), cat:'رسم', text:'', drawing:data, tasks:[], date:new Date().toLocaleDateString('ar-EG',{day:'2-digit',month:'short'}), dateRaw:new Date().toISOString(), pinned:false}); savePrivate(); closeModal(); renderNotes();}
