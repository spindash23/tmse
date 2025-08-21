// /content/TMSE-dev-authoring-101.js

TMSE.registerLesson({
  id: "dev-authoring-101",
  name: "TMSE Dev Authoring 101",
  course: "TMSE Developer Guide",
  author: "TMSE Team",
  subject: "Comprehension",
  icon: { type: "png", src: "icons/dev-guide-400.png" },
  version: 1,
  scoring: { aggregate: "average" },
  activities: [
    {
      type: "trivia",
      title: "Config, Schema & Workflow Essentials",
      timeLimitSec: 120,
      starThresholds: [65, 82, 94],
      randomize: { itemsPerRound: 12, shuffleItems: true },
      data: {
        questions: [
          {
            prompt: "Which config flag caps per-activity timers unless overridden?",
            choices: ["seededRandom", "maxActivitySeconds", "useManifest", "iconsPath"],
            answerIndex: 1,
            explanation:
              "Set a ceiling with `maxActivitySeconds`. To exceed it, set `allowLongerTimers:true` in `tmse.config.js`.\n\nSnippet:\n`window.TMSE_CONFIG = { maxActivitySeconds:120, allowLongerTimers:false }`"
          },
          {
            prompt: "Which flag enables reproducible shuffles per session?",
            choices: ["defaultStarThresholds", "seededRandom", "importTimeoutMs", "contentPath"],
            answerIndex: 1,
            explanation:
              "`seededRandom:true` creates deterministic shuffles for a session—great for debugging and fair comparisons."
          },
          {
            prompt: "Valid lesson filename pattern enforced by the engine is:",
            choices: [
              "TMSE_<anything>.js",
              "TMSE-<slug>-NNN.js",
              "LESSON-*.mjs",
              "Any .json"
            ],
            answerIndex: 1,
            explanation:
              "Default regex is `^TMSE-[a-z0-9-]+-\\d{3}\\.js$`.\n\nExample: `TMSE-mycourse-001.js`."
          },
          {
            prompt: "Which three lesson fields are essential for registration?",
            choices: [
              "id, name, activities[]",
              "course, author, icon",
              "subject, version, scoring",
              "iconsPath, contentPath, useManifest"
            ],
            answerIndex: 0,
            explanation:
              "Minimum viable object includes `id`, `name`, and `activities`.\n\nSnippet:\n`TMSE.registerLesson({ id:\"x\", name:\"Y\", activities:[...] })`"
          },
          {
            prompt: "Where do built-in lessons get listed for automatic discovery?",
            choices: [
              "games/*.js",
              "content/manifest.json",
              "styles.css",
              "index.html data-*"
            ],
            answerIndex: 1,
            explanation:
              "`useManifest:true` makes **Scan Lessons** fetch `/content/manifest.json` (array of filenames)."
          },
          {
            prompt: "Which flag helps prevent import softlocks on slow URLs?",
            choices: ["iconsPath", "importTimeoutMs", "allowedLessonPattern", "subject"],
            answerIndex: 1,
            explanation:
              "`importTimeoutMs` aborts slow lesson imports to show a friendly, dismissible error.\n\nSnippet:\n`window.TMSE_CONFIG = { importTimeoutMs: 5000 }`"
          },
          {
            prompt: "To exceed the time cap for certain activities you would set:",
            choices: [
              "allowLongerTimers:true",
              "seededRandom:false",
              "useManifest:false",
              "defaultStarThresholds:[90,95,99]"
            ],
            answerIndex: 0,
            explanation:
              "`allowLongerTimers:true` lets an activity's `timeLimitSec` go beyond `maxActivitySeconds`."
          },
          {
            prompt: "The correct definition for lesson “best” is:",
            choices: [
              "Best single activity score",
              "Average of latest attempts",
              "Average of each activity’s BEST % (rounded)",
              "Sum of scores across activities"
            ],
            answerIndex: 2,
            explanation:
              "Lesson “best” = average of **per-activity BEST percentages** (rounded). Stars derive from that average using thresholds."
          },
          {
            prompt: "Where do star thresholds come from by default?",
            choices: [
              "Global `defaultStarThresholds` in config",
              "Per question object",
              "Derived from time limit",
              "They do not exist"
            ],
            answerIndex: 0,
            explanation:
              "Global thresholds live in `tmse.config.js` as `defaultStarThresholds`.\nOverride per activity via `starThresholds:[... ]`."
          },
          {
            prompt: "What does `allowedLessonPattern` govern?",
            choices: [
              "Which icons load",
              "Which filenames are allowed for lessons",
              "Which games are enabled",
              "Which screens are visible"
            ],
            answerIndex: 1,
            explanation:
              "Security gate for lesson filenames.\n\nRegex:\n`^TMSE-[a-z0-9-]+-\\d{3}\\.js$`"
          },
          {
            prompt: "How do you register a custom game?",
            choices: [
              "Add to manifest.json",
              "TMSE.registerGame({ id, title, init, destroy })",
              "Edit tmse.js directly",
              "Rename trivia.js"
            ],
            answerIndex: 1,
            explanation:
              "Games plug in at runtime.\n\nSnippet:\n`TMSE.registerGame({ id:\"mygame\", title:\"My Game\", init(c, ctx, done){/*...*/}, destroy(){} })`"
          },
          {
            prompt: "How does a lesson reference your custom game?",
            choices: [
              "activities[].gameId",
              "activities[].type = your game's id",
              "Add <script> to index.html",
              "Not supported"
            ],
            answerIndex: 1,
            explanation:
              "Use `activities[].type = \"mygame\"` so the engine launches your registered game."
          },
          {
            prompt: "Which practice improves theme compatibility?",
            choices: [
              "Hard-code `#000` and `#fff`",
              "Use CSS variables (no inline colors)",
              "Inline style strings",
              "Fixed light theme only"
            ],
            answerIndex: 1,
            explanation:
              "The engine uses theme tokens; prefer semantic classes and CSS variables for AA contrast.\n\nTip: `var(--text)`, `var(--panel)`."
          },
          {
            prompt: "What pointer issue can cause “dead” buttons?",
            choices: [
              "No async/await",
              "Overlay with `pointer-events: auto` covering buttons",
              "Too many toasts",
              "Excessive border radius"
            ],
            answerIndex: 1,
            explanation:
              "A hidden overlay can intercept taps. Ensure overlays are removed/hidden or use `pointer-events:none` when appropriate."
          },
          {
            prompt: "Randomization best practice for pools is to:",
            choices: [
              "Set itemsPerRound equal to pool size",
              "Keep itemsPerRound < pool size",
              "Disable shuffle",
              "Use only one item"
            ],
            answerIndex: 1,
            explanation:
              "Keep rounds fresh by making pools larger than `itemsPerRound`.\n\nExample: `randomize:{ itemsPerRound:8, shuffleItems:true }`"
          },
          {
            prompt: "Where are saves stored by default?",
            choices: [
              "IndexedDB",
              "localStorage under TMSE_SAVES_V1",
              "Cookies",
              "SessionStorage"
            ],
            answerIndex: 1,
            explanation:
              "High scores and stars persist in `localStorage` under the key `TMSE_SAVES_V1`.\n\nReset: `localStorage.removeItem('TMSE_SAVES_V1')`"
          },
          {
            prompt: "If manifest is disabled, how can users load lessons?",
            choices: [
              "They cannot",
              "Only via service workers",
              "Start → Load Lesson (File/URL)",
              "Edit styles.css"
            ],
            answerIndex: 2,
            explanation:
              "Use the **Load Lesson** modal. Filenames/URLs must satisfy `allowedLessonPattern` unless `allowAnyUrl:true`."
          },
          {
            prompt: "Which three fields help organize lesson cards?",
            choices: [
              "course, author, subject",
              "path, repo, branch",
              "height, width, color",
              "timer, seed, size"
            ],
            answerIndex: 0,
            explanation:
              "Cards display metadata like course, author, and subject for filtering and sorting."
          },
          {
            prompt: "A11y guideline for interactive targets in TMSE is around:",
            choices: ["24px", "32px", "44px", "60px"],
            answerIndex: 2,
            explanation:
              "Aim for ≥44px touch targets; ensure visible focus rings and `prefers-reduced-motion` friendly animations."
          },
          {
            prompt: "Good feedback writing style is to:",
            choices: [
              "Be cryptic to save space",
              "Explain WHY with a tiny snippet when helpful",
              "Use medical claims",
              "Omit explanations entirely"
            ],
            answerIndex: 1,
            explanation:
              "Concise, empathetic explanations teach better. Example: `\"Lesson best averages per-activity best %\"`."
          }
        ]
      }
    },
    {
      type: "match",
      title: "Concept → Purpose / Snippet",
      timeLimitSec: 90,
      randomize: { itemsPerRound: 10, shuffleItems: true },
      data: {
        pairs: [
          { left: "allowedLessonPattern", right: "Controls allowed lesson filenames; e.g. `^TMSE-[a-z0-9-]+-\\d{3}\\.js$`" },
          { left: "useManifest", right: "Enable `/content/manifest.json` scanning on **Scan Lessons**" },
          { left: "contentPath", right: "Base folder for lessons (e.g., `content/`)" },
          { left: "iconsPath", right: "Where PNG icons live (e.g., `icons/`)" },
          { left: "seededRandom", right: "Reproducible shuffles per session for testing" },
          { left: "importTimeoutMs", right: "Prevents hanging imports; shows friendly error" },
          { left: "maxActivitySeconds", right: "Caps timers unless `allowLongerTimers` is true" },
          { left: "defaultStarThresholds", right: "Fallback % cutoffs for 1–3 stars" },
          { left: "starThresholds (activity)", right: "Override per activity, e.g., `[60,80,92]`" },
          { left: "TMSE.registerGame", right: "Plug-in custom minigames at runtime" },
          { left: "activities[].type", right: "Reference built-in or custom game id" },
          { left: "itemsPerRound", right: "Subset of a larger pool to keep rounds fresh" },
          { left: "localStorage TMSE_SAVES_V1", right: "Where highs & stars are persisted" },
          { left: "pointer-events trap", right: "Hidden overlay can block taps; remove or `pointer-events:none`" },
          { left: "ARIA live region", right: "Announce import errors for screen readers" }
        ]
      }
    },
    {
      type: "sequence",
      title: "Add a New Lesson: Recommended Flow",
      timeLimitSec: 75,
      randomize: { itemsPerRound: 7, shuffleItems: true },
      data: {
        items: [
          "Name the file: TMSE-<slug>-NNN.js",
          "Author lesson: TMSE.registerLesson({ ... })",
          "Place file in /content/",
          "Add filename to content/manifest.json array",
          "Serve locally (http://localhost:8080)",
          "Click Scan Lessons in Start screen",
          "Open Lesson Detail and test activities",
          "Review scoring & stars, adjust thresholds if needed",
          "Commit & deploy to static host"
        ],
        explanation:
          "This keeps discovery predictable: filename → schema → manifest → scan → test → adjust."
      }
    },
    {
      type: "memory",
      title: "TMSE Terms: Match Pairs",
      timeLimitSec: 100,
      starThresholds: [60, 80, 92],
      randomize: { itemsPerRound: 7, shuffleItems: true },
      data: {
        cards: [
          { pairId: "agg1", label: "aggregate: 'average'" },
          { pairId: "agg1", label: "Lesson score averages activity BEST %" },

          { pairId: "ipr1", label: "itemsPerRound" },
          { pairId: "ipr1", label: "Use subset; keep pool larger than round" },

          { pairId: "thr1", label: "starThresholds" },
          { pairId: "thr1", label: "% cutoffs for 1–3 stars" },

          { pairId: "sr1", label: "seededRandom" },
          { pairId: "sr1", label: "Stable shuffles for a session" },

          { pairId: "pat1", label: "allowedLessonPattern" },
          { pairId: "pat1", label: "Regex gate for lesson filenames" },

          { pairId: "pe1", label: "pointer-events trap" },
          { pairId: "pe1", label: "Overlay intercepts taps; disable or remove" },

          { pairId: "aria1", label: "ARIA live region" },
          { pairId: "aria1", label: "Announce toasts/errors accessibly" },

          { pairId: "save1", label: "TMSE_SAVES_V1" },
          { pairId: "save1", label: "localStorage key for highs & stars" }
        ]
      }
    },
    {
      type: "flashcard",
      title: "Dev Tips & Anti-Patterns",
      timeLimitSec: 80,
      randomize: { itemsPerRound: 12, shuffleItems: true },
      data: {
        cards: [
          { front: "Use CSS variables; avoid hard-coded #000/#fff", back: "Theme tokens keep AA contrast" },
          { front: "Keep itemsPerRound < pool size", back: "Rounds stay fresh and shorter" },
          { front: "Explain WHY in feedback", back: "Add a tiny snippet when useful" },
          { front: "Seeded randomness for tests", back: "`seededRandom:true` in config" },
          { front: "Filename pattern matters", back: "`TMSE-<slug>-NNN.js` with regex gate" },
          { front: "Gentle time limits", back: "60–120s; respect caps" },
          { front: "Modal must be closable", back: "Close/Cancel/ESC/click-outside" },
          { front: "Event delegation for buttons", back: "Avoid dead zones after transitions" },
          { front: "Keep mouse/touch-only interactions simple", back: "≥44px targets" },
          { front: "Use per-activity thresholds when needed", back: "e.g., `[65,82,94]` for mastery" },
          { front: "Check `contentPath` on deploy", back: "Paths differ on GitHub Pages" },
          { front: "Reset saves safely", back: "`localStorage.removeItem('TMSE_SAVES_V1')`" },
          { front: "Manifest vs user-load", back: "Prefer manifest; allow Load (File/URL)" },
          { front: "Avoid pointer traps", back: "Remove overlays; mind z-index" },
          { front: "Concise prompts (<140 chars)", back: "Clarity + readability" },
          { front: "Include explanations for reviews", back: "Teach, don’t just grade" },
          { front: "Use ARIA live for errors", back: "Accessible toasts" },
          { front: "Icons in /icons/", back: "PNG 400x400 recommended" },
          { front: "Test on a static server", back: "`python -m http.server` works" },
          { front: "Lesson “best” rule", back: "Average of activity BEST %" }
        ]
      }
    }
  ]
});

// Optional dev helper (not used by the engine):
// A convenience manifest list you can copy into /content/manifest.json if desired.
window.TMSE_DEV_MANIFEST = [
  "TMSE-examplecourse1-001.js",
  "TMSE-wellness-zen-001.js",
  "TMSE-dev-authoring-101.js"
];
