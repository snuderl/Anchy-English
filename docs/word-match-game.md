# Word Match Game — Spec

## Overview

A timed memory-style matching game where students connect English words to their Slovene translations. Words are displayed as cards in a grid — tap/click an English card, then tap/click the matching Slovene card. Correct pairs disappear with a satisfying animation. Goal: clear the board as fast as possible.

## Entry Points

- **From worksheet**: `/worksheets/:id/match` — uses words from that worksheet
- **Navigation**: Accessible via a "🎮 Match Game" button on the public worksheet list and on the worksheet solve view

## Game Flow

### 1. Setup Screen

- Shows worksheet name and word count
- Player picks how many pairs to play: **6** (easy), **8** (medium), or **10** (hard)
  - If the worksheet has fewer words than selected, use all available words
- Words are randomly sampled from the worksheet (no duplicates)
- **"Start"** button begins the game

### 2. Playing

**Board layout:**
- Two columns: **English** (left) and **Slovene** (right)
- Words in each column are independently shuffled — positions don't correspond
- Each word is a card/button with a neutral style

**Interaction:**
1. Player taps a card in either column → it highlights (selected state, blue border)
2. Player taps a card in the **other** column → pair is checked
3. Tapping a card in the **same** column as the already-selected card → switches selection
4. Tapping the already-selected card → deselects it

**Matching logic (client-side):**
- Compare the selected English word's `id` with the selected Slovene word's `id`
- If match: both cards animate out (scale down + fade, ~400ms), then are removed from the board
- If no match: both cards flash red briefly (shake animation, ~600ms), then return to neutral state. Mistake counter increments.

**During play:**
- **Timer** counts up from 0:00 (mm:ss format), displayed prominently
- **Pairs remaining** counter: `"3 / 8 pairs matched"`
- **Mistakes** counter
- **Streak counter** (consecutive correct matches, reuses `StreakCounter` component)

### 3. Completion

When all pairs are matched:
- Timer stops
- **ConfettiAnimation** fires
- Summary card shows:
  - ⏱️ Time taken
  - ✅ Pairs matched
  - ❌ Mistakes made
  - 🔥 Best streak
  - ⭐ Star rating (see below)
- Buttons: **"Play Again"** (re-shuffles same words), **"New Difficulty"** (back to setup), **"Back to Worksheets"**

**Star rating:**
| Mistakes | Stars |
|----------|-------|
| 0 | ⭐⭐⭐ |
| 1-2 | ⭐⭐ |
| 3+ | ⭐ |

## Visual Design

- Follows existing Tailwind patterns: `bg-white dark:bg-gray-800`, rounded-lg, shadow-sm
- Cards: `px-4 py-3`, `rounded-lg`, `text-lg font-medium`, `cursor-pointer`
- Card states:
  - **Neutral**: `bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700`
  - **Selected**: `bg-blue-100 dark:bg-blue-800 border-2 border-blue-500 ring-2 ring-blue-300`
  - **Correct** (briefly before removal): `bg-green-100 dark:bg-green-800 border-2 border-green-500`
  - **Wrong** (briefly): `bg-red-100 dark:bg-red-800 border-2 border-red-500` + shake
  - **Matched/gone**: `opacity-0 scale-75` transition then `hidden`
- Mobile: columns stack or use a smaller font size; cards remain tappable (min 44px touch target)
- Uses `PublicHeader` at top, consistent with other public views

## Architecture

### Design Principle: Data-in, logic separated

All game logic lives in a **composable** and **pure utility functions** that accept plain data. Views are responsible for fetching data and passing it in. This means:

- Games can be tested with trivial inline data — no backend, no mocking
- The same composable could power different entry points (e.g. worksheet words, random words, exercise words)
- Adding a new game means: write a composable + utils, test them, then wrap in a view

### File Structure

```
src/
  composables/
    useMatchGame.js          ← game state machine, accepts words array
  utils/
    gameUtils.js             ← pure functions: sampleWords, shuffleArray, getStarRating, formatTime
  components/
    MatchCard.vue            ← stateless card, receives props for display state
  views/
    WordMatchGame.vue        ← fetches worksheet, passes words to useMatchGame
  __tests__/
    gameUtils.test.js        ← pure function tests
    useMatchGame.test.js     ← composable tests (no component mounting needed)
```

### `gameUtils.js` — Pure functions

