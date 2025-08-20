// games/trivia.js - multiple choice trivia (instant feedback optional, review provided)
(function(){
  const id = 'trivia';
  const title = 'Trivia (Multiple Choice)';

  function init(container, ctx, onComplete, helpers){
    const { activity, rng } = ctx;
    const cfg = activity.randomize || {};
    const pool = activity.data?.questions || [];
    const items = rng.pickSubset(pool, cfg.itemsPerRound || pool.length);
    const shuffled = cfg.shuffleItems !== false ? rng.shuffle(items) : items.slice();

    let idx = 0, correct = 0;
    const details = { items:[] };

    container.innerHTML = '';
    const qWrap = document.createElement('div'); qWrap.style.display='grid'; qWrap.style.gap='12px';
    container.appendChild(qWrap);

    function render() {
      const q = shuffled[idx];
      qWrap.innerHTML = '';
      const h = document.createElement('div'); h.className='q'; h.textContent = q.prompt;
      const grid = document.createElement('div'); grid.className='choice-grid';
      (q.choices||[]).forEach((choice, i)=>{
        const btn = document.createElement('button'); btn.className='choice'; btn.textContent = choice;
        btn.onclick = ()=>{
          const isCorrect = i === q.answerIndex;
          if (isCorrect) { correct++; btn.classList.add('correct'); } else { btn.classList.add('wrong'); }
          details.items.push({ prompt:q.prompt, your: choice, correct: q.choices[q.answerIndex], explanation: q.explanation || '' });
          setTimeout(next, 250);
        };
        grid.appendChild(btn);
      });
      qWrap.append(h, grid);
      helpers.updateProgress(((idx)/shuffled.length)*100);
    }
    function next(){
      idx++;
      if (idx>=shuffled.length){
        helpers.updateProgress(100);
        const pct = Math.round((correct/shuffled.length)*100);
        onComplete({ scorePercent:pct, details });
        return;
      }
      render();
    }
    render();
  }

  function destroy(){}

  if (window.TMSE) window.TMSE.registerGame({ id, title, init, destroy });
})();
