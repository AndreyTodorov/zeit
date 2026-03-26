# Settings Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the collapsible "Customize Working Day" toggle with a proper Settings view accessible via a ⚙ Settings button in the app header.

**Architecture:** The app gains a two-state model (converter / settings) toggled by a header button. The settings form lives in a always-present but conditionally visible `#settingsView` div; the converter content lives in `#converterView`. JS swaps visibility between the two. No routing, no framework.

**Tech Stack:** Vanilla HTML, CSS, JavaScript. No build step. Manual browser verification.

---

### Task 1: Create feature branch

**Files:**
- No file changes — git only

- [ ] **Step 1: Create and switch to the feature branch**

```bash
git checkout -b feature/settings-tab
```

Expected output: `Switched to a new branch 'feature/settings-tab'`

---

### Task 2: Update `index.html`

**Files:**
- Modify: `index.html`

Replace the `<h1>` + toggle button + collapsible section with a header row containing the title and Settings button, then wrap all converter content in `#converterView` and add a `#settingsView` div.

- [ ] **Step 1: Replace the heading, toggle button, and custom section**

The current block (lines 17–47) is:
```html
<h1>Working Time Converter</h1>

<button class="custom-toggle" onclick="toggleCustom()">
  Customize Working Day (Default: 7h 42m)
</button>
<div id="customSection" class="custom-section">
  <label>Custom Working Day</label>
  <div class="input-row">
    <div>
      <label for="workHours">Hours:</label>
      <input type="number" id="workHours" value="7" min="0" placeholder="Hours" />
    </div>
    <div>
      <label for="workMinutes">Minutes:</label>
      <input type="number" id="workMinutes" value="42" min="0" max="59" placeholder="Minutes" />
    </div>
  </div>
</div>
```

Replace it with:
```html
<div class="app-header">
  <h1>Working Time Converter</h1>
  <button class="settings-button" id="settingsButton" onclick="toggleSettings()">⚙ Settings</button>
</div>

<div id="settingsView" style="display: none;">
  <div class="settings-section">
    <label class="settings-section-title">Custom Working Day</label>
    <div class="input-row">
      <div>
        <label for="workHours">Hours:</label>
        <input type="number" id="workHours" value="7" min="0" placeholder="Hours" />
      </div>
      <div>
        <label for="workMinutes">Minutes:</label>
        <input type="number" id="workMinutes" value="42" min="0" max="59" placeholder="Minutes" />
      </div>
    </div>
  </div>
</div>

<div id="converterView">
```

- [ ] **Step 2: Close the `#converterView` div before `</div>` that closes `.container`**

The current closing structure (end of `<body>`) is:
```html
      <div id="result" class="result-container"></div>
    </div>
```

Replace with:
```html
      <div id="result" class="result-container"></div>
    </div> <!-- end #converterView -->
  </div>
```

The full updated `index.html` should look like:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Working Time Converter</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="css/style.css" />
  </head>
  <body>
    <div class="container">

      <div class="app-header">
        <h1>Working Time Converter</h1>
        <button class="settings-button" id="settingsButton" onclick="toggleSettings()">⚙ Settings</button>
      </div>

      <div id="settingsView" style="display: none;">
        <div class="settings-section">
          <label class="settings-section-title">Custom Working Day</label>
          <div class="input-row">
            <div>
              <label for="workHours">Hours:</label>
              <input type="number" id="workHours" value="7" min="0" placeholder="Hours" />
            </div>
            <div>
              <label for="workMinutes">Minutes:</label>
              <input type="number" id="workMinutes" value="42" min="0" max="59" placeholder="Minutes" />
            </div>
          </div>
        </div>
      </div>

      <div id="converterView">
        <div class="tab-buttons">
          <button class="tab-button active" onclick="switchMode('toDays')">
            Hours & Minutes → Working Days
          </button>
          <button class="tab-button" onclick="switchMode('toHours')">
            Working Days → Hours & Minutes
          </button>
        </div>

        <div id="hoursMinutesInputs">
          <label>Time to Convert</label>
          <div class="input-row">
            <div>
              <label for="hours">Hours:</label>
              <input type="number" id="hours" placeholder="Enter hours" />
            </div>
            <div>
              <label for="minutes">Minutes:</label>
              <input type="number" id="minutes" value="0" placeholder="Enter minutes" />
            </div>
          </div>
        </div>

        <div id="daysInput" style="display: none">
          <label for="days">Working Days:</label>
          <input type="number" id="days" step="0.01" placeholder="Enter working days" />
        </div>

        <button onclick="calculate()">Convert</button>
        <div id="result" class="result-container"></div>
      </div> <!-- end #converterView -->

    </div>

    <script src="js/script.js"></script>
  </body>
