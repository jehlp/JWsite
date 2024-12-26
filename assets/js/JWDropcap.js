/**
 * File: JWDropcap.js
 * Listens for the DOMContentLoaded event to ensure the HTML is fully loaded before execution
 * Defines a function, applyDropcaps, to apply a dropcap style to specified letters
 * Uses a regular expression to find instances of ":big(letter):" in the HTML
 * Replaces these instances with a span element with the class "dropcap", wrapping the specified letter
 * Calls the applyDropcaps function after its definition.
 */

document.addEventListener("DOMContentLoaded", () => {
    const applyDropcaps = () => {
        const dropcapRegex = /:big\((\w)\):/g;
        document.body.innerHTML = document.body.innerHTML.replace(dropcapRegex, (match, letter) => {
            return `<span class="dropcap">${letter}</span>`;
        });
    };
    applyDropcaps();
});