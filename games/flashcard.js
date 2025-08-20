// games/flashcard.js - flip card; buttons: Got it / Not yet; score = % got it
(function(){
  const id = 'flashcard';
  const title = 'Flashcards';

  function init(container, ctx, onComplete, helpers){
    const { activity, rng } = ctx;
    const pool = activity.data?.cards || [];
    const cfg = activity.randomize || {};
    const items = rng.pickSubset(pool, cfg.itemsPerRound || pool.length);

    let i=0, got=0;
    const details = { items:[] };

    const wrap = document.createElement('div'); wrap.className='flash-wrap';
    const card = document.createElement('div'); card.className='flash-card'; card.textContent = items[i].front;
    let flipped=false;
    card.addEventListener('click', ()=>{
      flipped=!flipped; card.textContent = flipped ? items[i].back : items[i].front;
    }, {passive:true});

    const row = document.createElement('div'); row.className='actions';
    const b1 = document.createElement('button'); b1.className='btn primary'; b1.textContent='Got it';
    const b2 = document.createElement('button'); b2.className='btn ghost'; b2.textContent='Not yet';
    row.append(b1,b2);

    function next(){
      i++;
      flipped=false;
      if (i>=items.length){
        const pct = Math.round((got/items.length)*100);
        details.items.push({ type:'flashcard', got, total: items.length });
        onComplete({scorePercent:pct, details});
        return;
      }
      card.textContent = items[i].front;
      helpers.updateProgress((i/items.length)*100);
    }
    b1.onclick = ()=>{ got++; next(); };
    b2.onclick = ()=>{ next(); };

    wrap.append(card, row);
    container.innerHTML=''; container.appendChild(wrap);
  }

  function destroy(){}

  if (window.TMSE) window.TMSE.registerGame({ id, title, init, destroy });
})();
