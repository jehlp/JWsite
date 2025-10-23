/**
 * File: JWThemeInit.js
 * Sets the theme of the website based on the user's previous selection
 * If no previous selection is found, it defaults to 'dark' theme
 * This theme setting is stored in the user's local storage for future visits
 * The theme is applied to the root element of the document.
 */

(() => document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark'))();