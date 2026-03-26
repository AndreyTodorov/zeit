let currentMode = 'toDays';
let settingsOpen = false;
const settingsKey = 'workingTimeSettings'; // Key for localStorage, extensible for future settings

// Function to load settings from localStorage
function loadSettings() {
    const storedSettings = localStorage.getItem(settingsKey);
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        document.getElementById('workHours').value = settings.workHours || 7;
        document.getElementById('workMinutes').value = settings.workMinutes || 42;
        document.getElementById('nettSalary').value = settings.nettSalary !== undefined ? settings.nettSalary : 2000;
    }
}

// Function to save settings to localStorage
function saveSettings() {
    const settings = {
        workHours: parseInt(document.getElementById('workHours').value) || 7,
        workMinutes: parseInt(document.getElementById('workMinutes').value) || 42,
        nettSalary: parseFloat(document.getElementById('nettSalary').value) || 0,
    };
    localStorage.setItem(settingsKey, JSON.stringify(settings));
}

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

function showCompensation(exactDays) {
    const salary = parseFloat(document.getElementById('nettSalary').value) || 0;
    const compensationElem = document.getElementById('compensation');
    const labelElem = document.getElementById('compensationLabel');
    const valueElem = document.getElementById('compensationValue');

    if (salary <= 0) {
        compensationElem.style.display = 'none';
        return;
    }

    const dailyRate = salary / 22; // 22 working days per month (fixed)
    const compensation = dailyRate * exactDays;

    labelElem.textContent = `Compensation (€${dailyRate.toFixed(2)} / day)`;
    valueElem.textContent = `€${compensation.toFixed(2)}`;
    compensationElem.style.display = 'none';
    compensationElem.style.opacity = 0;
    compensationElem.style.display = 'block';
    setTimeout(() => { compensationElem.style.opacity = 1; }, 100);
}

function switchMode(mode) {
    currentMode = mode;
    document.getElementById('hoursMinutesInputs').style.display = mode === 'toDays' ? 'block' : 'none';
    document.getElementById('daysInput').style.display = mode === 'toHours' ? 'block' : 'none';
    const resultElem = document.getElementById('result');
    resultElem.textContent = '';
    resultElem.style.display = 'none';
    document.getElementById('compensation').style.display = 'none';

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

    // Display result with a subtle animation
    const resultElem = document.getElementById('result');
    resultElem.textContent = resultText;
    resultElem.style.display = 'block';
    resultElem.style.opacity = 0;
    setTimeout(() => {
        resultElem.style.opacity = 1;
    }, 100);

    showCompensation(exactDays);

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
document.getElementById('nettSalary').addEventListener('input', saveSettings);

// Add keydown listeners to relevant inputs for Enter key submission
document.getElementById('hours').addEventListener('keydown', handleEnterKey);
document.getElementById('minutes').addEventListener('keydown', handleEnterKey);
document.getElementById('days').addEventListener('keydown', handleEnterKey);
