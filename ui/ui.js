// ui/ui.js : simple helpers for toasts, modals, star widget, timers, and progress.

const root = () => document.getElementById('ui-root');

function toast(msg, opts={}) {
  const t = document.createElement('div'); t.className='toast'; t.textContent = msg;
  if (opts.danger) t.style.borderColor = '#ff8484';
  root().appendChild(t);
  setTimeout(()=> t.remove(), opts.ms || 2200);
}

function modal(render) {
  const wrap = document.createElement('div'); wrap.className='modal'; wrap.setAttribute('role','dialog');
  const box = document.createElement('div'); box.className='box';
  const close = ()=> wrap.remove();
  box.appendChild(render({close}) || document.createTextNode('Modal'));
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
