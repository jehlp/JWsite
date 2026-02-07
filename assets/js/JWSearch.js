/**
 * File: JWSearch.js
 * Implements search functionality for the webpage.
 * Caches tags and entry data on page load for efficient searching.
 * Generates suggestions based on title and tag matches.
 */

let cachedTags = null;
let cachedEntries = null;

const getAllTags = () => {
    if (cachedTags) return cachedTags;
    const tagSet = new Set();
    document.querySelectorAll('.entry-item').forEach(entry => {
        const tags = entry.getAttribute('data-tags');
        if (tags) {
            tags.split(',').forEach(tag => tagSet.add(tag.trim()));
        }
    });
    cachedTags = Array.from(tagSet);
    return cachedTags;
};

const getEntryData = () => {
    if (cachedEntries) return cachedEntries;
    const allEntries = document.querySelectorAll('.entry-item');
    cachedEntries = Array.from(allEntries).map(entry => {
        const link = entry.querySelector('a');
        const entryTags = (entry.getAttribute('data-tags') || '').split(',').map(tag => tag.trim());
        return {
            title: link ? link.textContent : '',
            url: link ? link.getAttribute('href') : '',
            tags: entryTags
        };
    });
    return cachedEntries;
};

const generateSuggestionHTML = (title, url, type = '', matchingTag = '') => {
    const formattedTag = matchingTag
        ? matchingTag.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        : '';
    const typeLabel = type === 'tag' && formattedTag ? `Tag: ${formattedTag}` : '';
    return `
        <div class="suggestion-item" data-value="${title}" data-url="${url}">
            <span class="suggestion-text">${title}</span>
            <span class="suggestion-type">${typeLabel}</span>
        </div>
    `;
};

const handleSuggestionClick = suggestionItems => {
    suggestionItems.forEach(item => {
        item.addEventListener('click', () => {
            const url = item.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });
};

const showSuggestions = (searchTerm) => {
    const suggestionsDiv = document.getElementById('search-suggestions');
    if (!suggestionsDiv) return;
    if (!searchTerm) {
        suggestionsDiv.classList.remove('active');
        return;
    }
    const tags = getAllTags();
    const matchingTags = tags.filter(tag => tag.toLowerCase().includes(searchTerm));
    const entries = getEntryData();
    const titleMatches = entries.filter(entry => entry.title.toLowerCase().includes(searchTerm));
    const tagRelatedEntries = matchingTags.flatMap(matchingTag =>
        entries.filter(entry =>
            entry.tags.includes(matchingTag.toLowerCase()) &&
            !titleMatches.some(titleMatch => titleMatch.title === entry.title)
        ).map(entry => ({ ...entry, matchingTag }))
    );
    let html = '';
    titleMatches.forEach(({ title, url }) => {
        html += generateSuggestionHTML(title, url);
    });
    tagRelatedEntries.forEach(({ title, url, matchingTag }) => {
        html += generateSuggestionHTML(title, url, 'tag', matchingTag);
    });
    if (html) {
        suggestionsDiv.innerHTML = html;
        suggestionsDiv.classList.add('active');
        handleSuggestionClick(suggestionsDiv.querySelectorAll('.suggestion-item'));
    } else {
        suggestionsDiv.classList.remove('active');
    }
};

const hideSuggestions = () => {
    const suggestionsDiv = document.getElementById('search-suggestions');
    if (suggestionsDiv) {
        suggestionsDiv.classList.remove('active');
    }
};

const initializeSearch = () => {
    const searchInput = document.getElementById('content-search');
    if (!searchInput) return;

    // Pre-cache data on page load
    getAllTags();
    getEntryData();

    searchInput.addEventListener('input', event => {
        const searchTerm = event.target.value.toLowerCase();
        showSuggestions(searchTerm);
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('.search-container')) {
            hideSuggestions();
        }
    });
};

document.addEventListener('DOMContentLoaded', initializeSearch);
