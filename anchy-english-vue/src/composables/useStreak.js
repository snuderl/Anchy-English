import { ref, watch } from 'vue'

const STORAGE_KEY = 'anchy-streaks'

function loadStreaks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { letterStreak: 0, bestLetterStreak: 0, wordStreak: 0, bestWordStreak: 0 }
}

function saveStreaks(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

// Shared reactive state across components
const stored = loadStreaks()
const letterStreak = ref(stored.letterStreak)
const bestLetterStreak = ref(stored.bestLetterStreak)
const wordStreak = ref(stored.wordStreak)
const bestWordStreak = ref(stored.bestWordStreak)

function persist() {
  saveStreaks({
    letterStreak: letterStreak.value,
    bestLetterStreak: bestLetterStreak.value,
    wordStreak: wordStreak.value,
    bestWordStreak: bestWordStreak.value,
  })
}

watch([letterStreak, bestLetterStreak, wordStreak, bestWordStreak], persist)

export function useStreak() {
  function onLetterCorrect() {
    letterStreak.value++
    if (letterStreak.value > bestLetterStreak.value) {
      bestLetterStreak.value = letterStreak.value
    }
  }

  function onLetterIncorrect() {
    letterStreak.value = 0
    wordStreak.value = 0
  }

  function onWordPerfect() {
    wordStreak.value++
    if (wordStreak.value > bestWordStreak.value) {
      bestWordStreak.value = wordStreak.value
    }
  }

  function resetStreaks() {
    letterStreak.value = 0
    wordStreak.value = 0
    // Note: best streaks are NOT reset — they persist forever
  }

  return {
    letterStreak,
    bestLetterStreak,
    wordStreak,
    bestWordStreak,
    onLetterCorrect,
    onLetterIncorrect,
    onWordPerfect,
    resetStreaks,
  }
}
