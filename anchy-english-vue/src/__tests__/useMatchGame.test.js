import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useMatchGame } from '@/composables/useMatchGame'

function makeWords(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    english: `word${i + 1}`,
    slovene: `beseda${i + 1}`,
  }))
}

/** Find an english card and its matching slovene card by id */
function findPair(game, id) {
  const en = game.englishCards.value.find((c) => c.id === id)
  const sl = game.sloveneCards.value.find((c) => c.id === id)
  return { en, sl }
}

/** Find a mismatched pair (en card with id1, sl card with id2 where id1 !== id2) */
function findMismatch(game) {
  const en = game.englishCards.value.find((c) => !c.matched)
  const sl = game.sloveneCards.value.find((c) => !c.matched && c.id !== en.id)
  return { en, sl }
}

describe('useMatchGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Setup phase', () => {
    it('initial gamePhase is "setup"', () => {
      const game = useMatchGame(makeWords(5), 3)
      expect(game.gamePhase.value).toBe('setup')
    })

    it('startGame() transitions to "playing"', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      expect(game.gamePhase.value).toBe('playing')
    })

    it('creates englishCards and sloveneCards with correct count', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      expect(game.englishCards.value).toHaveLength(3)
      expect(game.sloveneCards.value).toHaveLength(3)
    })

    it('cards have column="en" and column="sl" respectively', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      game.englishCards.value.forEach((c) => expect(c.column).toBe('en'))
      game.sloveneCards.value.forEach((c) => expect(c.column).toBe('sl'))
    })

    it('all cards start with matched=false, matchState="neutral"', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const allCards = [
        ...game.englishCards.value,
        ...game.sloveneCards.value,
      ]
      allCards.forEach((c) => {
        expect(c.matched).toBe(false)
        expect(c.matchState).toBe('neutral')
      })
    })

    it('mistakes, streak, matchedPairs all start at 0', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      expect(game.mistakes.value).toBe(0)
      expect(game.streak.value).toBe(0)
      expect(game.matchedPairs.value).toBe(0)
    })
  })

  describe('Selection', () => {
    it('selectCard sets selectedCard', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const card = game.englishCards.value[0]
      game.selectCard(card)
      expect(game.selectedCard.value).toBe(card)
      expect(card.matchState).toBe('selected')
    })

    it('selecting same card deselects (selectedCard → null)', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const card = game.englishCards.value[0]
      game.selectCard(card)
      game.selectCard(card)
      expect(game.selectedCard.value).toBeNull()
      expect(card.matchState).toBe('neutral')
    })

    it('selecting card in same column switches selection', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const card1 = game.englishCards.value[0]
      const card2 = game.englishCards.value[1]
      game.selectCard(card1)
      game.selectCard(card2)
      expect(game.selectedCard.value).toBe(card2)
      expect(card1.matchState).toBe('neutral')
      expect(card2.matchState).toBe('selected')
    })

    it('selecting card in other column triggers match check', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const en = game.englishCards.value[0]
      const sl = game.sloveneCards.value[0]
      game.selectCard(en)
      game.selectCard(sl)
      // Should be locked (match check in progress)
      expect(game.locked.value).toBe(true)
    })

    it('cannot select a matched card', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const id = game.englishCards.value[0].id
      const { en, sl } = findPair(game, id)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(400)
      expect(en.matched).toBe(true)
      // Try selecting the matched card
      game.selectCard(en)
      expect(game.selectedCard.value).toBeNull()
    })

    it('selectCard ignored when gamePhase !== "playing"', () => {
      const game = useMatchGame(makeWords(5), 3)
      // Still in setup
      const card = { id: 1, text: 'x', column: 'en', matched: false, matchState: 'neutral' }
      game.selectCard(card)
      expect(game.selectedCard.value).toBeNull()
    })

    it('selectCard ignored when locked=true', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const { en, sl } = findMismatch(game)
      game.selectCard(en)
      game.selectCard(sl)
      // Now locked
      expect(game.locked.value).toBe(true)
      const anotherCard = game.englishCards.value.find(
        (c) => c !== en && !c.matched
      )
      if (anotherCard) {
        game.selectCard(anotherCard)
        // Should still be the same state — locked blocks input
        expect(anotherCard.matchState).toBe('neutral')
      }
    })
  })

  describe('Correct match', () => {
    it('matching pair: both cards get matchState="correct"', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const id = game.englishCards.value[0].id
      const { en, sl } = findPair(game, id)
      game.selectCard(en)
      game.selectCard(sl)
      expect(en.matchState).toBe('correct')
      expect(sl.matchState).toBe('correct')
    })

    it('after 400ms: both cards matched=true, matchState="neutral"', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const id = game.englishCards.value[0].id
      const { en, sl } = findPair(game, id)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(400)
      expect(en.matched).toBe(true)
      expect(sl.matched).toBe(true)
      expect(en.matchState).toBe('neutral')
      expect(sl.matchState).toBe('neutral')
    })

    it('matchedPairs increments', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const id = game.englishCards.value[0].id
      const { en, sl } = findPair(game, id)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(400)
      expect(game.matchedPairs.value).toBe(1)
    })

    it('streak increments', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const id = game.englishCards.value[0].id
      const { en, sl } = findPair(game, id)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(400)
      expect(game.streak.value).toBe(1)
    })

    it('bestStreak updates when streak exceeds it', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      // Match two pairs in a row
      const id1 = game.englishCards.value[0].id
      const pair1 = findPair(game, id1)
      game.selectCard(pair1.en)
      game.selectCard(pair1.sl)
      vi.advanceTimersByTime(400)

      const id2 = game.englishCards.value.find((c) => !c.matched).id
      const pair2 = findPair(game, id2)
      game.selectCard(pair2.en)
      game.selectCard(pair2.sl)
      vi.advanceTimersByTime(400)

      expect(game.bestStreak.value).toBe(2)
    })

    it('selectedCard clears', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const id = game.englishCards.value[0].id
      const { en, sl } = findPair(game, id)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(400)
      expect(game.selectedCard.value).toBeNull()
    })

    it('locked clears after 400ms', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const id = game.englishCards.value[0].id
      const { en, sl } = findPair(game, id)
      game.selectCard(en)
      game.selectCard(sl)
      expect(game.locked.value).toBe(true)
      vi.advanceTimersByTime(400)
      expect(game.locked.value).toBe(false)
    })
  })

  describe('Wrong match', () => {
    it('non-matching pair: both cards get matchState="wrong"', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const { en, sl } = findMismatch(game)
      game.selectCard(en)
      game.selectCard(sl)
      expect(en.matchState).toBe('wrong')
      expect(sl.matchState).toBe('wrong')
    })

    it('after 600ms: both cards matchState="neutral", matched still false', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const { en, sl } = findMismatch(game)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(600)
      expect(en.matchState).toBe('neutral')
      expect(sl.matchState).toBe('neutral')
      expect(en.matched).toBe(false)
      expect(sl.matched).toBe(false)
    })

    it('mistakes increments', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const { en, sl } = findMismatch(game)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(600)
      expect(game.mistakes.value).toBe(1)
    })

    it('streak resets to 0', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      // First, get a correct match to build streak
      const id = game.englishCards.value[0].id
      const pair = findPair(game, id)
      game.selectCard(pair.en)
      game.selectCard(pair.sl)
      vi.advanceTimersByTime(400)
      expect(game.streak.value).toBe(1)

      // Now wrong match
      const { en, sl } = findMismatch(game)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(600)
      expect(game.streak.value).toBe(0)
    })

    it('bestStreak unchanged after wrong match', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      // Correct match first
      const id = game.englishCards.value[0].id
      const pair = findPair(game, id)
      game.selectCard(pair.en)
      game.selectCard(pair.sl)
      vi.advanceTimersByTime(400)
      expect(game.bestStreak.value).toBe(1)

      // Wrong match
      const { en, sl } = findMismatch(game)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(600)
      expect(game.bestStreak.value).toBe(1) // unchanged
    })

    it('selectedCard clears', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const { en, sl } = findMismatch(game)
      game.selectCard(en)
      game.selectCard(sl)
      vi.advanceTimersByTime(600)
      expect(game.selectedCard.value).toBeNull()
    })

    it('locked clears after 600ms', () => {
      const game = useMatchGame(makeWords(5), 3)
      game.startGame()
      const { en, sl } = findMismatch(game)
      game.selectCard(en)
      game.selectCard(sl)
      expect(game.locked.value).toBe(true)
      vi.advanceTimersByTime(600)
      expect(game.locked.value).toBe(false)
    })
  })

  describe('Completion', () => {
    it('matching last pair transitions gamePhase to "completed"', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()
      // Match all 3 pairs
      for (const enCard of game.englishCards.value) {
        const { en, sl } = findPair(game, enCard.id)
        game.selectCard(en)
        game.selectCard(sl)
        vi.advanceTimersByTime(400)
      }
      expect(game.gamePhase.value).toBe('completed')
    })

    it('timer stops (elapsedTime frozen)', () => {
      const game = useMatchGame(makeWords(2), 2)
      game.startGame()
      vi.advanceTimersByTime(3000) // 3 seconds pass
      // Match all pairs
      for (const enCard of [...game.englishCards.value]) {
        const { en, sl } = findPair(game, enCard.id)
        game.selectCard(en)
        game.selectCard(sl)
        vi.advanceTimersByTime(400)
      }
      const timeAtCompletion = game.elapsedTime.value
      vi.advanceTimersByTime(5000) // more time passes
      expect(game.elapsedTime.value).toBe(timeAtCompletion)
    })

    it('starRating computed correctly from final mistakes', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()
      // Match all perfectly
      for (const enCard of game.englishCards.value) {
        const { en, sl } = findPair(game, enCard.id)
        game.selectCard(en)
        game.selectCard(sl)
        vi.advanceTimersByTime(400)
      }
      expect(game.starRating.value).toBe(3) // 0 mistakes
    })
  })

  describe('Restart', () => {
    it('restart() resets gamePhase to "setup"', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()
      game.restart()
      expect(game.gamePhase.value).toBe('setup')
    })

    it('clears cards, scores, timer', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()
      vi.advanceTimersByTime(2000)
      game.restart()
      expect(game.englishCards.value).toHaveLength(0)
      expect(game.sloveneCards.value).toHaveLength(0)
      expect(game.matchedPairs.value).toBe(0)
      expect(game.mistakes.value).toBe(0)
      expect(game.streak.value).toBe(0)
      expect(game.bestStreak.value).toBe(0)
      expect(game.elapsedTime.value).toBe(0)
    })

    it('can startGame() again after restart', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()
      game.restart()
      game.startGame()
      expect(game.gamePhase.value).toBe('playing')
      expect(game.englishCards.value).toHaveLength(3)
    })
  })

  describe('Timer', () => {
    it('elapsedTime increments during "playing"', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()
      expect(game.elapsedTime.value).toBe(0)
      vi.advanceTimersByTime(3000)
      expect(game.elapsedTime.value).toBe(3)
    })

    it('does not increment during "setup"', () => {
      const game = useMatchGame(makeWords(3), 3)
      vi.advanceTimersByTime(3000)
      expect(game.elapsedTime.value).toBe(0)
    })

    it('stops incrementing after "completed"', () => {
      const game = useMatchGame(makeWords(2), 2)
      game.startGame()
      vi.advanceTimersByTime(2000)
      // Complete the game
      for (const enCard of [...game.englishCards.value]) {
        const { en, sl } = findPair(game, enCard.id)
        game.selectCard(en)
        game.selectCard(sl)
        vi.advanceTimersByTime(400)
      }
      const frozenTime = game.elapsedTime.value
      vi.advanceTimersByTime(5000)
      expect(game.elapsedTime.value).toBe(frozenTime)
    })

    it('cleanup() stops the interval', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()
      vi.advanceTimersByTime(2000)
      game.cleanup()
      const timeAtCleanup = game.elapsedTime.value
      vi.advanceTimersByTime(5000)
      expect(game.elapsedTime.value).toBe(timeAtCleanup)
    })
  })

  describe('Full game scenarios', () => {
    it('play a complete 3-pair game: start → match all → completed with correct stats', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()

      for (const enCard of game.englishCards.value) {
        const { en, sl } = findPair(game, enCard.id)
        game.selectCard(en)
        game.selectCard(sl)
        vi.advanceTimersByTime(400)
      }

      expect(game.gamePhase.value).toBe('completed')
      expect(game.matchedPairs.value).toBe(3)
      expect(game.mistakes.value).toBe(0)
      expect(game.bestStreak.value).toBe(3)
      expect(game.starRating.value).toBe(3)
    })

    it('play with mistakes: 2 wrong + 3 correct → mistakes=2, bestStreak=3, stars=2', () => {
      const game = useMatchGame(makeWords(3), 3)
      game.startGame()

      // Make 2 mistakes first
      for (let i = 0; i < 2; i++) {
        const { en, sl } = findMismatch(game)
        game.selectCard(en)
        game.selectCard(sl)
        vi.advanceTimersByTime(600)
      }

      expect(game.mistakes.value).toBe(2)

      // Now match all 3 correctly
      for (const enCard of game.englishCards.value) {
        if (enCard.matched) continue
        const { en, sl } = findPair(game, enCard.id)
        game.selectCard(en)
        game.selectCard(sl)
        vi.advanceTimersByTime(400)
      }

      expect(game.gamePhase.value).toBe('completed')
      expect(game.matchedPairs.value).toBe(3)
      expect(game.mistakes.value).toBe(2)
      expect(game.bestStreak.value).toBe(3)
      expect(game.starRating.value).toBe(2) // 1-2 mistakes = 2 stars
    })
  })
})
