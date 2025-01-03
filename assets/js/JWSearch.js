/**
 * File: JWSearch.js
 * The JavaScript file is used to implement a search functionality in a webpage.
 * It fetches all tags and entry data from the webpage's elements.
 * It generates HTML for search suggestions based on the user's search term.
 * It handles click events on the suggestion items, redirecting the user to the clicked item's URL.
 * It shows or hides the search suggestions based on the user's interaction with the search input.
 * The search functionality is initialized when the webpage's content is fully loaded.
 */

const getAllTags = () => {
    const tagSet = new Set();
    document.querySelectorAll('.entry-item').forEach(entry => {
        const tags = entry.getAttribute('data-tags');
        if (tags) {
            tags.split(',').forEach(tag => tagSet.add(tag.trim()));
        }
    });
    return Array.from(tagSet);
};

const getEntryData = () => {
    const allEntries = document.querySelectorAll('.entry-item');
    return Array.from(allEntries).map(entry => {
        const link = entry.querySelector('a');
        const entryTags = (entry.getAttribute('data-tags') || '').split(',').map(tag => tag.trim());
        return {
            title: link ? link.textContent : '',
            url: link ? link.getAttribute('href') : '',
            tags: entryTags
        };
    });
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
            window.location.href = item.getAttribute('data-url');
        });
    });
};

const showSuggestions = (searchTerm) => {
    const suggestionsDiv = document.getElementById('search-suggestions');
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
    if (searchInput) {
        searchInput.addEventListener('input', event => {
            const searchTerm = event.target.value.toLowerCase();
            showSuggestions(searchTerm);
        });
        document.addEventListener('click', event => {
            if (!event.target.closest('.search-container')) {
                hideSuggestions();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', initializeSearch);
