/**
 * Pick n random words from the array. Returns a new array (no mutation).
 * If words.length < n, returns a copy of all words.
 */
export function sampleWords(words, n) {
  if (!words || words.length === 0 || n <= 0) return []
  const shuffled = shuffleArray(words)
  return shuffled.slice(0, Math.min(n, words.length))
}

/**
 * Fisher-Yates shuffle. Returns a new array (no mutation).
 */
export function shuffleArray(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Star rating based on mistakes: 0 → 3, 1-2 → 2, 3+ → 1
 */
export function getStarRating(mistakes) {
  if (mistakes === 0) return 3
  if (mistakes <= 2) return 2
  return 1
}

/**
 * Format seconds as m:ss. E.g. 65 → "1:05", 0 → "0:00"
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
