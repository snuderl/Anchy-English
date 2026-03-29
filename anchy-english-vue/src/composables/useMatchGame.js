import { ref, computed } from 'vue'
import { sampleWords, shuffleArray, getStarRating } from '@/utils/gameUtils'

export function useMatchGame(initialWords, initialPairCount) {
  const words = ref(initialWords)
  const pairCount = ref(initialPairCount)

  const gamePhase = ref('setup') // 'setup' | 'playing' | 'completed'
  const englishCards = ref([])
  const sloveneCards = ref([])
  const selectedCard = ref(null)
  const matchedPairs = ref(0)
  const totalPairs = ref(0)
  const mistakes = ref(0)
  const streak = ref(0)
  const bestStreak = ref(0)
  const elapsedTime = ref(0)
  const locked = ref(false)

  let timerInterval = null

  const starRating = computed(() => getStarRating(mistakes.value))

  function startGame() {
    const sampled = sampleWords(words.value, pairCount.value)
    totalPairs.value = sampled.length

    englishCards.value = shuffleArray(
      sampled.map((w) => ({
        id: w.id,
        text: w.english,
        column: 'en',
        matched: false,
        matchState: 'neutral',
      }))
    )

    sloveneCards.value = shuffleArray(
      sampled.map((w) => ({
        id: w.id,
        text: w.slovene,
        column: 'sl',
        matched: false,
        matchState: 'neutral',
      }))
    )

    matchedPairs.value = 0
    mistakes.value = 0
    streak.value = 0
    bestStreak.value = 0
    elapsedTime.value = 0
    selectedCard.value = null
    locked.value = false

    gamePhase.value = 'playing'
    startTimer()
  }

  function startTimer() {
    stopTimer()
    timerInterval = setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function selectCard(card) {
    if (locked.value || gamePhase.value !== 'playing' || card.matched) return

    // No card selected yet
    if (!selectedCard.value) {
      card.matchState = 'selected'
      selectedCard.value = card
      return
    }

    // Same card → deselect
    if (selectedCard.value === card) {
      card.matchState = 'neutral'
      selectedCard.value = null
      return
    }

    // Same column → switch selection
    if (selectedCard.value.column === card.column) {
      selectedCard.value.matchState = 'neutral'
      card.matchState = 'selected'
      selectedCard.value = card
      return
    }

    // Different column → check match
    locked.value = true
    const first = selectedCard.value
    const second = card

    if (first.id === second.id) {
      // Correct match
      first.matchState = 'correct'
      second.matchState = 'correct'

      setTimeout(() => {
        first.matched = true
        second.matched = true
        first.matchState = 'neutral'
        second.matchState = 'neutral'
        matchedPairs.value++
        streak.value++
        if (streak.value > bestStreak.value) {
          bestStreak.value = streak.value
        }
        selectedCard.value = null
        locked.value = false

        if (matchedPairs.value === totalPairs.value) {
          gamePhase.value = 'completed'
          stopTimer()
        }
      }, 400)
    } else {
      // Wrong match
      first.matchState = 'wrong'
      second.matchState = 'wrong'

      setTimeout(() => {
        first.matchState = 'neutral'
        second.matchState = 'neutral'
        mistakes.value++
        streak.value = 0
        selectedCard.value = null
        locked.value = false
      }, 600)
    }
  }

  function restart() {
    stopTimer()
    gamePhase.value = 'setup'
    englishCards.value = []
    sloveneCards.value = []
    selectedCard.value = null
    matchedPairs.value = 0
    totalPairs.value = 0
    mistakes.value = 0
    streak.value = 0
    bestStreak.value = 0
    elapsedTime.value = 0
    locked.value = false
  }

  function setWords(newWords, newPairCount) {
    words.value = newWords
    pairCount.value = newPairCount
  }

  function cleanup() {
    stopTimer()
  }

  return {
    gamePhase,
    englishCards,
    sloveneCards,
    selectedCard,
    matchedPairs,
    totalPairs,
    mistakes,
    streak,
    bestStreak,
    elapsedTime,
    starRating,
    locked,
    startGame,
    selectCard,
    restart,
    setWords,
    cleanup,
  }
}
