# Salary Compensation & Settings Close Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Close Settings" button label when settings is open, a nett salary input in settings, and a green compensation result box that appears after conversion.

**Architecture:** Three files change in sequence — HTML adds new elements, CSS styles them, JS wires up the logic. No new files needed. The compensation box mirrors the existing result-container pattern.

**Tech Stack:** Vanilla HTML, CSS, JavaScript. No build step. Manual browser verification.

---

### Task 1: Update `index.html` — salary input + compensation box

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the nett salary section inside `#settingsView`**

In `index.html`, find the closing `</div>` of the `.settings-section` block for "Custom Working Day" (currently line 35, `</div>` that closes `.settings-section`). Add a new `.settings-section` block **after** it, before the closing `</div>` of `#settingsView`:

```html
        <div class="settings-section">
          <h2 class="settings-section-title">Nett Salary</h2>
          <div>
            <label for="nettSalary">Nett Salary (€):</label>
            <input type="number" id="nettSalary" value="2000" min="0" />
          </div>
        </div>
```

The `#settingsView` block should now look like:

```html
      <div id="settingsView" style="display: none;">
        <div class="settings-section">
          <h2 class="settings-section-title">Custom Working Day</h2>
          <div class="input-row">
            <div>
              <label for="workHours">Hours:</label>
              <input type="number" id="workHours" value="7" min="0" />
            </div>
            <div>
              <label for="workMinutes">Minutes:</label>
              <input type="number" id="workMinutes" value="42" min="0" max="59" />
            </div>
          </div>
        </div>
        <div class="settings-section">
          <h2 class="settings-section-title">Nett Salary</h2>
          <div>
            <label for="nettSalary">Nett Salary (€):</label>
            <input type="number" id="nettSalary" value="2000" min="0" />
          </div>
        </div>
      </div>
```

- [ ] **Step 2: Add the compensation result box after `#result`**

Find this line in `#converterView`:
```html
        <div id="result" class="result-container"></div>
```

Add the compensation box immediately after it:
```html
        <div id="result" class="result-container"></div>
        <div id="compensation" class="compensation-container">
          <div id="compensationLabel" class="compensation-label"></div>
          <div id="compensationValue" class="compensation-value"></div>
        </div>
```

- [ ] **Step 3: Verify by reading the file**

Confirm:
- `#nettSalary` input exists inside `#settingsView`
- `#compensation`, `#compensationLabel`, `#compensationValue` exist after `#result`
- No existing elements were moved or removed

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add salary input and compensation result box to HTML"
```

---

### Task 2: Update `css/style.css` — compensation box styles

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Add `.compensation-container`, `.compensation-label`, `.compensation-value` after `.result-container:hover`**

Find the `.result-container:hover` rule (currently ends around line 107). Add immediately after it:

```css
.compensation-container {
    display: none;
    margin-top: 1rem;
    padding: 1.5rem;
    background: #98FF98;
    border: 4px solid #000000;
    border-radius: 0;
    font-weight: 900;
    color: #000000;
    text-align: center;
    box-shadow: 8px 8px 0px #000000;
    transition: all 0.2s ease;
}
.compensation-container:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px #000000;
}
.compensation-label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    opacity: 0.8;
}
.compensation-value {
    font-size: 1.6rem;
    letter-spacing: -0.5px;
}
```

- [ ] **Step 2: Add mobile overrides inside `@media (max-width: 768px)`**

Find the `.result-container` mobile override block (around line 243). Add after the `.result-container:hover` mobile override:

```css
    .compensation-container {
        padding: 1.2rem;
        border-width: 3px;
        box-shadow: 6px 6px 0px #000000;
    }

    .compensation-container:hover {
        box-shadow: 8px 8px 0px #000000;
    }

    .compensation-value {
        font-size: 1.3rem;
    }
```

- [ ] **Step 3: Add override inside `@media (max-width: 480px)`**

Find the `.result-container` 480px override. Add after it:

```css
    .compensation-container {
        padding: 1rem;
    }

    .compensation-value {
        font-size: 1.1rem;
    }
```

- [ ] **Step 4: Verify by reading the file**

Confirm:
- `.compensation-container` has `display: none` and `background: #98FF98`
- Mobile overrides exist in both media query blocks

- [ ] **Step 5: Commit**

```bash
git add css/style.css
git commit -m "feat: add compensation box styles"
```

---

### Task 3: Update `js/script.js` — all logic

**Files:**
- Modify: `js/script.js`

- [ ] **Step 1: Update `toggleSettings()` to relabel the button**

