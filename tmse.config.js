// TMSE Dev Flags & Defaults (edit safely)
// These values are read by tmse.js at startup. All paths are relative to site root.
window.TMSE_CONFIG = {
  // Paths
  contentPath: "content/",       // where lesson JS and manifest live
  iconsPath:   "icons/",         // optional PNG icons (400x400 recommended)

  // Security & naming
  // Only allow lesson filenames like: TMSE-examplecourse1-001.js
  allowedLessonPattern: "^TMSE-[a-z0-9-]+-\\d{3}\\.js$",

  // Discovery
  useManifest: true,             // fetch `${contentPath}manifest.json` to list lessons

  // Timers
  maxActivitySeconds: 120,       // hard cap unless allowLongerTimers is true
  allowLongerTimers: false,      // if true, activities may exceed the cap

  // Scoring
  defaultStarThresholds: [50, 75, 90], // % correct for 1/2/3 stars

  // Randomness
  seededRandom: true,            // deterministic per session (stable shuffles)
  // If true, allow remote URL loads that don't match allowedLessonPattern (use with caution).
  allowAnyUrl: false,

  // UI
  devLog: true                   // print helpful dev logs in console
};

/* Notes for developers:
 * - You can dynamically load lessons by adding them to /content/manifest.json.
 * - Or load manually via Start → “Load Lesson”, either local file (.js) or URL.
 * - If you use a custom filename pattern, update allowedLessonPattern above.
 * - To exceed the activity time cap (e.g., long quizzes), set allowLongerTimers:true.
 * - Star thresholds can be overridden per-activity in lesson data.
 * - Saves live in localStorage under the key "TMSE_SAVES_V1".
 */
