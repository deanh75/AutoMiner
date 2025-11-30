// Get all buttons and screens
const buttons = {
    home: document.getElementById('home-btn'),
    user: document.getElementById('user-btn'),
    settings: document.getElementById('settings-btn')
};

const screens = {
    home: document.getElementById('home-screen'),
    user: document.getElementById('user-screen'),
    settings: document.getElementById('settings-screen')
};

// Function to show a screen and hide the others
function showScreen(screenName: keyof typeof screens) {
    for (const key in screens) {
        if (screens[key as keyof typeof screens]) {
            (screens[key as keyof typeof screens] as HTMLElement).style.display =
                key === screenName ? 'block' : 'none';
        }
    }
}

// Add click listeners to buttons
buttons.home?.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('home');
});

buttons.user?.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('user');
});

buttons.settings?.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('settings');
});

// Enable/Disable toggle
const enableBtn = document.querySelector('.enable-btn');

enableBtn?.addEventListener('click', () => {
    if (enableBtn.classList.contains('enabled')) {
        enableBtn.classList.remove('enabled');
        enableBtn.classList.add('disabled');
        enableBtn.textContent = 'Disable';
    } else {
        enableBtn.classList.remove('disabled');
        enableBtn.classList.add('enabled');
        enableBtn.textContent = 'Enable';
    }
});

// Show Home screen by default when page loads
window.addEventListener('DOMContentLoaded', () => {
    showScreen('home');
});