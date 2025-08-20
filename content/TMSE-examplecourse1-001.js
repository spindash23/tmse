// Example Lesson: exercises all features, includes 5 minigames with randomization,
// custom thresholds, explanations, and image assets.
// Authoring Tips:
// - Put icons in /icons/. Reference them with relative paths like "icons/language-400.png".
// - Add more activities by pushing to activities[] with type matching a registered game.
// - You can exceed the timer cap only if tmse.config.js sets allowLongerTimers=true.

TMSE.registerLesson({
  id: "examplecourse1-001",
  name: "Intro to Spanish",
  course: "Example Course 1",
  author: "TMSE Team",
  subject: "Language",
  icon: { type: "png", src: "icons/language-400.png" },
  scoring: { aggregate: "average" },
  version: 1,
  activities: [
    {
      type: "trivia",
      title: "Spanish Basics Trivia",
      timeLimitSec: 120,
      starThresholds: [60, 80, 95], // custom thresholds
      randomize: { itemsPerRound: 8, shuffleItems: true },
      data: {
        questions: [
          { prompt: "How do you say 'apple' in Spanish?", choices: ["pera", "manzana", "uva", "naranja"], answerIndex: 1, explanation: "Manzana = apple." },
          { prompt: "How do you say 'red' in Spanish?", choices: ["rojo", "verde", "azul", "negro"], answerIndex: 0, explanation: "Rojo = red." },
          { prompt: "Translate: 'Good morning'", choices: ["Buenas noches", "Buenos días", "Buenas tardes", "Hasta luego"], answerIndex: 1, explanation: "Buenos días = good morning." },
          { prompt: "‘Gracias’ means…", choices: ["Please", "Sorry", "Thank you", "Hello"], answerIndex: 2, explanation: "Gracias = thank you." },
          { prompt: "Select the correct article for 'manzana'", choices: ["El", "La", "Los", "Un"], answerIndex: 1, explanation: "La manzana (feminine)." },
          { prompt: "How do you say 'dog' in Spanish?", choices: ["gato", "perro", "pájaro", "caballo"], answerIndex: 1, explanation: "Perro = dog." },
          { prompt: "‘Adiós’ means…", choices: ["Hello", "Goodbye", "Please", "Thanks"], answerIndex: 1, explanation: "Adiós = goodbye." },
          { prompt: "Translate: 'I want water'", choices: ["Quiero pan", "Quiero agua", "Tengo agua", "Soy agua"], answerIndex: 1, explanation: "Quiero agua = I want water." },
          { prompt: "Plural of 'libro' (book)", choices: ["libros", "libres", "libras", "libras"], answerIndex: 0, explanation: "Add -s → libros." },
          { prompt: "How do you say 'green' in Spanish?", choices: ["verde", "marrón", "gris", "rosa"], answerIndex: 0, explanation: "Verde = green." }
        ]
      }
    },
    {
      type: "match",
      title: "Match Words to Pictures",
      timeLimitSec: 90,
      randomize: { itemsPerRound: 4, shuffleItems: true },
      data: {
        pairs: [
          { left: "rojo", right: { img: "icons/red-square.png", alt: "red square" } },
          { left: "verde", right: { img: "icons/green-square.png", alt: "green square" } },
          { left: "azul", right: { img: "icons/blue-square.png", alt: "blue square" } },
          { left: "gato", right: { img: "icons/cat.png", alt: "cat" } },
          { left: "perro", right: { img: "icons/dog.png", alt: "dog" } }
        ]
      }
    },
    {
      type: "sequence",
      title: "Alphabet Order Mini",
      timeLimitSec: 60,
      randomize: { itemsPerRound: 6, shuffleItems: true },
      data: { items: ["A","B","C","D","E","F","G","H","I","J"] }
    },
    {
      type: "memory",
      title: "Vocabulary Memory",
      timeLimitSec: 90,
      starThresholds: [40, 70, 90], // custom thresholds
      randomize: { itemsPerRound: 4, shuffleItems: true },
      data: {
        cards: [
          { pairId: "1", label: "rojo" },
          { pairId: "1", img: "icons/red-square.png", alt: "red square" },
          { pairId: "2", label: "verde" },
          { pairId: "2", img: "icons/green-square.png", alt: "green square" },
          { pairId: "3", label: "azul" },
          { pairId: "3", img: "icons/blue-square.png", alt: "blue square" },
          { pairId: "4", label: "gato" },
          { pairId: "4", img: "icons/cat.png", alt: "cat" },
          { pairId: "5", label: "perro" },
          { pairId: "5", img: "icons/dog.png", alt: "dog" }
        ]
      }
    },
    {
      type: "flashcard",
      title: "Quick Vocab Flip",
      timeLimitSec: 45,
      randomize: { itemsPerRound: 6, shuffleItems: true },
      data: {
        cards: [
          { front: "hello", back: "hola" },
          { front: "goodbye", back: "adiós" },
          { front: "please", back: "por favor" },
          { front: "thank you", back: "gracias" },
          { front: "red", back: "rojo" },
          { front: "green", back: "verde" },
          { front: "blue", back: "azul" },
          { front: "cat", back: "gato" },
          { front: "dog", back: "perro" }
        ]
      }
    }
  ]
});
