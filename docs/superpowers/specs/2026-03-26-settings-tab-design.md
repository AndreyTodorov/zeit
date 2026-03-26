# Settings Tab Design

**Date:** 2026-03-26
**Status:** Approved

## Overview

Move the "Custom Working Day" form out of its current collapsible toggle and into a dedicated Settings view. The settings button lives in the top-right corner of the header and replaces the converter content when active. This creates a proper settings panel extensible for future settings.

## Current State

- A green "Customize Working Day" toggle button sits above the conversion tabs
- Clicking it shows/hides a collapsible panel with Hours and Minutes inputs
- Values are persisted to localStorage under the key `workingTimeSettings`

## Target State

### Layout

The container header shows the title and settings button on the same row:

```
[ Working Time Converter ]          [ ⚙ Settings ]
```

The `⚙ Settings` button uses the existing neobrutalism button style (green `#98FF98` background when inactive, purple `#9945FF` with white text when active — matching the active tab style).

### App States

**Converter state (default)**
- Settings button: inactive style
- Visible: conversion mode tabs, input fields, Convert button, result container
- Hidden: settings form

**Settings state**
- Settings button: active style (purple)
- Visible: settings form with "Custom Working Day" section (Hours + Minutes inputs)
- Hidden: conversion mode tabs, input fields, Convert button, result container

Toggling the Settings button switches between the two states. No separate Back button.

### Settings View

```
CUSTOM WORKING DAY
[ Hours: 7 ]  [ Minutes: 42 ]
```

Section heading is explicitly labeled so future settings sections can be added below it without structural changes.

### Removed Elements

- `.custom-toggle` button (the green "Customize Working Day" toggle)
- `#customSection` collapsible div (including its `display: none` default and `toggleCustom()` JS logic)

### Preserved Behavior

- Settings values persist to localStorage on input change (no change to `saveSettings` / `loadSettings` logic)
- `calculate()` still reads `workHours` and `workMinutes` by element ID — no change needed there

## Files to Change

| File | Change |
|------|--------|
| `index.html` | Replace toggle button + collapsible section with header row (title + settings button); add settings view panel |
| `css/style.css` | Add `.app-header` flex row style; add `.settings-view` styles; remove `.custom-toggle` and `.custom-section` styles |
| `js/script.js` | Add `toggleSettings()` function; remove `toggleCustom()` function |

## Out of Scope

- Adding new settings beyond "Custom Working Day"
- Any change to the conversion logic
- Any change to localStorage schema
