// games/sequence.js - tap-to-swap reorder to match correct order; partial credit allowed.
(function(){
  const id = 'sequence';
  const title = 'Sequence Order';

  function init(container, ctx, onComplete, helpers){
    const { activity, rng } = ctx;
    const correctOrder = activity.data?.items || [];
    const cfg = activity.randomize || {};
    const roundItems = rng.pickSubset(correctOrder, cfg.itemsPerRound || correctOrder.length);
    let arr = rng.shuffle(roundItems);
    const target = roundItems.slice(); // correct order for this round

    let selected = null;
    const seq = document.createElement('div'); seq.className='sequence';
    container.innerHTML = ''; container.appendChild(seq);

    function render(){
      seq.innerHTML='';
      arr.forEach((v,i)=>{
        const b = document.createElement('button'); b.className='seq-item'; b.textContent=v;
        b.addEventListener('click', ()=>{
          if (selected==null){ selected=i; b.classList.add('selected'); }
          else {
            const j = selected;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            selected=null; render();
          }
        }, {passive:true});
        seq.appendChild(b);
      });
      helpers.updateProgress(0);
    }
    render();

    const actions = document.createElement('div'); actions.className='actions';
    const check = document.createElement('button'); check.className='btn primary'; check.textContent='Check Order';
    const giveup = document.createElement('button'); giveup.className='btn ghost'; giveup.textContent='Submit';
    actions.append(check, giveup);
    container.appendChild(actions);

    function score(){
      let correct = 0;
      for (let i=0;i<arr.length;i++){ if (arr[i]===target[i]) correct++; }
      const pct = Math.round((correct/arr.length)*100);
      onComplete({scorePercent:pct, details:{ items:[{type:'sequence', finalOrder:arr.slice()}] }});
    }
    check.onclick = score;
    giveup.onclick = score;
  }

  function destroy(){}

  if (window.TMSE) window.TMSE.registerGame({ id, title, init, destroy });
})();
