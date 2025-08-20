// ui/ui.js : helpers for toasts, modals, timer. PATCH: guaranteed-dismiss modal (X/ESC/outside),
// ARIA alerts for errors.

const root = () => document.getElementById('ui-root');

function toast(msg, opts={}) {
  const t = document.createElement('div'); t.className='toast'; t.textContent = msg;
  if (opts.danger) { t.style.borderColor = '#ff8484'; t.setAttribute('role','alert'); }
  root().appendChild(t);
  setTimeout(()=> t.remove(), opts.ms || 2200);
}

function modal(render) {
  const wrap = document.createElement('div'); wrap.className='modal'; wrap.setAttribute('role','dialog');
  const box = document.createElement('div'); box.className='box';
  // We wrap user content and inject a close handler + ESC / outside
  const lastFocused = document.activeElement;
  const close = ()=> {
    wrap.remove();
    if (lastFocused && typeof lastFocused.focus === 'function') { try { lastFocused.focus(); } catch {} }
  };

  // Click-outside to close
  wrap.addEventListener('click', (e)=>{
    if (e.target === wrap) close();
  }, {passive:true});

  // ESC to close
  const onEsc = (e)=> {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
  };
  document.addEventListener('keydown', onEsc);

  const ui = render({close, boxEl: box}) || document.createTextNode('Modal');
  box.appendChild(ui);
  wrap.appendChild(box);
  root().appendChild(wrap);
  return { close };
}

// Countdown timer utility
function timer(totalSec, onTick, onDone) {
  let remaining = Math.max(0, Math.floor(totalSec));
  let running = true;
  const tick = ()=>{
    if (!running) return;
    onTick?.(remaining, (1 - remaining/totalSec) * 100);
    if (remaining <= 0) { running=false; onDone?.(); return; }
    remaining -= 1;
    id = setTimeout(tick, 1000);
  };
  let id = setTimeout(tick, 1);
  return {
    pause(){ running=false; clearTimeout(id); },
    resume(){ if (!running){ running=true; tick(); } },
    stop(){ running=false; clearTimeout(id); },
    remaining(){ return remaining; }
  };
}

export const UI = { toast, modal, timer };
export default { UI };
