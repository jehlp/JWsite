const updateTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
};

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateTheme(newTheme);
};

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.querySelector('.theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', (event) => {
            event.preventDefault();
            toggleTheme();
        });
    }
});