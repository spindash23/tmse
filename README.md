# README.md

# Teach Me Stuff Engine (TMSE)

https://spindash23.github.io/tmse/

TMSE is a lightweight, colorful learning engine built with plain HTML/CSS/JS
(no frameworks). It ships with five minigames (trivia, match, sequence,
memory, flashcard), a modular lesson format, persistent stars/high scores, and
seeded randomness for reproducible rounds. Works on any static host (e.g.,
GitHub Pages).

---

## Quick Start (≤ 5 minutes)

1. **Clone or download** this repo.  
2. **Serve locally** (pick one):

   ```bash
   # macOS/Linux (Python 3)
   python3 -m http.server 8080

   # Windows (PowerShell)
   py -m http.server 8080

   # Node users (no install needed if you have Node 18+)
   npx http-server -p 8080

    Open http://localhost:8080.

    Click Scan Lessons to load /content/manifest.json, or use Load
    Lesson to pick a .js file/URL.

8) Configuration (tmse.config.js)

TMSE reads dev flags from window.TMSE_CONFIG. Defaults are safe for
static hosting and no-build setups.
Flag	Type	Default	Notes
contentPath	string	"content/"	Where lesson JS and manifest.json live.
iconsPath	string	"icons/"	Optional PNG icons (recommended 400×400).
allowedLessonPattern	string (regex)	^TMSE-[a-z0-9-]+-\d{3}\.js$	Filename pattern for lessons.
useManifest	boolean	true	If true, Scan Lessons fetches content/manifest.json.
maxActivitySeconds	number	120	Time cap per activity (unless allowLongerTimers).
allowLongerTimers	boolean	false	Allow activities to exceed the cap.
defaultStarThresholds	number[3]	[50, 75, 90]	% thresholds for 1/2/3 stars.
seededRandom	boolean	true	Stable shuffles per session.
importTimeoutMs	number	5000	Max time to wait when importing a lesson script.

    Tip: Turn on devLog for verbose [TMSE] console logs.

9) Lesson Format (Authoring Guide)

Filename pattern: TMSE-<slug>-NNN.js
Regex: ^TMSE-[a-z0-9-]+-\d{3}\.js$

Place your lesson file in /content/, and (optionally) list it in
/content/manifest.json.

Minimal, valid example (drop into /content/TMSE-helloworld-001.js):
<details> <summary>Show minimal lesson (copy/paste)</summary>

TMSE.registerLesson({
  id: "helloworld-001",
  name: "Hello World",
  course: "Samples",
  author: "You",
  subject: "Fun",
  icon: { type: "png", src: "icons/language-400.png" },
  version: 1,
  scoring: { aggregate: "average" },
  activities: [{
    type: "trivia",
    title: "Tiny Trivia",
    timeLimitSec: 60,
    randomize: { itemsPerRound: 1, shuffleItems: true },
    data: { questions: [
      {
        prompt: "TMSE stands for…",
        choices: ["Too Many Snacks", "Teach Me Stuff Engine", "Try More Stuff", "Text Markup Style Editor"],
        answerIndex: 1,
        explanation: "TMSE = Teach Me Stuff Engine — a lightweight learning engine."
      }
    ]}
  }]
});

</details>
Field overview

    id — Unique slug for saves and routing (e.g., "wellness-zen-001").

    name — Display name of the lesson.

    course — Grouping label (e.g., "Wellness Essentials").

    author — Credit line.

    subject — Category badge (e.g., Language, STEM, Self Improvement, Fun).

    icon — { type: "png", src: "icons/your-400.png" } or { type: "css", class: "..." } or { type: "none" }.

    activities[] — List of minigame configs (see below).

    scoring — { aggregate: "average" } (recommended).

    version — Schema version (use 1).

Each trivia item supports explanation which appears in end-of-round review.
10) Default Minigames

All games accept timeLimitSec, starThresholds (optional override), and
randomize options; content is randomized per round. Scores are percentages.

    Trivia (multiple choice)
    Data: { questions: [{ prompt, choices[4], answerIndex, explanation }] }
    Behavior: One tap per question with instant feedback. Review shows your
    choice, correct answer, and explanation.
    Scoring: % correct.
    Time: Typically 60–120s.

    Match (pair items)
    Data: { pairs: [{ left: string, right: string|{img,alt} }, ...] }
    Behavior: Tap a left token, then a right target to match. Supports text↔text
    and text↔image. Review summarizes matches.
    Scoring: % pairs matched.
    Time: Typically 60–120s.

    Sequence (reorder to correct order)
    Data: { items: ["Step 1","Step 2",...], explanation?: string }
    Behavior: Tap-to-swap to reach the target order. Review shows final order.
    Scoring: Partial credit by position (% in correct place).
    Time: Typically 60–120s.

    Memory (flip-two)
    Data: { cards: [{ pairId:"1", label?:"A", img?:"icons/a.png", alt?:"" }, ...] }
    Behavior: Flip two; matched pairIds remain revealed. Review shows stats.
    Scoring: % pairs matched.
    Time: Typically 60–120s.

    Flashcard (tap to flip; self-grade Got it / Not yet)
    Data: { cards: [{ front, back }, ...] }
    Behavior: Tap card to flip, choose Got it or Not yet.
    Scoring: % Got it.
    Time: Typically 45–90s.

11) Extending TMSE (Custom Games)

Register new games at runtime (no builds). Your game must call
onComplete({ scorePercent, details }) when finished.

TMSE.registerGame({
  id: "mygame",
  title: "My Custom Game",
  init(containerEl, { lesson, activity, config, rng }, onComplete) {
    // Mount UI into containerEl.
    // Use rng.shuffle / rng.pickSubset for deterministic randomness.
    // When done:
    onComplete({ scorePercent: 88, details: { items: [] } });
  },
  destroy() {
    // Optional cleanup.
  }
});

Use your id as activities[].type in lessons:

activities: [{ type: "mygame", title: "Level 1", data: { /* ... */ } }]

    Note: The engine may pass an extra helper object to init in newer versions;
    treat it as optional to stay compatible.

12) Scoring & Persistence

    Activity: Score is a percentage (rounded) based on the minigame rules.
    Stars (0–3) derive from thresholds: activity starThresholds or global
    defaultStarThresholds.

    Lesson “best” (NEW RULE):
    Average of each activity’s BEST % for that lesson (rounded). Lesson-level
    stars are derived from that average using the lesson’s thresholds (or config
    default).

    Storage: Saved in localStorage under key TMSE_SAVES_V1.
    Structure per lesson:

    {
      "lessonId": {
        "activities": { "Activity Title": { "score": 92, "stars": 3, "at": 1700000000000 } },
        "lesson": { "score": 88, "stars": 2, "at": 1700000000000 }
      }
    }

    Reset saves:

        In UI: Settings → Clear All Saves

        DevTools console: localStorage.removeItem('TMSE_SAVES_V1')

13) Theming & Accessibility

    CSS variables: The theme uses light-on-dark tokens (see styles.css):

        --bg, --panel, --text, --muted, --brand, --danger, etc.

    Contrast: Targets WCAG AA (≥4.5:1 for normal text).

    Pointer-first: No keyboard required; hit targets ≥ 44px.

    Focus: Visible focus rings for mouse/touch focus states.

    Motion: Respects prefers-reduced-motion (animations pared back).

    ARIA: Toasts use live regions; modals have role="dialog" and can be
    dismissed (Close/Cancel/ESC/click-outside).

14) Security & Safety

    Lesson loading: Filenames must match allowedLessonPattern (unless
    allowAnyUrl is true). Remote loads honor importTimeoutMs and show
    friendly, dismissible errors on failure.

    Informational content: Lessons are educational; they should avoid
    prescriptive claims. You may include a top-of-file comment such as:
    // Informational only; not medical advice.

15) Troubleshooting (FAQ)

Import fails or “softlock”?
Use Load Lesson again. Modals are always closable (X/Cancel/ESC/click-
outside). Check console for [TMSE] logs. Confirm filename matches the regex.

My lesson doesn’t appear after “Scan Lessons.”
Ensure it’s listed in /content/manifest.json and its filename matches the
regex. Verify TMSE.registerLesson({...}) runs without errors.

Duplicate lessons show up.
TMSE guards against duplicates by id; duplicates are ignored with a console
note.

Buttons don’t respond after navigation.
Game screen uses delegated pointer handlers; if you added overlays, make sure
they don’t capture events (pointer-events and z-index). Remove stray absolute
elements covering the UI.

GitHub Pages paths look broken.
Use relative paths (default config works). Ensure contentPath and iconsPath
match your deployed structure (/content/, /icons/).

Lesson stars/score look off.
Lesson “best” is derived: average of per-activity best percentages. Play
or replay activities; the lesson best will recompute automatically.
16) Roadmap (short)

Opt-in analytics hooks (page/game events)

i18n-friendly text bundles & RTL support

Additional minigames (sorting, cloze)

Richer manifest.json with metadata and tags

    Screenshot/export results summary

17) Contributing

    Fork and create a feature branch.

    Keep to plain HTML/CSS/JS (ES modules OK). No external deps.

    Code style: small, well-named modules; thorough comments; accessible UI.

    To add a minigame:

        Create games/<yourgame>.js.

        TMSE.registerGame({...}) (see API above).

        Document data shape in the README and provide a sample lesson snippet.

    Test on a local static server and in a mobile viewport.

18) License

MIT License — do as you wish, with attribution. Include a link back to the
project and keep the license in derived distributions.
19) Acknowledgements

Inspired by friendly learning apps, rhythm game setlists, and countless open
source UI patterns. Thanks to contributors who value accessibility, clarity,
and joy in small interactions.
Helpful Blocks
Minimal Lesson Example (10–15 lines)

TMSE.registerLesson({
  id: "sample-quiz-001",
  name: "Sample Quiz",
  course: "Samples",
  author: "TMSE Team",
  subject: "Fun",
  icon: { type: "png", src: "icons/language-400.png" },
  version: 1,
  scoring: { aggregate: "average" },
  activities: [{
    type: "trivia",
    title: "One Q Demo",
    timeLimitSec: 45,
    randomize: { itemsPerRound: 1, shuffleItems: true },
    data: { questions: [{
      prompt: "What does TMSE stand for?",
      choices: ["Teach Me Stuff Engine","Tiny Magic Script Engine","Test Module Sample Edition","None"],
      answerIndex: 0,
      explanation: "TMSE = Teach Me Stuff Engine."
    }]}
  }]
});

Local Server Commands

# macOS/Linux
python3 -m http.server 8080
# Windows (PowerShell)
py -m http.server 8080
# Node (if installed)
npx http-server -p 8080

ASCII Architecture Sketch

+----------------------- UI (index.html, styles.css) -----------------------+
|  Topbar / Screens / HUD / Modals / Toasters                               |
+-------------------------------|-------------------------------------------+
                                v
                    +------------------------+
                    |   TMSE Engine (tmse.js)|
                    |  - Router/State        |
                    |  - RNG/Timers          |
                    |  - Saves (localStorage)|
                    |  - Manifest & Imports  |
                    |  - Stars/Scoring       |
                    +------------------------+
                      |             ^
   registerGame(...)  |             | registerLesson(...)
                      v             |
               +---------------------------+       +---------------------+
               |   Games (/games/*.js)     |<----->|  Content (/content) |
               | trivia/match/sequence/... |       |  Lesson JS & icons  |
               +---------------------------+       +---------------------+

Where to Look in the Repo

    index.html — App shell & screen containers.

    styles.css — Theme (CSS variables), cards, HUD, game styles.

    tmse.config.js — Dev flags (see table above).

    tmse.js — Core engine, saves, router, manifest/loaders, scoring.

    ui/ui.js — Toasts, modals, timers (dismissible modals; ARIA live).

    games/*.js — Five default minigames (reference for custom games).

    content/manifest.json — Lesson index (filenames).

    content/*.js — Lesson files calling TMSE.registerLesson(...).

Happy building! 🚀

