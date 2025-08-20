// tmse.js (module): Core engine, router, discovery, saves, RNG, star calc, flows.
// Provides TMSE namespace on window and as a module export.

import { UI } from './ui/ui.js';

const CONFIG = (typeof window !== 'undefined' && window.TMSE_CONFIG) ? window.TMSE_CONFIG : {};
const LOG = (...a)=> CONFIG.devLog && console.log('[TMSE]', ...a);

const version = 1;

// ---- RNG (seeded per session for reproducible shuffles) ---------------------
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function getSessionSeed() {
  const key = 'TMSE_SESSION_SEED';
  let s = sessionStorage.getItem(key);
  if (!s) {
    s = String(Math.floor(Math.random() * 1e9));
    sessionStorage.setItem(key, s);
  }
  return Number(s);
}
const rng = CONFIG.seededRandom ? mulberry32(getSessionSeed()) : Math.random;

// ---- Storage ----------------------------------------------------------------
const SAVE_KEY = 'TMSE_SAVES_V1';
function loadSaves() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); }
  catch { return {}; }
}
function saveSaves(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
function getBest(lessonId, activityTitle) {
  const s = loadSaves();
  return (s[lessonId] && s[lessonId].activities && s[lessonId].activities[activityTitle]) || {score:0, stars:0};
}
function setBest(lessonId, activityTitle, score, stars) {
  const s = loadSaves();
  s[lessonId] = s[lessonId] || { activities:{}, lesson:{score:0, stars:0}};
  const prev = s[lessonId].activities[activityTitle] || {score:0, stars:0};
  if (score > prev.score || stars > prev.stars) {
    s[lessonId].activities[activityTitle] = {score, stars, at: Date.now()};
  }
  saveSaves(s);
}
function setBestLesson(lessonId, score, stars) {
  const s = loadSaves();
  s[lessonId] = s[lessonId] || { activities:{}, lesson:{score:0, stars:0}};
  const prev = s[lessonId].lesson || {score:0, stars:0};
  if (score > prev.score || stars > prev.stars) {
    s[lessonId].lesson = {score, stars, at: Date.now()};
  }
  saveSaves(s);
}

// ---- Helpers ----------------------------------------------------------------
function clampTimer(seconds) {
  if (CONFIG.allowLongerTimers) return seconds;
  return Math.min(seconds, CONFIG.maxActivitySeconds || 120);
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i=a.length-1; i>0; i--) {
    const j = Math.floor(rng() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickSubset(pool, n) {
  if (!n || n >= pool.length) return shuffle(pool);
  return shuffle(pool).slice(0, n);
}
function percentToStars(pct, thresholds) {
  const [s1, s2, s3] = thresholds || CONFIG.defaultStarThresholds || [50,75,90];
  let stars = 0;
  if (pct >= s1) stars = 1;
  if (pct >= s2) stars = 2;
  if (pct >= s3) stars = 3;
  return stars;
}

// ---- Lesson & Game registries ----------------------------------------------
const state = {
  lessons: new Map(),     // id -> lessonObj
  games: new Map(),       // id -> {id,title,init,destroy}
  screens: {},            // DOM refs
  current: { lesson:null, activityIndex:0, playingAll:false, timerCtl:null },
};

function registerLesson(lessonObj) {
  try {
    if (!lessonObj || !lessonObj.id || !lessonObj.name || !Array.isArray(lessonObj.activities)) {
      throw new Error('Invalid lesson schema: require id, name, activities[]');
    }
    state.lessons.set(lessonObj.id, lessonObj);
    LOG('Lesson registered:', lessonObj.id);
    UI.toast(`Loaded lesson: ${lessonObj.name}`);
    refreshLessonSelect();
  } catch (e) {
    console.warn('[TMSE] registerLesson error', e);
    UI.toast('Failed to register lesson (see console)', { danger:true });
  }
}

function registerGame(game) {
  if (!game || !game.id || typeof game.init !== 'function') {
    console.warn('[TMSE] Bad game registration', game);
    return;
  }
  state.games.set(game.id, game);
  LOG('Game registered:', game.id);
}

// ---- Discovery & loading ----------------------------------------------------
async function scanManifest() {
  const allowed = new RegExp(CONFIG.allowedLessonPattern);
  const url = `${CONFIG.contentPath}manifest.json`;
  try {
    const res = await fetch(url, {cache:'no-store'});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error('Manifest must be an array of filenames');
    let loaded = 0;
    await Promise.all(list.map(fn=>{
      if (!allowed.test(fn)) {
        console.warn('[TMSE] File ignored by pattern:', fn);
        return;
      }
      return loadLessonScript(`${CONFIG.contentPath}${fn}`).then(()=>loaded++);
    }));
    UI.toast(`Manifest scan complete: ${loaded} lesson(s)`);
  } catch (e) {
    console.warn('[TMSE] Manifest scan failed', e);
    UI.toast('Could not fetch manifest.json (see console)', { danger:true });
  }
}

function loadLessonScript(src) {
  return new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    s.type = 'module';
    s.src = src;
    s.onload = ()=> resolve();
    s.onerror = ()=> reject(new Error('Script load failed: '+src));
    document.head.appendChild(s);
  });
}

function loadLessonFromFile(file) {
  const allowed = new RegExp(CONFIG.allowedLessonPattern);
  if (!CONFIG.allowAnyUrl && !allowed.test(file.name)) {
    UI.toast('Filename rejected by pattern. Update tmse.config.js to allow.', {danger:true});
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const blob = new Blob([reader.result], {type:'text/javascript'});
    const url = URL.createObjectURL(blob);
    loadLessonScript(url).then(()=>{
      UI.toast('Lesson loaded from file.');
    }).catch(e=>{
      console.warn(e);
      UI.toast('Failed to execute lesson file (see console).', {danger:true});
    });
  };
  reader.readAsText(file);
}

function loadLessonFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    const fname = u.pathname.split('/').pop();
    const allowed = new RegExp(CONFIG.allowedLessonPattern);
    if (!CONFIG.allowAnyUrl && !allowed.test(fname)) {
      UI.toast('Remote URL rejected by filename pattern.', {danger:true});
      return;
    }
    loadLessonScript(urlStr).then(()=>{
      UI.toast('Lesson loaded from URL.');
    }).catch(e=>{
      console.warn(e);
      UI.toast('Remote load failed (CORS or bad URL).', {danger:true});
    });
  } catch {
    UI.toast('Invalid URL.', {danger:true});
  }
}