</html>
```

- [ ] **Step 3: Open `index.html` in a browser and verify**

- Page loads without errors
- Title "Working Time Converter" and "⚙ Settings" button appear side-by-side at the top
- Converter tabs and inputs are visible
- No "Customize Working Day" toggle button anywhere on the page

---

### Task 3: Update `css/style.css`

**Files:**
- Modify: `css/style.css`

Add styles for `.app-header`, `.settings-button` (inactive + active states), and `.settings-section`. Remove `.custom-toggle` and `.custom-section` styles.

- [ ] **Step 1: Replace `.custom-toggle` and `.custom-section` blocks with new styles**

Remove this block from `css/style.css` (lines 143–175):
```css
.custom-toggle {
    margin-bottom: 1.5rem;
    padding: 0.8rem;
    background: #98FF98;
    border: 4px solid #000000;
    border-radius: 0;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 700;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    color: #000000;
    box-shadow: 5px 5px 0px #000000;
    transition: all 0.1s ease;
}
.custom-toggle:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0px #000000;
}
.custom-toggle:active {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0px #000000;
}
.custom-section {
    display: none;
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: #FFF4CC;
    border: 4px solid #000000;
    border-radius: 0;
    box-shadow: 6px 6px 0px #000000;
}
```

And add in their place:
```css
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
}
.app-header h1 {
    margin-bottom: 0;
    text-align: left;
    font-size: 1.6rem;
}
.settings-button {
    margin-top: 0;
    padding: 0.6rem 1rem;
    background: #00D9FF;
    color: #000000;
    border: 4px solid #000000;
    border-radius: 0;
    font-size: 0.85rem;
    font-weight: 900;
    cursor: pointer;
    width: auto;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 4px 4px 0px #000000;
    transition: all 0.1s ease;
    white-space: nowrap;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    min-height: 44px;
}
.settings-button:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000000;
}
.settings-button:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000000;
}
.settings-button.active {
    background: #9945FF;
    color: #FFE500;
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000000;
}
.settings-section {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: #FFF4CC;
    border: 4px solid #000000;
    border-radius: 0;
    box-shadow: 6px 6px 0px #000000;
}
.settings-section-title {
    display: block;
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #000000;
}
```

- [ ] **Step 2: Update the mobile responsive block for `@media (max-width: 768px)`**

Remove the `.custom-toggle` and `.custom-section` mobile overrides and replace with equivalents for the new classes. Find this block in the `@media (max-width: 768px)` section:

```css
    .custom-toggle {
        padding: 0.7rem;
        font-size: 0.8rem;
        border-width: 3px;
        box-shadow: 4px 4px 0px #000000;
        margin-bottom: 1.2rem;
    }

    .custom-toggle:hover {
        box-shadow: 5px 5px 0px #000000;
    }

    .custom-section {
        padding: 1.2rem;
        border-width: 3px;
        box-shadow: 5px 5px 0px #000000;
        margin-bottom: 1.2rem;
    }
```

Replace with:
```css
    .app-header h1 {
        font-size: 1.2rem;
    }

    .settings-button {
        padding: 0.5rem 0.8rem;
        font-size: 0.75rem;
        border-width: 3px;
        box-shadow: 3px 3px 0px #000000;
    }

    .settings-section {
        padding: 1.2rem;
        border-width: 3px;
        box-shadow: 5px 5px 0px #000000;
        margin-bottom: 1.2rem;
    }
```

- [ ] **Step 3: Verify in browser**

- Header row looks correct at full width and on mobile (resize window to <768px)
- "⚙ Settings" button is cyan with black text, proper shadow
- No layout breakage

---

### Task 4: Update `js/script.js`

**Files:**
- Modify: `js/script.js`

Replace `toggleCustom()` with `toggleSettings()`. Update `loadSettings` and initialization.

- [ ] **Step 1: Replace `toggleCustom` with `toggleSettings`**

Remove:
```javascript
function toggleCustom() {
    const section = document.getElementById('customSection');
    const toggleButton = document.querySelector('.custom-toggle');
    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block';
        toggleButton.textContent = 'Hide Custom Working Day (Default: 7h 42m)';
    } else {
        section.style.display = 'none';
        toggleButton.textContent = 'Customize Working Day (Default: 7h 42m)';
    }
}
```

Replace with:
```javascript
function toggleSettings() {
    const settingsView = document.getElementById('settingsView');
    const converterView = document.getElementById('converterView');
    const settingsButton = document.getElementById('settingsButton');
    const isSettingsOpen = settingsView.style.display !== 'none';

    if (isSettingsOpen) {
        settingsView.style.display = 'none';
        converterView.style.display = 'block';
        settingsButton.classList.remove('active');
    } else {
        settingsView.style.display = 'block';
        converterView.style.display = 'none';
        settingsButton.classList.add('active');
    }
}
```

- [ ] **Step 2: Verify in browser — full interaction test**

1. Page loads → converter view is visible, settings view is hidden, button is cyan
2. Click "⚙ Settings" → converter hides, settings form appears, button turns purple with yellow text
3. Click "⚙ Settings" again → settings hides, converter reappears, button returns to cyan
4. Change hours/minutes in settings → values persist after switching back to converter and running a calculation
5. Reload the page → custom values are restored from localStorage

- [ ] **Step 3: Commit**

```bash
git add index.html css/style.css js/script.js
git commit -m "feat: move custom working day form to settings tab"
```

---

### Task 5: Mobile verification

**Files:**
- No code changes — verification only

- [ ] **Step 1: Open browser devtools and test at 390px width (iPhone)**

- Header row: title and settings button fit on one line without overflow
- Settings button is large enough to tap (min-height 44px)
- Settings form inputs are full-width and easy to tap
- Converter tabs still fit on one line

- [ ] **Step 2: Test at 480px width**

- No elements overflow the container
- All text is readable

- [ ] **Step 3: Commit if any CSS fixes were needed, skip if none**

```bash
git add css/style.css
git commit -m "fix: settings tab mobile layout adjustments"
```
