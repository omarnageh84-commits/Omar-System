/* fix-arrows.js - Omar System v5 - إصلاح نهائي - يمين=يمين شمال=شمال فوق=فوق تحت=تحت */
(function(){
  console.log('✅ fix-arrows v5 - final');

  function isVisible(el){ return el && el.offsetParent!==null && !el.disabled && el.type!=='hidden'; }
  function focusIt(el){ if(!el) return; el.focus(); try{ el.select(); }catch(e){} }

  function getRowInputs(tr){
    if(!tr) return [];
    return Array.from(tr.querySelectorAll('input:not([type=hidden]), select, textarea')).filter(isVisible);
  }

  function getTableRows(table){
    if(!table) return [];
    return Array.from(table.querySelectorAll('tr'));
  }

  document.addEventListener('keydown', function(e){
    const t = e.target;
    if(!t.matches('input, textarea, select')) return;
    if(t.type==='hidden') return;
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter'].includes(e.key)) return;

    let table = t.closest('table');
    if(!table) return;

    // داخل النص: خلي السهم يتحرك جوه الحقل الأول
    if((e.key==='ArrowLeft' || e.key==='ArrowRight') && t.tagName==='INPUT' && t.type==='text' && t.selectionStart!==null){
      let s=t.selectionStart, en=t.selectionEnd, len=t.value.length;
      if(s!==en) return;
      if(e.key==='ArrowLeft' && s>0){ e.stopPropagation(); return; }
      if(e.key==='ArrowRight' && s<len){ e.stopPropagation(); return; }
      // وصل للطرف -> انقله
    }

    // هات الصف الحالي
    let tr = t.closest('tr');
    if(!tr) return;
    let rowInputs = getRowInputs(tr);
    // رتب الصف بصريا حسب X (من الشمال لليمين: x صغير -> كبير)
    rowInputs.sort((a,b)=> a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    // في شاشة LTR: left صغير = شمال، كبير = يمين
    // ArrowRight = يمين الشاشة = x أكبر
    // ArrowLeft = شمال الشاشة = x أصغر

    if(e.key==='ArrowRight' || e.key==='ArrowLeft'){
      let idx = rowInputs.indexOf(t);
      if(idx===-1){
        // ممكن الترتيب اختلف، دور على أقرب x
        let curX = t.getBoundingClientRect().left;
        let closest = rowInputs.reduce((best,el,i)=>{
          let d = Math.abs(el.getBoundingClientRect().left - curX);
          return d < best.d ? {d,i} : best;
        },{d:Infinity,i:-1});
        idx = closest.i;
      }
      e.preventDefault();
      e.stopPropagation();
      if(e.key==='ArrowRight'){
        // يمين الشاشة
        if(idx < rowInputs.length-1) focusIt(rowInputs[idx+1]);
      } else {
        // شمال الشاشة
        if(idx > 0) focusIt(rowInputs[idx-1]);
      }
      return;
    }

    if(e.key==='ArrowUp' || e.key==='ArrowDown' || e.key==='Enter'){
      let direction = e.key==='ArrowUp' ? -1 : 1;
      if(e.key==='Enter') direction = 1;

      let allRows = getTableRows(table);
      let curRowIdx = allRows.indexOf(tr);
      if(curRowIdx===-1) return;

      let curRect = t.getBoundingClientRect();
      let curX = curRect.left + curRect.width/2;

      // دور على الصف اللي فوق أو تحت
      let targetRowIdx = curRowIdx + direction;
      while(targetRowIdx >=0 && targetRowIdx < allRows.length){
        let targetTr = allRows[targetRowIdx];
        let inputs = getRowInputs(targetTr);
        if(inputs.length>0){
          // هات اللي نفس الـ X تقريبا
          inputs.sort((a,b)=> Math.abs(a.getBoundingClientRect().left + a.getBoundingClientRect().width/2 - curX) - Math.abs(b.getBoundingClientRect().left + b.getBoundingClientRect().width/2 - curX));
          // لو فيه نفس العمود (نفس الـ left تقريبا) خده، لو لا خد أقرب واحد
          focusIt(inputs[0]);
          break;
        }
        targetRowIdx += direction;
      }
      e.preventDefault();
      e.stopPropagation();
      return;
    }

  }, true);

  console.log('✅ fix-arrows v5 ready - Right=Right Left=Left Up=Up Down=Down');
})();
