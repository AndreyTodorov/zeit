let currentMode = 'toDays';
const settingsKey = 'workingTimeSettings'; // Key for localStorage, extensible for future settings

// Function to load settings from localStorage
function loadSettings() {
    const storedSettings = localStorage.getItem(settingsKey);
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        document.getElementById('workHours').value = settings.workHours || 7;
        document.getElementById('workMinutes').value = settings.workMinutes || 42;
        // In the future, load additional settings here
    }
}

// Function to save settings to localStorage
function saveSettings() {
    const settings = {
        workHours: parseInt(document.getElementById('workHours').value) || 7,
        workMinutes: parseInt(document.getElementById('workMinutes').value) || 42,
        // In the future, add additional settings here
    };
    localStorage.setItem(settingsKey, JSON.stringify(settings));
}

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

function switchMode(mode) {
    currentMode = mode;
    document.getElementById('hoursMinutesInputs').style.display = mode === 'toDays' ? 'block' : 'none';
    document.getElementById('daysInput').style.display = mode === 'toHours' ? 'block' : 'none';
    const resultElem = document.getElementById('result');
    resultElem.textContent = '';
    resultElem.style.display = 'none';

    // Update active tab
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.toggle('active', button.onclick.toString().includes(mode));
    });
}

function calculate() {
    // Get custom working day or default
    const workHours = parseInt(document.getElementById('workHours').value) || 7;
    const workMinutes = parseInt(document.getElementById('workMinutes').value) || 42;
    const workDayMinutes = workHours * 60 + workMinutes;

    let resultText = '';
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

    // Display result with a subtle animation
    const resultElem = document.getElementById('result');
    resultElem.textContent = resultText;
    resultElem.style.display = 'block';
    resultElem.style.opacity = 0;
    setTimeout(() => {
        resultElem.style.opacity = 1;
    }, 100);

    // Save settings after calculation (in case they were changed)
    saveSettings();
}

// Function to handle Enter key press
function handleEnterKey(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        if (currentMode === 'toDays') {
            const hoursInput = document.getElementById('hours');
            if (hoursInput.value.trim() !== '') {
                calculate();
            }
        } else if (currentMode === 'toHours') {
            const daysInput = document.getElementById('days');
            if (daysInput.value.trim() !== '') {
                calculate();
            }
        }
    }
}

// Initialize: Load settings and set up event listeners
loadSettings();
switchMode('toDays');

// Add event listeners to save settings on input change
document.getElementById('workHours').addEventListener('input', saveSettings);
document.getElementById('workMinutes').addEventListener('input', saveSettings);
// In the future, add listeners for additional settings here

// Add keydown listeners to relevant inputs for Enter key submission
document.getElementById('hours').addEventListener('keydown', handleEnterKey);
document.getElementById('minutes').addEventListener('keydown', handleEnterKey);
document.getElementById('days').addEventListener('keydown', handleEnterKey);
