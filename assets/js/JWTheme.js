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