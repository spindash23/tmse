// games/memory.js - classic flip-two memory; supports text and images via pairId.
(function(){
  const id = 'memory';
  const title = 'Memory Pairs';

  function cardFace(data){
    const el = document.createElement('div'); el.className='face front';
    if (data.img){ const im = document.createElement('img'); im.src = data.img; im.alt = data.alt||''; im.style.maxWidth='80%'; el.appendChild(im); }
    else el.textContent = data.label || '';
    return el;
  }

  function init(container, ctx, onComplete, helpers){
    const { activity, rng } = ctx;
    const pool = activity.data?.cards || [];
    const cfg = activity.randomize || {};
    // pick pairIds subset
    const pairsById = {};
    for (const c of pool) { pairsById[c.pairId] = pairsById[c.pairId] || []; pairsById[c.pairId].push(c); }
    const pairIds = Object.keys(pairsById);
    const chosenPairs = rng.pickSubset(pairIds, cfg.itemsPerRound ? Math.min(cfg.itemsPerRound, pairIds.length) : pairIds.length);
    let cards = chosenPairs.flatMap(id=> pairsById[id]);
    cards = rng.shuffle(cards);

    const grid = document.createElement('div'); grid.className='memory-grid';
    container.innerHTML = ''; container.appendChild(grid);

    let flipped = []; let matched = new Set(); const details = { items:[] };

    cards.forEach((c, index)=>{
      const cell = document.createElement('div'); cell.className='card-mem'; cell.dataset.pid = c.pairId;
      const front = cardFace(c);
      const back = document.createElement('div'); back.className='face back'; back.textContent='🧠';
      cell.append(front, back); grid.appendChild(cell);
      cell.addEventListener('click', ()=>{
        if (cell.classList.contains('flip') || matched.has(c.pairId)) return;
        cell.classList.add('flip');
        flipped.push({el:cell, data:c});
        if (flipped.length===2) {
          const [a,b] = flipped;
          setTimeout(()=>{
            if (a.data.pairId === b.data.pairId) {
              matched.add(a.data.pairId);
              a.el.style.filter='saturate(1.4)'; b.el.style.filter='saturate(1.4)';
              if (matched.size === chosenPairs.length) end();
            } else {
              a.el.classList.remove('flip'); b.el.classList.remove('flip');
            }
            flipped = [];
            helpers.updateProgress((matched.size/ chosenPairs.length)*100);
          }, 350);
        }
      }, {passive:true});
    });

    function end(){
      const pct = Math.round((matched.size / chosenPairs.length)*100);
      details.items.push({ type:'memory', matched: matched.size, totalPairs: chosenPairs.length });
      onComplete({ scorePercent:pct, details });
    }
  }

  function destroy(){}

  if (window.TMSE) window.TMSE.registerGame({ id, title, init, destroy });
})();