// ---- Router -----------------------------------------------------------------
const Screens = {
  to(name) {
    document.querySelectorAll('[data-screen]').forEach(s=>s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) el.classList.add('active');
  }
};

// ---- Lesson Select rendering ------------------------------------------------
function starRow(stars) {
  const row = document.createElement('div'); row.className = 'stars';
  for (let i=0;i<3;i++){
    const s = document.createElement('div');
    s.className = 'star'+(i<stars?' filled':'');
    s.setAttribute('aria-hidden','true'); s.textContent = i<stars?'★':'☆';
    row.appendChild(s);
  }
  return row;
}
function refreshFilters() {
  const subjects = new Set(), courses=new Set(), authors=new Set();
  state.lessons.forEach(l=>{ subjects.add(l.subject||''); courses.add(l.course||''); authors.add(l.author||''); });
  function fill(sel, set){
    const el = document.getElementById(sel);
    const cur = el.value;
    el.innerHTML = `<option value=\"\">All ${sel.split('-')[1]||'Items'}</option>` + [...set].filter(Boolean).sort().map(v=>`<option>${v}</option>`).join('');
    if ([...el.options].some(o=>o.value===cur)) el.value = cur;
  }
  fill('filter-subject', subjects);
  fill('filter-course', courses);
  fill('filter-author', authors);
}
function refreshLessonSelect() {
  refreshFilters();
  const grid = document.getElementById('lesson-grid');
  const q = (document.getElementById('search')?.value||'').toLowerCase();
  const fs = document.getElementById('filter-subject')?.value||'';
  const fc = document.getElementById('filter-course')?.value||'';
  const fa = document.getElementById('filter-author')?.value||'';
  const sort = document.getElementById('sort-alpha')?.value||'az';

  let list = [...state.lessons.values()];
  list = list.filter(l=> (!q || (l.name+l.course+l.author).toLowerCase().includes(q))
    && (!fs || (l.subject===fs))
    && (!fc || (l.course===fc))
    && (!fa || (l.author===fa)));
  list.sort((a,b)=> sort==='az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  grid.innerHTML = '';
  list.forEach(lesson=>{
    const card = document.createElement('article');
    card.className = 'card'; card.role='listitem';

    const icon = document.createElement('div'); icon.className='icon';
    if (lesson.icon && lesson.icon.type==='png' && lesson.icon.src) {
      const img = document.createElement('img'); img.src = lesson.icon.src; img.alt = `${lesson.name} icon`;
      img.onerror = ()=>{ icon.innerHTML = `<div class=\"icon-fallback\">${(lesson.subject||'?').slice(0,2).toUpperCase()}</div>`; };
      icon.appendChild(img);
    } else {
      icon.innerHTML = `<div class=\"icon-fallback\">${(lesson.subject||'?').slice(0,2).toUpperCase()}</div>`;
    }

    const meta = document.createElement('div'); meta.className='meta';
    const h = document.createElement('h3'); h.className='title'; h.textContent = lesson.name;
    const sub = document.createElement('div'); sub.className = 'sub';
    sub.textContent = `${lesson.course || '—'} • ${lesson.author || '—'} • ${lesson.subject || '—'}`;

    const badges = document.createElement('div'); badges.className = 'badges';
    const best = loadSaves()[lesson.id]?.lesson || {score:0, stars:0};
    const b1 = document.createElement('span'); b1.className='badge'; b1.textContent = `Best: ${best.score||0}%`;
    const b2 = document.createElement('span'); b2.className='badge'; b2.appendChild(starRow(best.stars));
    badges.append(b1,b2);

    meta.append(h, sub, badges);

    const go = document.createElement('button'); go.className='btn small'; go.textContent='View';
    go.addEventListener('click', ()=> openLessonDetail(lesson.id));

    card.append(icon, meta, go);
    grid.appendChild(card);
  });
}

// ---- Lesson Detail ----------------------------------------------------------
function openLessonDetail(lessonId) {
  const lesson = state.lessons.get(lessonId);
  if (!lesson) return;
  state.current.lesson = lesson;

  const root = document.getElementById('lesson-detail');
  root.innerHTML = '';
  const header = document.createElement('div'); header.className='detail-header';
  const icon = document.createElement('div'); icon.className='icon'; icon.style.width='96px'; icon.style.height='96px';
  if (lesson.icon?.type==='png') {
    const img = document.createElement('img'); img.src=lesson.icon.src; img.alt=`${lesson.name} icon`;
    img.onerror=()=>{icon.innerHTML='<div class="icon-fallback">IC</div>'};
    icon.appendChild(img);
  } else icon.innerHTML='<div class="icon-fallback">IC</div>';

  const titleWrap = document.createElement('div');
  titleWrap.innerHTML = `<h2 style=\"margin:0\">${lesson.name}</h2>
  <div class=\"sub\">${lesson.course || '—'} • ${lesson.author || '—'} • ${lesson.subject || '—'}</div>`;

  const headerBtns = document.createElement('div'); headerBtns.style.marginLeft='auto';
  const playAll = document.createElement('button'); playAll.className='btn primary'; playAll.textContent='Play All Activities';
  playAll.onclick = ()=> startLesson(true);
  const est = estimateLessonSeconds(lesson);
  const estTip = document.createElement('div'); estTip.className='sub'; estTip.textContent = `~${Math.ceil(est/60)} min`;

  headerBtns.append(playAll, estTip);
  header.append(icon, titleWrap, headerBtns);

  const body = document.createElement('div'); body.className='detail-body';
  const list = document.createElement('div'); list.className='activity-list';

  (lesson.activities || []).forEach((a, idx)=>{
    const item = document.createElement('div'); item.className='activity-item';
    const info = document.createElement('div'); info.className='info';
    const name = document.createElement('div'); name.className='name'; name.textContent = `${a.title} (${a.type})`;
    const hint = document.createElement('div'); hint.className='hint';
    const sec = clampTimer(a.timeLimitSec || 60);
    hint.textContent = `~${Math.ceil(sec/60)} min • Items randomized`;
    info.append(name, hint);

    const right = document.createElement('div'); right.style.display='grid'; right.style.gap='6px'; right.style.justifyItems='end';
    const highs = getBest(lesson.id, a.title);
    const starwrap = starRow(highs.stars);
    const scoreTxt = document.createElement('div'); scoreTxt.className='sub'; scoreTxt.textContent = `${highs.score||0}% best`;

    const playBtn = document.createElement('button'); playBtn.className='btn small'; playBtn.textContent='Play';
    playBtn.onclick = ()=> startActivity(idx);

    right.append(starwrap, scoreTxt, playBtn);

    item.append(info, right);
    list.appendChild(item);
  });

  body.appendChild(list);
  root.append(header, body);
  Screens.to('lesson-detail');
}

function estimateLessonSeconds(lesson) {
  return (lesson.activities || []).reduce((sum,a)=> sum + clampTimer(a.timeLimitSec || 60), 0);
}

// ---- Gameplay flow ----------------------------------------------------------
function startLesson(playAll=false) {
  state.current.activityIndex = 0;
  state.current.playingAll = playAll;
  if (!state.current.lesson) return;
  startActivity(0);
}
function startActivity(index) {
  const lesson = state.current.lesson;
  if (!lesson) return;
  const activity = lesson.activities[index];
  if (!activity) return;
  state.current.activityIndex = index;

  // HUD
  document.getElementById('hud-title').textContent = activity.title || activity.type;
  document.getElementById('hud-subtitle').textContent = `${lesson.name} • ${activity.type}`;
  const progressEl = document.getElementById('hud-progress');
  progressEl.innerHTML = '<div class="bar" style="width:0%"></div>';

  // Timer
  const seconds = clampTimer(activity.timeLimitSec || 60);
  const timerEl = document.getElementById('hud-timer');
  const timerCtl = UI.timer(seconds, (tLeft, pct)=>{
    timerEl.textContent = fmtTime(tLeft);
  }, ()=>{
    UI.toast('Time up!');
    // let game consume end naturally; most games finish by click; force?
  });
  state.current.timerCtl = timerCtl;

  // Pause/Resume wiring
  const overlay = document.getElementById('pause-overlay');
  document.getElementById('btn-pause').onclick = ()=> { overlay.classList.remove('hidden'); overlay.setAttribute('aria-hidden','false'); timerCtl.pause(); };
  document.getElementById('btn-resume').onclick = ()=> { overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true'); timerCtl.resume(); };
  document.getElementById('btn-quit').onclick = ()=> {
    timerCtl.stop(); overlay.classList.add('hidden');
    Screens.to('lesson-detail');
  };

  // Start game
  const container = document.getElementById('game-area');
  container.innerHTML = '';
  Screens.to('game');

  const game = state.games.get(activity.type);
  if (!game) {
    container.textContent = `Game type "${activity.type}" is not registered.`;
    return;
  }

  const thresholds = activity.starThresholds || CONFIG.defaultStarThresholds;
  const rngApi = { random: rng, shuffle, pickSubset };
  const onComplete = ({scorePercent, details})=>{
    timerCtl.stop();
    // Highs
    const stars = percentToStars(scorePercent, thresholds);
    setBest(lesson.id, activity.title, Math.round(scorePercent), stars);

    // If playing all, go to next or aggregate
    if (state.current.playingAll) {
      showResults(lesson, activity, scorePercent, stars, details, { next: true });
    } else {
      showResults(lesson, activity, scorePercent, stars, details);
    }
  };

  try {
    game.init(container, {lesson, activity, config:CONFIG, rng: rngApi}, onComplete, {
      updateProgress: (pct)=> {
        const bar = progressEl.querySelector('.bar'); if (bar) bar.style.width = `${Math.max(0,Math.min(100,pct))}%`;
      },
      getTimeLeft: ()=> timerCtl.remaining()
    });
  } catch(e) {
    console.warn('[TMSE] Game init failed', e);
    UI.toast('Game failed to start (see console).', {danger:true});
  }
}
function fmtTime(sec){
  const m = Math.floor(sec/60); const s = Math.max(0, sec%60);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function showResults(lesson, activity, scorePercent, stars, details, opts={}) {
  const title = document.getElementById('results-title');
  title.textContent = `${activity.title} — Results`;
  const starHold = document.getElementById('results-stars'); starHold.innerHTML='';
  starHold.appendChild(starRow(stars));
  document.getElementById('results-score').textContent = Math.round(scorePercent);

  // summary
  const sum = document.getElementById('results-summary');
  sum.innerHTML = `<div class=\"sub\">Best: ${getBest(lesson.id, activity.title).score}% • Thresholds: ${(activity.starThresholds||CONFIG.defaultStarThresholds).join('% / ')}%</div>`;

  // review
  const review = document.getElementById('results-review');
  review.innerHTML = '';
  (details?.items||[]).forEach((it, i)=>{
    const row = document.createElement('div'); row.className='review-item';
    // Different games may provide different item structures
    if (it.prompt) {
      const q = document.createElement('div'); q.className='q'; q.textContent = it.prompt;
      const a = document.createElement('div'); a.textContent = `Your answer: ${it.your != null ? it.your : '—'}`;
      const c = document.createElement('div'); c.textContent = `Correct: ${it.correct}`;
      row.append(q,a,c);
      if (it.explanation){ const ex = document.createElement('div'); ex.className='ex'; ex.textContent = it.explanation; row.append(ex); }
    } else if (it.type==='match') {
      row.innerHTML = `<div class=\"q\">Match: ${it.left} → ${it.right}</div><div>${it.correct? '✓ Correct' : '✗ Wrong'}</div>`;
    } else if (it.type==='sequence') {
      row.innerHTML = `<div class=\"q\">Sequence</div><div class=\"ex\">Final order: ${it.finalOrder?.join(' › ')}</div>`;
    } else if (it.type==='memory') {
      row.innerHTML = `<div class=\"q\">Memory</div><div class=\"ex\">Pairs matched: ${it.matched}/${it.totalPairs}</div>`;
    } else if (it.type==='flashcard') {
      row.innerHTML = `<div class=\"q\">Flashcards</div><div class=\"ex\">Got it: ${it.got}/${it.total}</div>`;
    }
    review.append(row);
  });

  // buttons
  const replay = document.getElementById('btn-replay');
  const back = document.getElementById('btn-back-lesson');
  replay.onclick = ()=> startActivity(state.current.activityIndex);
  back.onclick = ()=> Screens.to('lesson-detail');

  Screens.to('results');

  if (opts.next) {
    // Seamless continue button overlay on results
    const idx = state.current.activityIndex;
    if (idx < (lesson.activities.length-1)) {
      const btn = document.createElement('button'); btn.className='btn primary'; btn.textContent='Next Activity ▶';
      btn.onclick = ()=> startActivity(idx+1);
      document.querySelector('#screen-results .actions').prepend(btn);
    } else {
      // Aggregate lesson score
      const activitySaves = loadSaves()[lesson.id]?.activities || {};
      const lessonScores = (lesson.activities||[]).map(a=> activitySaves[a.title]?.score || 0);
      let agg = 0;
      if ((lesson.scoring?.aggregate||'average') === 'sum') {
        agg = lessonScores.reduce((s,v)=>s+v,0) / (lesson.activities.length || 1);
      } else {
        agg = lessonScores.reduce((s,v)=>s+v,0) / (lesson.activities.length || 1);
      }
      const lessonStars = percentToStars(agg, CONFIG.defaultStarThresholds);
      setBestLesson(lesson.id, Math.round(agg), lessonStars);
      const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Finish Lesson';
      btn.onclick = ()=> openLessonDetail(lesson.id);
      document.querySelector('#screen-results .actions').prepend(btn);
    }
  }
}

// ---- Settings ---------------------------------------------------------------
function renderSettings() {
  const panel = document.getElementById('settings-panel');
  panel.innerHTML = '';
  const makeToggle = (key,label)=> {
    const row = document.createElement('div'); row.className='activity-item';
    const info = document.createElement('div'); info.className='info'; info.innerHTML = `<div class=\"name\">${label}</div><div class=\"hint\">${key}</div>`;
    const btn = document.createElement('button'); btn.className='btn small'; btn.textContent = String(CONFIG[key]);
    btn.onclick = ()=> {
      CONFIG[key] = !CONFIG[key];
      btn.textContent = String(CONFIG[key]);
      UI.toast(`${label}: ${CONFIG[key]}`);
    };
    row.append(info, btn);
    return row;
  };
  panel.append(
    makeToggle('seededRandom', 'Seeded Random'),
    makeToggle('useManifest', 'Use Manifest on Scan'),
    makeToggle('allowLongerTimers', 'Allow Longer Timers'),
    makeToggle('allowAnyUrl', 'Allow Any URL for Load')
  );
}

// ---- Wire up global navigation & actions -----------------------------------
function initDom() {
  state.screens.start = document.getElementById('screen-start');
  document.querySelectorAll('.nav-btn').forEach(b=>{
    b.addEventListener('click', ()=> Screens.to(b.dataset.nav));
  });
  document.getElementById('btn-scan')?.addEventListener('click', ()=> CONFIG.useManifest ? scanManifest() : UI.toast('Manifest disabled.'));
  document.getElementById('btn-scan-2')?.addEventListener('click', ()=> CONFIG.useManifest ? scanManifest() : UI.toast('Manifest disabled.'));
  document.getElementById('btn-load')?.addEventListener('click', ()=> openLoadModal());
  document.getElementById('btn-load-2')?.addEventListener('click', ()=> openLoadModal());
  document.getElementById('btn-clear-saves')?.addEventListener('click', ()=>{
    localStorage.removeItem(SAVE_KEY); UI.toast('All saves cleared.');
    refreshLessonSelect(); if (state.current.lesson) openLessonDetail(state.current.lesson.id);
  });
  // Filters live update
  ['search','filter-subject','filter-course','filter-author','sort-alpha'].forEach(id=>{
    document.getElementById(id)?.addEventListener('input', refreshLessonSelect);
  });
  renderSettings();
}

function openLoadModal() {
  UI.modal(({close})=>{
    const box = document.createElement('div');
    box.innerHTML = `
      <h3>Load Lesson</h3>
      <div class=\"row\">
        <label class=\"btn\">
          <input id=\"file-in\" type=\"file\" accept=\".js\" hidden>
          Choose .js file
        </label>
        <div class=\"sub\">Filenames should match pattern in config.</div>
      </div>
      <div class=\"row\">
        <input id=\"url-in\" class=\"input\" type=\"url\" placeholder=\"https://example.com/TMSE-something-001.js\" style=\"flex:1\">
        <button id=\"btn-load-url\" class=\"btn\">Load URL</button>
      </div>
      <div class=\"row\">
        <button class=\"btn ghost\" id=\"btn-close\">Close</button>
      </div>
    `;
    // hook
    box.querySelector('#file-in').addEventListener('change', (e)=>{
      const f = e.target.files?.[0]; if (f) loadLessonFromFile(f);
    });
    box.querySelector('#btn-load-url').addEventListener('click', ()=>{
      const u = box.querySelector('#url-in').value.trim(); if (u) loadLessonFromUrl(u);
    });
    box.querySelector('#btn-close').addEventListener('click', close);
    return box;
  });
}

// ---- Public API -------------------------------------------------------------
const TMSE = {
  version,
  config: CONFIG,
  rng: { random:rng, shuffle, pickSubset },
  registerLesson,
  registerGame,
  navigate: { to: (screen, payload)=> Screens.to(screen) },
};

if (typeof window !== 'undefined') window.TMSE = TMSE;
export default TMSE;

// ---- Boot -------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', ()=>{
  initDom();
  // Optional: auto-scan manifest on first load
  if (CONFIG.useManifest) scanManifest();
});