```js
sampleWords(words, n)    // pick n random pairs from words array, returns subset
shuffleArray(arr)        // Fisher-Yates shuffle, returns new array (no mutation)
getStarRating(mistakes)  // 0 → 3, 1-2 → 2, 3+ → 1
formatTime(seconds)      // 65 → "1:05"
```

### `useMatchGame(words, pairCount)` — Composable

Takes an array of `{id, english, slovene}` objects and a pair count. Returns reactive state and actions. **No fetching, no route access, no side effects beyond a timer interval.**

**Input contract:**
```js
const words = [
  { id: 1, english: 'cat', slovene: 'mačka' },
  { id: 2, english: 'dog', slovene: 'pes' },
  // ...
]
const game = useMatchGame(words, 6)
```

**Returned state:**
```js
{
  // Reactive state
  gamePhase,        // 'setup' | 'playing' | 'completed'
  englishCards,     // ref([{ id, text, column: 'en', matched, matchState }])
  sloveneCards,     // ref([{ id, text, column: 'sl', matched, matchState }])
  selectedCard,     // ref(card | null)
  matchedPairs,     // ref(number)
  totalPairs,       // ref(number)
  mistakes,         // ref(number)
  streak,           // ref(number)
  bestStreak,       // ref(number)
  elapsedTime,      // ref(number) — seconds
  starRating,       // computed(number) — derived from mistakes
  locked,           // ref(boolean) — true during match animation, blocks input

  // Actions
  startGame(),      // transition setup → playing, create cards, start timer
  selectCard(card), // handle card tap (select, deselect, switch, or check match)
  restart(),        // back to setup, clear everything
  cleanup(),        // stop timer interval (call in onUnmounted)
}
```

**Card object shape:**
```js
{
  id: 1,                  // translation.id — used for match comparison
  text: 'cat',            // display text
  column: 'en',           // 'en' | 'sl'
  matched: false,         // permanently true after correct match
  matchState: 'neutral',  // 'neutral' | 'selected' | 'correct' | 'wrong'
}
```

**`selectCard(card)` logic:**
1. If `locked` or `gamePhase !== 'playing'` or `card.matched` → return
2. If no card selected → select this card
3. If same card → deselect
4. If same column → switch selection
5. If different column → check match:
   - Set `locked = true`
   - If `card.id === selectedCard.id` → correct match flow
   - Else → wrong match flow

**Correct match flow:**
1. Set both cards `matchState = 'correct'`
2. After 400ms: set both `matched = true`, `matchState = 'neutral'`
3. Increment `matchedPairs`, `streak`, maybe `bestStreak`
4. Clear `selectedCard`, set `locked = false`
5. If `matchedPairs === totalPairs` → transition to `'completed'`, stop timer

**Wrong match flow:**
1. Set both cards `matchState = 'wrong'`
2. After 600ms: set both `matchState = 'neutral'`
3. Increment `mistakes`, reset `streak` to 0
4. Clear `selectedCard`, set `locked = false`

### `WordMatchGame.vue` — View (thin wrapper)

Responsibilities:
1. Read route param, call `getWorksheet(id)`
2. Pass `worksheet.words` + difficulty to `useMatchGame`
3. Render setup/playing/completed screens using composable state
4. Call `game.cleanup()` in `onUnmounted`

### `MatchCard.vue` — Component (stateless)

Props: `text`, `column`, `matched`, `matchState`, `selected`
Emits: `select`

Renders a `<button>` with Tailwind classes based on props. No logic.

### Router Addition

```js
{
  path: '/worksheets/:id/match',
  name: 'word-match',
  component: WordMatchGame
}
```

### No new API endpoints

Everything is client-side. Uses existing `getWorksheet(id)` to fetch word data.

## Accessibility

- Cards are `<button>` elements with `aria-label="English: cat"` / `aria-label="Slovene: mačka"`
- Selected state uses `aria-pressed="true"`
- Matched cards get `aria-hidden="true"`
- Timer is a `<time>` element with `aria-live="off"` (not announced continuously)
- Keyboard: Tab to navigate cards, Enter/Space to select

## Animations

- **Match found**: cards get `transition-all duration-400` → `opacity-0 scale-75`, removed after transition
- **Wrong match**: CSS `animate-shake` (reuse from WordDisplay) + red flash for 600ms
- **Card select**: `transition-all duration-150` for snappy highlight
- **Completion**: existing `ConfettiAnimation` component
