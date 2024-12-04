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

const findSimilarStrings = (input, strings, maxSuggestions = 5) => {
    if (!input) return [];
    input = input.toLowerCase();
    return strings
        .filter(str => str && str.toLowerCase().includes(input))
        .sort((a, b) => {
            const aStarts = a.toLowerCase().startsWith(input);
            const bStarts = b.toLowerCase().startsWith(input);
            if (aStarts && !bStarts) {
                return -1;
            }
            if (!aStarts && bStarts) {
                return 1;
            }
            return a.localeCompare(b);
        })
        .slice(0, maxSuggestions);
};

const handleSearch = (searchTerm) => {
    const entries = document.querySelectorAll('.entry-item');
    entries.forEach(entry => {
        const title = entry.getAttribute('data-title') || '';
        const tags = entry.getAttribute('data-tags') || '';
        const matches = title.toLowerCase().includes(searchTerm) ||
                        tags.toLowerCase().includes(searchTerm);
        entry.style.display = matches ? '' : 'none';
    });
    document.querySelectorAll('.month-section').forEach(monthSection => {
        const hasVisibleEntries = Array.from(monthSection.querySelectorAll('.entry-item'))
            .some(entry => entry.style.display !== 'none');
        monthSection.style.display = hasVisibleEntries ? '' : 'none';
    });
    document.querySelectorAll('.year-section').forEach(yearSection => {
        const hasVisibleMonths = Array.from(yearSection.querySelectorAll('.month-section'))
            .some(month => month.style.display !== 'none');
        yearSection.style.display = hasVisibleMonths ? '' : 'none';
    });
};

const getEntryData = () => {
    const allEntries = document.querySelectorAll('.entry-item');
    return Array.from(allEntries).map(entry => {
        const link = entry.querySelector('a');
        const entryTags = (entry.getAttribute('data-tags') || '').split(',').map(t => t.trim());
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
    const titleMatches = entries.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm)
    );
    const tagRelatedEntries = matchingTags.flatMap(matchingTag =>
        entries.filter(entry =>
            entry.tags.includes(matchingTag.toLowerCase()) &&
            !titleMatches.some(tm => tm.title === entry.title)
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

class JWSearch {
    static init() {
        const searchInput = document.getElementById('content-search');
        if (searchInput) {
            searchInput.addEventListener('input', event => {
                const searchTerm = event.target.value.toLowerCase();
                handleSearch(searchTerm);
                showSuggestions(searchTerm);
            });
            document.addEventListener('click', event => {
                if (!event.target.closest('.search-container')) {
                    hideSuggestions();
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', JWSearch.init);