Current `toggleSettings()`:
```javascript
function toggleSettings() {
    const settingsView = document.getElementById('settingsView');
    const converterView = document.getElementById('converterView');
    const settingsButton = document.getElementById('settingsButton');
    settingsOpen = !settingsOpen;
    settingsView.style.display = settingsOpen ? 'block' : 'none';
    converterView.style.display = settingsOpen ? 'none' : 'block';
    settingsButton.classList.toggle('active', settingsOpen);
}
```

Replace with:
```javascript
function toggleSettings() {
    const settingsView = document.getElementById('settingsView');
    const converterView = document.getElementById('converterView');
    const settingsButton = document.getElementById('settingsButton');
    settingsOpen = !settingsOpen;
    settingsView.style.display = settingsOpen ? 'block' : 'none';
    converterView.style.display = settingsOpen ? 'none' : 'block';
    settingsButton.classList.toggle('active', settingsOpen);
    settingsButton.textContent = settingsOpen ? 'Close Settings' : '⚙ Settings';
}
```

- [ ] **Step 2: Update `loadSettings()` to restore nett salary**

Current `loadSettings()`:
```javascript
function loadSettings() {
    const storedSettings = localStorage.getItem(settingsKey);
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        document.getElementById('workHours').value = settings.workHours || 7;
        document.getElementById('workMinutes').value = settings.workMinutes || 42;
        // In the future, load additional settings here
    }
}
```

Replace with:
```javascript
function loadSettings() {
    const storedSettings = localStorage.getItem(settingsKey);
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        document.getElementById('workHours').value = settings.workHours || 7;
        document.getElementById('workMinutes').value = settings.workMinutes || 42;
        document.getElementById('nettSalary').value = settings.nettSalary !== undefined ? settings.nettSalary : 2000;
    }
}
```

- [ ] **Step 3: Update `saveSettings()` to persist nett salary**

Current `saveSettings()`:
```javascript
function saveSettings() {
    const settings = {
        workHours: parseInt(document.getElementById('workHours').value) || 7,
        workMinutes: parseInt(document.getElementById('workMinutes').value) || 42,
        // In the future, add additional settings here
    };
    localStorage.setItem(settingsKey, JSON.stringify(settings));
}
```

Replace with:
```javascript
function saveSettings() {
    const settings = {
        workHours: parseInt(document.getElementById('workHours').value) || 7,
        workMinutes: parseInt(document.getElementById('workMinutes').value) || 42,
        nettSalary: parseFloat(document.getElementById('nettSalary').value) || 0,
    };
    localStorage.setItem(settingsKey, JSON.stringify(settings));
}
```

- [ ] **Step 4: Add `showCompensation()` helper function**

Add this new function after `toggleSettings()` and before `switchMode()`:

```javascript
function showCompensation(exactDays) {
    const salary = parseFloat(document.getElementById('nettSalary').value) || 0;
    const compensationElem = document.getElementById('compensation');
    const labelElem = document.getElementById('compensationLabel');
    const valueElem = document.getElementById('compensationValue');

    if (salary <= 0) {
        compensationElem.style.display = 'none';
        return;
    }

    const dailyRate = salary / 22;
    const compensation = dailyRate * exactDays;

    labelElem.textContent = `Compensation (€${dailyRate.toFixed(2)} / day)`;
    valueElem.textContent = `€${compensation.toFixed(2)}`;
    compensationElem.style.display = 'block';
    compensationElem.style.opacity = 0;
    setTimeout(() => { compensationElem.style.opacity = 1; }, 100);
}
```

- [ ] **Step 5: Update `calculate()` to call `showCompensation()`**

Current `calculate()` result section for `toDays` mode (around lines 58–67):
```javascript
    if (currentMode === 'toDays') {
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const totalMinutes = hours * 60 + minutes;
        const days = Math.floor(totalMinutes / workDayMinutes);
        const remainingMinutes = totalMinutes % workDayMinutes;
        const remHours = Math.floor(remainingMinutes / 60);
        const remMinutes = remainingMinutes % 60;

        resultText = `${hours}h ${minutes}m = ${days} days, ${remHours}h ${remMinutes}m`;
    } else if (currentMode === 'toHours') {
        const days = parseFloat(document.getElementById('days').value) || 0;
        const totalMinutes = days * workDayMinutes;
        const totalHours = Math.floor(totalMinutes / 60);
        const remMinutes = Math.round(totalMinutes % 60);

        resultText = `${days} working days = ${totalHours}h ${remMinutes}m`;
    }
```

