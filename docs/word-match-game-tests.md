# Word Match Game — Test Plan

## Philosophy

All game logic accepts plain data — no backend, no mocking, no component mounting for the core tests. A test creates words inline and calls the composable directly:

```js
const words = [
  { id: 1, english: 'cat', slovene: 'mačka' },
  { id: 2, english: 'dog', slovene: 'pes' },
  { id: 3, english: 'house', slovene: 'hiša' },
]
const game = useMatchGame(words, 3)
game.startGame()
game.selectCard(game.englishCards.value[0])
game.selectCard(game.sloveneCards.value[1])
// assert state...
```

This pattern applies to any future game — write a composable that takes data, test it without a browser.

## Setup Required

```bash
cd anchy-english-vue
pnpm add -D vitest happy-dom
```

Add to `package.json`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Add `vitest.config.js`:
```js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  }
})
```

## Test files

### `src/__tests__/gameUtils.test.js` — Pure functions

```
sampleWords(words, n)
  ✓ returns exactly n pairs when words.length >= n
  ✓ returns all words when words.length < n
  ✓ returned pairs are a subset of input
  ✓ no duplicate pairs in result
  ✓ empty input → empty output
  ✓ n=0 → empty output

shuffleArray(arr)
  ✓ same length, same elements
  ✓ does not mutate original
  ✓ empty array → empty array
  ✓ single element → same element

getStarRating(mistakes)
  ✓ 0 → 3
  ✓ 1 → 2
  ✓ 2 → 2
  ✓ 3 → 1
  ✓ 99 → 1

formatTime(seconds)
  ✓ 0 → "0:00"
  ✓ 59 → "0:59"
  ✓ 60 → "1:00"
  ✓ 125 → "2:05"
```

### `src/__tests__/useMatchGame.test.js` — Game state machine

All tests use a helper:
```js
function makeWords(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    english: `word${i + 1}`,
    slovene: `beseda${i + 1}`,
  }))
}
```

#### Setup phase
```
  ✓ initial gamePhase is 'setup'
  ✓ startGame() transitions to 'playing'
  ✓ creates englishCards and sloveneCards with correct count
  ✓ cards have column='en' and column='sl' respectively
  ✓ all cards start with matched=false, matchState='neutral'
  ✓ mistakes, streak, matchedPairs all start at 0
```

#### Selection
```
  ✓ selectCard sets selectedCard
  ✓ selecting same card deselects (selectedCard → null)
  ✓ selecting card in same column switches selection
  ✓ selecting card in other column triggers match check
  ✓ cannot select a matched card
  ✓ selectCard ignored when gamePhase !== 'playing'
  ✓ selectCard ignored when locked=true
```

#### Correct match
```
  ✓ matching pair: both cards get matchState='correct'
  ✓ after 400ms: both cards matched=true, matchState='neutral'
  ✓ matchedPairs increments
  ✓ streak increments
  ✓ bestStreak updates when streak exceeds it
  ✓ selectedCard clears
  ✓ locked clears after 400ms
```

#### Wrong match
```
  ✓ non-matching pair: both cards get matchState='wrong'
  ✓ after 600ms: both cards matchState='neutral', matched still false
  ✓ mistakes increments
  ✓ streak resets to 0
  ✓ bestStreak unchanged
  ✓ selectedCard clears
  ✓ locked clears after 600ms
```

#### Completion
```
  ✓ matching last pair transitions gamePhase to 'completed'
  ✓ timer stops (elapsedTime frozen)
  ✓ starRating computed correctly from final mistakes
```

#### Restart
```
  ✓ restart() resets gamePhase to 'setup'
  ✓ clears cards, scores, timer
  ✓ can startGame() again after restart
```

#### Timer
```
  ✓ elapsedTime increments during 'playing' (advance with vi.advanceTimersByTime)
  ✓ does not increment during 'setup'
  ✓ stops incrementing after 'completed'
  ✓ cleanup() stops the interval
```

#### Full game scenario
```
  ✓ play a complete 3-pair game: start → match all → completed with correct stats
  ✓ play with mistakes: 2 wrong + 3 correct → mistakes=2, bestStreak=3, stars=2
```

## What we don't test

- CSS animations / transitions — manual QA
- Actual randomness distribution — only test invariants (length, uniqueness, same elements)
- Component rendering — logic is in composable, components are thin
- API fetching — view responsibility, covered by existing backend tests
