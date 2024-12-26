/**
 * File: JWTheme.js
 * Changes the website's theme based on user preference
 * Stores the user's theme preference in local storage
 * Updates the theme icon to reflect the current theme
 * Toggles between light and dark themes when the theme icon is clicked
 * Sets the default theme to dark if no preference is stored in local storage
 * Attaches the theme toggle function to the theme icon on page load
 */

const updateTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

const toggleTheme = () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateTheme(newTheme);
}
 
updateTheme(localStorage.getItem('theme') || 'dark');
document.addEventListener('DOMContentLoaded', () => 
    document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme)
);