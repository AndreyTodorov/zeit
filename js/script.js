const settingsKey = 'workingTimeSettings'; // Key for localStorage, extensible for future settings

// Element references, resolved once (this script runs at the end of <body>)
const el = {
    workHours: document.getElementById('workHours'),
    workMinutes: document.getElementById('workMinutes'),
    nettSalary: document.getElementById('nettSalary'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    days: document.getElementById('days'),
    result: document.getElementById('result'),
    compensation: document.getElementById('compensation'),
    compensationLabel: document.getElementById('compensationLabel'),
    compensationValue: document.getElementById('compensationValue'),
    settingsView: document.getElementById('settingsView'),
    converterView: document.getElementById('converterView'),
    settingsButton: document.getElementById('settingsButton'),
    hoursMinutesInputs: document.getElementById('hoursMinutesInputs'),
    daysInput: document.getElementById('daysInput'),
};

let currentMode = 'toDays';
let settingsOpen = false;

// parseFloat with a fallback that only kicks in for blank/invalid input (0 is a valid value)
function numOr(value, fallback) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
}

function pluralize(count, word) {
    return `${count} ${count === 1 ? word : word + 's'}`;
}

// Length of the configured working day, in whole minutes
function workDayMinutes() {
    const hours = Math.max(0, numOr(el.workHours.value, 7));
    const minutes = Math.max(0, numOr(el.workMinutes.value, 42));
    return Math.round(hours * 60 + minutes);
}

// Function to load settings from localStorage
function loadSettings() {
    let settings = null;
    try {
        settings = JSON.parse(localStorage.getItem(settingsKey));
    } catch (e) {
        settings = null; // Corrupt entry or storage blocked: keep the HTML defaults
    }
    if (!settings) return;

    el.workHours.value = numOr(settings.workHours, 7);
    el.workMinutes.value = numOr(settings.workMinutes, 42);
    el.nettSalary.value = numOr(settings.nettSalary, 2000);
    el.hours.value = settings.lastHours !== undefined ? settings.lastHours : '';
    el.minutes.value = settings.lastMinutes !== undefined ? settings.lastMinutes : '0';
    el.days.value = settings.lastDays !== undefined ? settings.lastDays : '';
    if (settings.lastMode === 'toDays' || settings.lastMode === 'toHours') {
        currentMode = settings.lastMode;
    }
}

// Function to save settings to localStorage
function saveSettings() {
    const settings = {
        workHours: numOr(el.workHours.value, 7),
        workMinutes: numOr(el.workMinutes.value, 42),
        nettSalary: numOr(el.nettSalary.value, 0),
        lastHours: el.hours.value,
        lastMinutes: el.minutes.value,
        lastDays: el.days.value,
        lastMode: currentMode,
    };
    try {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    } catch (e) {
        // Storage unavailable (private browsing, quota) - settings just won't persist
    }
}

function toggleSettings() {
    settingsOpen = !settingsOpen;
    el.settingsView.style.display = settingsOpen ? 'block' : 'none';
    el.converterView.style.display = settingsOpen ? 'none' : 'block';
    el.settingsButton.classList.toggle('active', settingsOpen);
    el.settingsButton.textContent = settingsOpen ? 'Close Settings' : '⚙ Settings';
    if (!settingsOpen) {
        el.compensation.style.display = 'none';
    }
}

// Reveal the result, fading in only when it wasn't already on screen (avoids a blink on repeat converts)
function showResult(text) {
    el.result.textContent = text;
    if (el.result.style.display === 'block') return;
    el.result.style.opacity = 0;
    el.result.style.display = 'block';
    setTimeout(() => { el.result.style.opacity = 1; }, 100);
}

function showError(text) {
    showResult(text);
    el.compensation.style.display = 'none';
}

function showCompensation(exactDays) {
    const salary = numOr(el.nettSalary.value, 0);

    if (salary <= 0) {
        el.compensation.style.display = 'none';
        return;
    }

    const dailyRate = salary / 22; // 22 working days per month (fixed)
    const compensation = dailyRate * exactDays;

    el.compensationLabel.textContent = `Compensation (€${dailyRate.toFixed(2)} / day)`;
    el.compensationValue.textContent = `€${compensation.toFixed(2)}`;
    if (el.compensation.style.display !== 'block') {
        el.compensation.style.opacity = 0;
        el.compensation.style.display = 'block';
        setTimeout(() => { el.compensation.style.opacity = 1; }, 100);
    }
}

function switchMode(mode) {
    currentMode = mode;
    el.hoursMinutesInputs.style.display = mode === 'toDays' ? 'block' : 'none';
    el.daysInput.style.display = mode === 'toHours' ? 'block' : 'none';
    el.result.textContent = '';
    el.result.style.display = 'none';
    el.compensation.style.display = 'none';

    // Update active tab
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.toggle('active', button.dataset.mode === mode);
    });

    saveSettings();
}

function calculate() {
    const dayMinutes = workDayMinutes();
    if (dayMinutes <= 0) {
        showError('Set a working day longer than 0 minutes.');
        return;
    }

    let resultText = '';
    let exactDays = 0;
    if (currentMode === 'toDays') {
        const hours = numOr(el.hours.value, 0);
        const minutes = numOr(el.minutes.value, 0);
        const totalMinutes = Math.round(hours * 60 + minutes);
        if (totalMinutes < 0) {
            showError('Enter a time of 0 or more.');
            return;
        }
        const days = Math.floor(totalMinutes / dayMinutes);
        const remainingMinutes = totalMinutes % dayMinutes;
        const remHours = Math.floor(remainingMinutes / 60);
        const remMinutes = remainingMinutes % 60;
        exactDays = totalMinutes / dayMinutes;

        resultText = `${hours}h ${minutes}m = ${pluralize(days, 'day')}, ${remHours}h ${remMinutes}m`;
    } else if (currentMode === 'toHours') {
        const days = numOr(el.days.value, 0);
        if (days < 0) {
            showError('Enter a number of days of 0 or more.');
            return;
        }
        // Round the total once, then split it - rounding hours and minutes apart can yield "1h 60m"
        const totalMinutes = Math.round(days * dayMinutes);
        const totalHours = Math.floor(totalMinutes / 60);
        const remMinutes = totalMinutes % 60;
        exactDays = days;

        resultText = `${pluralize(days, 'working day')} = ${totalHours}h ${remMinutes}m`;
    }

    showResult(resultText);
    showCompensation(exactDays);

    // Save settings after calculation (in case they were changed)
    saveSettings();
}

// Function to handle Enter key press
function handleEnterKey(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        const input = currentMode === 'toDays' ? el.hours : el.days;
        if (input.value.trim() !== '') {
            calculate();
        }
    }
}

// Initialize: Load settings and set up event listeners
loadSettings();
switchMode(currentMode);

// Add event listeners to save settings on input change
['workHours', 'workMinutes', 'nettSalary', 'hours', 'minutes', 'days'].forEach(id => {
    el[id].addEventListener('input', saveSettings);
});

// Add keydown listeners to relevant inputs for Enter key submission
['hours', 'minutes', 'days'].forEach(id => {
    el[id].addEventListener('keydown', handleEnterKey);
});
