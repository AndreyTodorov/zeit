# Salary Compensation & Settings Close Design

**Date:** 2026-03-26
**Status:** Approved
**Branch:** feature/settings-tab

## Overview

Two improvements to the working time converter:

1. Make the settings panel easier to close by relabeling the header button.
2. Add a nett salary input in settings and show a compensation result box after conversion.

---

## Feature 1 — Settings Close Affordance

### Behavior

The `⚙ Settings` header button changes its label based on state:

| State | Label | Style |
|-------|-------|-------|
| Settings closed | `⚙ Settings` | Cyan `#00D9FF`, black text |
| Settings open | `Close Settings` | Purple `#9945FF`, yellow `#FFE500` text |

The active styling already exists (`.settings-button.active`). Only the button text needs to change on toggle.

### Implementation

In `js/script.js`, `toggleSettings()` sets `settingsButton.textContent` alongside the existing class toggle:
- Opening: `settingsButton.textContent = 'Close Settings'`
- Closing: `settingsButton.textContent = '⚙ Settings'`

**Files changed:** `js/script.js` only.

---

## Feature 2 — Nett Salary & Compensation

### Settings Panel

A new section "Nett Salary" is added below the existing "Custom Working Day" section in `#settingsView`:

```
NETT SALARY
[ € 2000 ]
```

- Single number input, `id="nettSalary"`, default value `2000`, min `0`
- Label: `Nett Salary (€)`
- Persists to localStorage under the existing `workingTimeSettings` key alongside `workHours` and `workMinutes`
- `saveSettings()` and `loadSettings()` updated to include `nettSalary`
- Event listener added to save on input change

### Result Area

After a successful conversion where salary > 0, a second result box appears below the existing pink result box:

**Green box** (`background: #98FF98`, same border/shadow style as the pink box):
- **Label line:** `COMPENSATION (€{dailyRate} / day)` — daily rate = `salary / 22`, rounded to 2 decimal places
- **Value line:** `€{compensation}` — formatted to 2 decimal places

### Compensation Formula

**`toDays` mode** (input: hours + minutes):
```
exactDays = fullDays + remainingMinutes / workDayMinutes
compensation = (salary / 22) × exactDays
```

Where:
- `fullDays` = `Math.floor(totalInputMinutes / workDayMinutes)`
- `remainingMinutes` = `totalInputMinutes % workDayMinutes`

**`toHours` mode** (input: days):
```
exactDays = parseFloat(daysInput)
compensation = (salary / 22) × exactDays
```

### Display Rules

- The green compensation box is shown only when salary > 0 AND a conversion result exists.
- If salary is 0 or the salary input is empty, the compensation box is hidden.
- The compensation box is hidden/reset whenever the result is cleared (e.g., on mode switch).

### Formatting

- Daily rate: `€{value}` rounded to 2 decimal places (e.g. `€90.91`)
- Compensation: `€{value}` rounded to 2 decimal places (e.g. `€1134.59`) — no thousands separator

---

## Files to Change

| File | Change |
|------|--------|
| `index.html` | Add nett salary input section in `#settingsView`; add `#compensation` result box after `#result` |
| `css/style.css` | Add `.compensation-container` styles (green box, same pattern as `.result-container`) |
| `js/script.js` | Update `toggleSettings()` for button text; update `saveSettings()`/`loadSettings()` for salary; update `calculate()` to compute and show compensation; add event listener for salary input |

---

## Out of Scope

- Currency selection (always Euro)
- Configurable number of working days per month (always 22)
- Thousands separator in compensation output
