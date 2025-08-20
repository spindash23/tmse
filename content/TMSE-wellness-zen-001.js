// /content/TMSE-wellness-zen-001.js
// Informational only; not medical advice.

TMSE.registerLesson({
  id: "wellness-zen-001",
  name: "Calm & Focus: Foundations",
  course: "Wellness Essentials",
  author: "TMSE Team",
  subject: "Self Improvement",
  icon: { type: "png", src: "icons/calm-400.png" },
  version: 1,
  scoring: { aggregate: "average" },
  activities: [
    {
      type: "trivia",
      title: "Breath, Posture & Micro-Break Basics",
      timeLimitSec: 110,
      starThresholds: [65, 80, 92],
      randomize: { itemsPerRound: 10, shuffleItems: true },
      data: {
        questions: [
          {
            prompt: "Diaphragmatic vs. chest breathing: which area gently expands first?",
            choices: ["Upper chest", "Neck", "Belly/ribs", "Lower back only"],
            answerIndex: 2,
            explanation:
              "Diaphragmatic breathing lets the belly and lower ribs move first; many people find this slower pattern helps attention feel steadier."
          },
          {
            prompt: "Box breathing is commonly practiced as what simple count pattern?",
            choices: ["3-6-3-6", "4-4-4-4", "5-7-5-7", "4-7-8"],
            answerIndex: 1,
            explanation:
              "“Box” usually means equal counts: inhale 4, hold 4, exhale 4, hold 4. The even rhythm can feel grounding."
          },
          {
            prompt: "In 4-7-8 breathing, the longest count is typically on the…",
            choices: ["Inhale", "Top hold", "Exhale", "Bottom hold"],
            answerIndex: 2,
            explanation:
              "A common version is inhale 4, hold 7, exhale 8. The extended exhale can feel settling for many people."
          },
          {
            prompt: "A quick posture reset often includes:",
            choices: [
              "Shoulders up toward ears",
              "Shoulders down/back with soft chin tuck",
              "Leaning far forward",
              "Locking knees"
            ],
            answerIndex: 1,
            explanation:
              "Lowering and gently drawing the shoulders back with a soft chin tuck opens the chest and may reduce shallow breathing."
          },
          {
            prompt: "Micro-breaks during screen time can be as short as:",
            choices: ["1–2 minutes", "15 minutes minimum", "30 minutes minimum", "Only at lunch"],
            answerIndex: 0,
            explanation:
              "Brief, regular pauses (even 60–120 seconds) to look away, roll shoulders, or stand can feel refreshing."
          },
          {
            prompt: "A simple eye break many people use is the 20-20-20 rule:",
            choices: [
              "20 blinks in 20 seconds",
              "Look 20 feet away for 20 seconds every ~20 minutes",
              "Close eyes for 20 minutes every 20 minutes",
              "20% screen brightness"
            ],
            answerIndex: 1,
            explanation:
              "Looking far away for ~20 seconds every ~20 minutes may ease near-focus fatigue."
          },
          {
            prompt: "Gentle stretching is best approached with:",
            choices: [
              "Fast, bouncy movements",
              "Holding breath",
              "Slow in/out, easy range, steady breath",
              "Competing for deepest range"
            ],
            answerIndex: 2,
            explanation:
              "Slow, comfortable ranges with steady breathing help many people feel safe and relaxed during light stretching."
          },
          {
            prompt: "A friendly wind-down cue for sleep hygiene is to:",
            choices: [
              "Increase bright screens near bedtime",
              "Keep lights dim and routine predictable",
              "Do intense exercise right before bed",
              "Sip strong coffee late evening"
            ],
            answerIndex: 1,
            explanation:
              "Dim lighting and a simple, repeatable routine signal the body that rest is coming."
          },
          {
            prompt: "“Mindful micro-break” best matches:",
            choices: [
              "Scrolling quickly on another app",
              "Checking more notifications",
              "Brief pause to notice breath, posture, or senses",
              "Powering through without stops"
            ],
            answerIndex: 2,
            explanation:
              "A short, intentional pause to notice breathing, posture, or sounds can gently reset attention."
          },
          {
            prompt: "During calm breathing, which cue often helps?",
            choices: [
              "Tighten the stomach",
              "Let the belly move comfortably",
              "Lift the shoulders to inhale",
              "Hold breath frequently"
            ],
            answerIndex: 1,
            explanation:
              "Letting the belly move naturally can reduce effort and support slower, easier inhales and exhales."
          },
          {
            prompt: "A simple grounding practice is to:",
            choices: [
              "List 3 things you see/hear/feel",
              "Count steps only when running",
              "Hold your breath as long as possible",
              "Think of every task at once"
            ],
            answerIndex: 0,
            explanation:
              "Naming a few sights, sounds, or sensations can help attention feel anchored to the present."
          },
          {
            prompt: "When seated for a while, it may help to:",
            choices: [
              "Cross legs tightly",
              "Plant feet, lengthen through the crown, soften shoulders",
              "Lean far to one side",
              "Lock the jaw"
            ],
            answerIndex: 1,
            explanation:
              "Feet grounded, tall but relaxed spine, and soft shoulders are common cues for a comfortable, open posture."
          },
          {
            prompt: "A calm exhale is often:",
            choices: ["Shorter than inhale", "Equal or slightly longer than inhale", "Very forceful", "Held for a long time"],
            answerIndex: 1,
            explanation:
              "Many people find equal or slightly longer exhales feel settling without strain."
          },
          {
            prompt: "A realistic reminder strategy for breaks is:",
            choices: [
              "Wait until you remember naturally",
              "Use a gentle timer or pair with a routine (e.g., after emails)",
              "Skip breaks entirely",
              "Only take breaks when very tired"
            ],
            answerIndex: 1,
            explanation:
              "Light structure—like a soft timer or habit-stacking—can make brief pauses easier to keep."
          },
          {
            prompt: "A calm screen wind-down often includes:",
            choices: [
              "High-stim videos in a bright room",
              "Lower brightness, warmer tones, or non-screen options",
              "Crowded news feeds",
              "Late-night competitive gaming"
            ],
            answerIndex: 1,
            explanation:
              "Reducing brightness and stimulation near bedtime helps many people feel readier for rest."
          },
          {
            prompt: "If a stretch feels sharp or pinchy, a common response is to:",
            choices: [
              "Push deeper to adapt",
              "Hold breath and wait",
              "Ease out and choose a gentler angle",
              "Ignore it completely"
            ],
            answerIndex: 2,
            explanation:
              "Easing out and picking a lighter option can keep practice comfortable and sustainable."
          }
        ]
      }
    },
    {
      type: "match",
      title: "Match Practice to Purpose",
      timeLimitSec: 90,
      randomize: { itemsPerRound: 8, shuffleItems: true },
      data: {
        pairs: [
          { left: "Box breathing", right: "Even, predictable rhythm that many find grounding" },
          { left: "4-7-8 breathing", right: "Longer exhale; some find it cues relaxation" },
          { left: "Posture reset (shoulders down/back)", right: "Opens chest; can reduce shallow breathing" },
          { left: "Soft chin tuck", right: "Lengthens back of neck; reduces head-forward strain" },
          { left: "20-20-20 eye break", right: "Look far for 20s to ease near-focus fatigue" },
          { left: "Micro-walk", right: "Gentle movement to refresh attention and circulation" },
          { left: "Grounding: name 3 sounds", right: "Brings attention into the present moment" },
          { left: "Body scan (head → toes)", right: "Noticing areas of ease/tension without judgment" },
          { left: "Gentle chest opener", right: "Counteracts slouching; encourages easier breaths" },
          { left: "Blink break", right: "Re-lubricates eyes after screen focus" },
          { left: "Even nasal breathing", right: "Often feels smoother and quieter for many" },
          { left: "Desk shoulder rolls", right: "Loosens common tight spots during seated work" }
        ]
      }
    },
    {
      type: "sequence",
      title: "Wind-Down Routine Order",
      timeLimitSec: 75,
      randomize: { itemsPerRound: 7, shuffleItems: true },
      data: {
        // Correct overall order; UI presents a shuffled subset per round.
        items: [
          "Reduce bright screens",
          "Dim room lights",
          "Tidy a small area (1–2 min)",
          "Gentle stretch",
          "Calm breathing (e.g., box or 4-7-8)",
          "Warm drink or water (if desired)",
          "Light journaling or reading",
          "Quiet, low-stim activity",
          "Lights out"
        ],
        // One-line note for review context (engine may not display, included for completeness)
        explanation:
          "A consistent, simple sequence helps many people associate the evening with settling and rest."
      }
    },
    {
      type: "memory",
      title: "Mindfulness Terms: Memory Pairs",
      timeLimitSec: 95,
      starThresholds: [60, 80, 92],
      randomize: { itemsPerRound: 6, shuffleItems: true }, // 6 pairs (~12 cards) per round
      data: {
        cards: [
          { pairId: "b1", label: "Box breathing" },
          { pairId: "b1", label: "Even 4-4-4-4 counts many find steadying" },

          { pairId: "d1", label: "Diaphragm" },
          { pairId: "d1", label: "Main breathing muscle under the ribs" },

          { pairId: "mb1", label: "Micro-break" },
          { pairId: "mb1", label: "Very short pause to reset posture/attention" },

          { pairId: "sg1", label: "Soft gaze" },
          { pairId: "sg1", label: "Rest eyes by looking gently into the distance" },

          { pairId: "ct1", label: "Chin tuck" },
          { pairId: "ct1", label: "Small nod to lengthen the neck comfortably" },

          { pairId: "gr1", label: "Grounding" },
          { pairId: "gr1", label: "Notice sights/sounds/touch in the present" },

          { pairId: "pmr1", label: "Body scan" },
          { pairId: "pmr1", label: "Move attention across the body with curiosity" },

          { pairId: "sl1", label: "Sleep cue" },
          { pairId: "sl1", label: "A predictable step that signals ‘wind-down’" }
        ]
      }
    },
    {
      type: "flashcard",
      title: "Gentle Tips & Micro-Ideas",
      timeLimitSec: 70,
      randomize: { itemsPerRound: 12, shuffleItems: true },
      data: {
        cards: [
          { front: "3 slow breaths before emails", back: "Short pause can feel steadying" },
          { front: "60-second posture reset", back: "Feet grounded, tall spine, soft shoulders" },
          { front: "Soft gaze break (20s)", back: "Look far to rest eye muscles" },
          { front: "Box breath cycle ×3", back: "Even counts may feel grounding" },
          { front: "Mini stretch: reach up", back: "Gentle, easy range; breathe" },
          { front: "Name 3 sounds", back: "Simple present-moment anchor" },
          { front: " unclench jaw reminder ", back: "Let tongue rest, soften cheeks" },
          { front: "Shoulder rolls", back: "Slow circles, breathe out on release" },
          { front: "Stand & sip water", back: "Tiny reset for focus" },
          { front: "Tidy 1 item", back: "Small order can feel calming" },
          { front: "Even nasal breaths", back: "Quiet, smooth airflow" },
          { front: "Screen dim at night", back: "Lower brightness cue" },
          { front: "Warm light after dusk", back: "Softer signal for rest" },
          { front: "Gentle chest opener", back: "Hands on low back or doorway" },
          { front: "Hand stretch break", back: "Open/close fists slowly" },
          { front: "Feet check-in", back: "Notice contact with the floor" },
          { front: "One kind sentence", back: "Encouraging self-talk" },
          { front: "Breathe out longer", back: "Slightly extended exhale" },
          { front: "Slow neck turns", back: "Small range, no forcing" },
          { front: "Two quiet minutes", back: "Sit and notice breathing" }
        ]
      }
    }
  ]
});