Replace with:
```javascript
    let exactDays = 0;
    if (currentMode === 'toDays') {
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const totalMinutes = hours * 60 + minutes;
        const days = Math.floor(totalMinutes / workDayMinutes);
        const remainingMinutes = totalMinutes % workDayMinutes;
        const remHours = Math.floor(remainingMinutes / 60);
        const remMinutes = remainingMinutes % 60;
        exactDays = days + remainingMinutes / workDayMinutes;

        resultText = `${hours}h ${minutes}m = ${days} days, ${remHours}h ${remMinutes}m`;
    } else if (currentMode === 'toHours') {
        const days = parseFloat(document.getElementById('days').value) || 0;
        const totalMinutes = days * workDayMinutes;
        const totalHours = Math.floor(totalMinutes / 60);
        const remMinutes = Math.round(totalMinutes % 60);
        exactDays = days;

        resultText = `${days} working days = ${totalHours}h ${remMinutes}m`;
    }
```

Then after the existing result display block (the `setTimeout` call), add:
```javascript
    showCompensation(exactDays);
```

- [ ] **Step 6: Hide compensation box on mode switch**

In `switchMode()`, find where the result element is cleared:
```javascript
    const resultElem = document.getElementById('result');
    resultElem.textContent = '';
    resultElem.style.display = 'none';
```

Add one line after it:
```javascript
    document.getElementById('compensation').style.display = 'none';
```

- [ ] **Step 7: Add event listener for nett salary input**

At the bottom of the file, find:
```javascript
document.getElementById('workHours').addEventListener('input', saveSettings);
document.getElementById('workMinutes').addEventListener('input', saveSettings);
// In the future, add listeners for additional settings here
```

Replace with:
```javascript
document.getElementById('workHours').addEventListener('input', saveSettings);
document.getElementById('workMinutes').addEventListener('input', saveSettings);
document.getElementById('nettSalary').addEventListener('input', saveSettings);
```

- [ ] **Step 8: Verify the full script.js is correct**

Read the file and confirm:
- `toggleSettings()` sets `textContent` to `'Close Settings'` or `'⚙ Settings'`
- `loadSettings()` reads `settings.nettSalary` with fallback to `2000`
- `saveSettings()` writes `nettSalary` using `parseFloat`
- `showCompensation(exactDays)` exists and uses `salary / 22`
- `calculate()` computes `exactDays` in both modes and calls `showCompensation(exactDays)`
- `switchMode()` hides `#compensation`
- Event listener for `nettSalary` is present

- [ ] **Step 9: Commit**

```bash
git add js/script.js
git commit -m "feat: add settings close label, salary persistence, and compensation calculation"
```

---

### Task 4: Browser verification

**Files:** None — verification only.

- [ ] **Step 1: Serve and open the app**

```bash
cd /Users/andrey/SideProjects/zeit
python3 -m http.server 8765
```

Open `http://localhost:8765` in a browser.

- [ ] **Step 2: Verify settings close label**

1. Page loads → button reads `⚙ Settings` (cyan)
2. Click the button → it reads `Close Settings` (purple, yellow text)
3. Click again → back to `⚙ Settings` (cyan)

- [ ] **Step 3: Verify salary persists**

1. Click `⚙ Settings` → salary input shows `2000`
2. Change salary to `3000`
3. Reload the page → salary input still shows `3000`

- [ ] **Step 4: Verify compensation — toDays mode**

1. Hours & Minutes → Working Days tab active
2. Enter `100` hours, `0` minutes, click Convert
3. Pink box shows `100H 0M = 12 DAYS, 3H 42M`
4. Green box shows:
   - Label: `COMPENSATION (€136.36 / DAY)` (3000 / 22 = 136.36...)
   - Value: `€1701.54` (136.36... × 12 + 222/462)

   *(If salary is still 2000: label `€90.91 / DAY`, value `€1134.36`)*

- [ ] **Step 5: Verify compensation — toHours mode**

1. Switch to Working Days → Hours & Minutes tab
2. Enter `5` days, click Convert
3. Green box shows:
   - Label: `COMPENSATION (€136.36 / DAY)`
   - Value: `€681.82` (136.36... × 5)

- [ ] **Step 6: Verify salary = 0 hides compensation**

1. Open settings, set salary to `0`
2. Click Convert
3. Green compensation box does NOT appear

- [ ] **Step 7: Verify mode switch clears compensation**

1. Convert in toDays mode → green box appears
2. Click the toHours tab → green box disappears

- [ ] **Step 8: Kill the server**

```bash
pkill -f "python3 -m http.server 8765"
```

- [ ] **Step 9: Commit if any fixes were made, skip if none**

```bash
git add -p
git commit -m "fix: browser verification fixes"
```
