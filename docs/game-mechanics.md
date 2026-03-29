# Game & Exercise Mechanics

## Two Practice Modes

### 1. Word Practice (letter-by-letter spelling)

**Route:** `/word-practice` -> select worksheet -> `/worksheets/:id?practice=true`

**How it works:**
- Student sees a Slovene word and must spell the English translation letter by letter
- One input box per character, auto-advances on any input
- **Case-insensitive** - input auto-corrects to target case
- Spaces/special chars are shown but skipped
- Arrow keys and backspace for navigation

**Feedback:**
- Green border + pulse animation on correct letter
- Red border + shake animation on wrong letter
- Green checkmark when a word is complete
- Audio button (Web Speech API, `en-US`, 0.8x speed)

**Hint system:**
- After 3 seconds of inactivity, a bouncing lightbulb appears
- Click it to auto-fill the current character
- Hint usage is counted and displayed

**Completion:**
- Progress bar shows words completed / total
- When all words done: confetti animation + success message
- Can repeat (reset) or go back to list
- A "word perfect" = completed with zero errors and zero hints

### 2. Fill-in-the-Blank Exercises

**Route:** `/exercise-sets` -> select set -> `/exercise-sets/:id/practice`

**How it works:**
- Exercises are **shuffled** (Fisher-Yates) on load
- A sentence is shown with a `_____` blank
- A **word bank** (all missing words from the set, shuffled) is shown as clickable buttons
- Student clicks a word to fill the blank

**Validation:**
- **Server-side** via `POST /api/exercises/validate` (case-insensitive)
- Correct: green feedback, "Next Exercise" button
- Incorrect: red feedback, shows correct answer + Slovene hint, offers "Try Again" or "Next"

**Completion:**
- Stats grid: total, correct, incorrect, accuracy %, best streak
- Can "Practice Again" (re-shuffles) or go back

## Streak System

**Word Practice** uses the shared `useStreak` composable (localStorage-persisted):
- `letterStreak` - consecutive correct letters (resets on any wrong letter)
- `wordStreak` - consecutive perfect words (resets on wrong letter too)
- Best streaks persist forever

**Fill-in-the-Blank** has its own local streak (resets on restart):
- `currentStreak` / `bestStreak` for consecutive correct answers

**StreakCounter component** shows dynamic icons and milestone badges:

| Range | Icon | Badge |
|-------|------|-------|
| 0 | - | - |
| 1-9 | sparkles | - |
| 10-19 | fire | GOOD! |
| 20-49 | fire | NICE! |
| 50-99 | lightning | ON FIRE! |
| 100-499 | lightning | AMAZING! |
| 500+ | star | LEGENDARY! |

## Notable Design Decisions

- Word practice validation is **client-side**; fill-in-the-blank is **server-side**
- Worksheet words are shown **in order**; exercises are **shuffled**
- The two streak systems are **independent** (composable vs local state)
- No persistent scoring - only streaks are saved to localStorage
- "Show Answers" toggle exists for worksheet mode (non-practice viewing)
