// games/match.js - tap-to-match pairs (text↔text / text↔image / image↔image)
(function(){
  const id = 'match';
  const title = 'Match Pairs';

  function renderToken(data){
    const el = document.createElement('div'); el.className='token'; el.tabIndex=0;
    if (data.img){ const im = document.createElement('img'); im.src = data.img; im.alt = data.alt || ''; im.style.maxWidth='100%'; im.style.maxHeight='60px'; el.appendChild(im); }
    else { el.textContent = data.left || data.right || data.label || String(data); }
    return el;
  }

  function init(container, ctx, onComplete, helpers){
    const { activity, rng } = ctx;
    const pool = activity.data?.pairs || [];
    const cfg = activity.randomize || {};
    const items = rng.pickSubset(pool, cfg.itemsPerRound || pool.length);

    // Build columns
    const wrap = document.createElement('div'); wrap.className='pair-grid';
    const leftCol = document.createElement('div'); leftCol.className='col';
    const rightCol = document.createElement('div'); rightCol.className='col';
    wrap.append(leftCol, rightCol);
    container.innerHTML = ''; container.appendChild(wrap);

    const left = rng.shuffle(items.map(p=> ({key:p.left, pair:p})));
    const rights = rng.shuffle(items.map(p=> ({key:(p.right.img||p.right)||'', pair:p})));

    let selL = null; let solved = new Set();
    let attempts = 0; const details = { items:[] };

    left.forEach(L=>{
      const t = renderToken({left:L.pair.left}); t.dataset.key = L.key; leftCol.appendChild(t);
      t.addEventListener('click', ()=>{
        leftCol.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));
        t.classList.add('selected'); selL = L;
      }, {passive:true});
    });

    rights.forEach(R=>{
      const t = document.createElement('div'); t.className='target'; t.dataset.key = (R.pair.right.img||R.pair.right)||'';
      if (R.pair.right?.img){
        const im = document.createElement('img'); im.src = R.pair.right.img; im.alt = R.pair.right.alt||''; im.style.maxWidth='100%'; im.style.maxHeight='60px';
        t.appendChild(im);
      } else {
        t.textContent = R.pair.right || '';
      }
      rightCol.appendChild(t);

      t.addEventListener('click', ()=>{
        attempts++;
        if (!selL) return;
        const ok = selL.pair.right?.img ? (t.dataset.key === selL.pair.right.img) : (t.textContent === (selL.pair.right||''));
        details.items.push({ type:'match', left: selL.pair.left, right: (R.pair.right?.img? (R.pair.right.alt||'image') : R.pair.right), correct: ok });
        if (ok) {
          solved.add(selL.pair.left);
          t.style.borderColor = '#34e3a5'; t.style.background = '#0e2f2a';
          const lnode = [...leftCol.children].find(n=>n.dataset.key===selL.pair.left); if (lnode){ lnode.style.borderColor='#34e3a5'; lnode.style.background='#0e2f2a'; }
          selL=null;
          if (solved.size===items.length) finish();
        } else {
          t.style.borderColor = '#ff8484';
          setTimeout(()=>{ t.style.borderColor = 'rgba(255,255,255,.08)'; }, 300);
        }
        helpers.updateProgress((solved.size/items.length)*100);
      }, {passive:true});
    });

    function finish(){
      const pct = Math.round((solved.size/items.length)*100);
      onComplete({scorePercent:pct, details});
    }
  }

  function destroy(){}

  if (window.TMSE) window.TMSE.registerGame({ id, title, init, destroy });
})();
