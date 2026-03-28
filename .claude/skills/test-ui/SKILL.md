---
name: test-ui
description: Test the app UI using Playwright MCP. Navigates pages, interacts with elements, takes screenshots, and flags issues.
argument-hint: "[area-to-test or 'all']"
---

# UI Testing with Playwright MCP

Test the Anchy-English application using the Playwright MCP browser tools.

## Setup

The dev server must be running (`make dev`) before invoking this skill.
Check with: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173`

If not running, start it with `make dev` in the background, then wait a few seconds for it to be ready.

## Screenshots

Save all screenshots to `/tmp/playwright-screenshots/` (create if needed). Never save screenshots to the project root or any tracked directory.

## Testing approach

Use the Playwright MCP tools interactively:

1. `mcp__playwright__browser_navigate` - Navigate to pages
2. `mcp__playwright__browser_snapshot` - Get accessible page structure (preferred for finding elements)
3. `mcp__playwright__browser_take_screenshot` - Visual verification (save to `/tmp/playwright-screenshots/`)
4. `mcp__playwright__browser_click` - Click elements (use `ref` from snapshot)
5. `mcp__playwright__browser_type` - Type into inputs (use `slowly: true` for character-by-character input)
6. `mcp__playwright__browser_press_key` - Press keys like Backspace, Enter, Tab
7. `mcp__playwright__browser_fill_form` - Fill multiple form fields at once
8. `mcp__playwright__browser_evaluate` - Run JS in the page (useful for checking API responses)
9. `mcp__playwright__browser_console_messages` - Check for JS errors/warnings

## What to test

Based on the `$ARGUMENTS` argument:

- **worksheets** or **word-practice**: Test `/word-practice` list and `/worksheets/:id?practice=true` solve flow (letter input, completion, reset, show answers, navigation)
- **exercises**: Test `/exercise-sets` list and `/exercise-sets/:id/practice` flow
- **admin**: Test `/admin` worksheet/category/exercise CRUD
- **all** (or no argument): Test all of the above

## Test checklist for each area

### Worksheets / Word Practice
- [ ] Word practice list loads with categories and worksheet links
- [ ] Worksheet solve page shows Slovene words with letter input boxes
- [ ] Typing correct letters advances to next box and shows green
- [ ] Typing wrong letters shows red feedback
- [ ] Backspace clears and moves back
- [ ] Completing all words shows success message and confetti
- [ ] "Ponovi" (Reset) clears all inputs
- [ ] "Prikazi odgovore" (Show answers) reveals correct answers
- [ ] Progress bar updates correctly
- [ ] Speaker button exists for each word
- [ ] Navigation links go to correct destinations

### Exercise Sets
- [ ] Exercise set list loads with cards showing title, description, exercise count
- [ ] Clicking a set navigates to practice page
- [ ] Fill-in-the-blank exercises render with blanks
- [ ] Submitting correct/wrong answers gives feedback
- [ ] Navigation back to list works

### Admin
- [ ] Admin layout loads at /admin
- [ ] Worksheet list/create/edit works
- [ ] Category management works
- [ ] Exercise set management works

## Reporting

After testing, provide a summary with:
- Issues found (numbered, with description and severity)
- What works correctly
- Screenshots of any visual bugs (saved to /tmp/playwright-screenshots/)
