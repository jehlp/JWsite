/**
 * File: JWThemeInit.js
 * Sets the theme of the website based on the user's previous selection.
 * If no previous selection is found, it defaults to 'dark' theme.
 * This runs immediately to prevent flash of wrong theme.
 */

(() => {
    try {
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
    } catch {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
