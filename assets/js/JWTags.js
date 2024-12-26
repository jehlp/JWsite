/**
 * File: JWTags.js
 * The JavaScript file defines a function to render a tags banner, which sorts and formats the tags.
 * It creates a class JWTags with a static method 'init' to initialize the tags.
 * The 'init' method retrieves tags from the window object and generates HTML for the banner.
 * The method then finds the footer of the document and inserts the tags banner into it.
 * If the footer doesn't contain a 'footer-content' element, it creates one and moves all existing footer children into it.
 * Finally, it adds an event listener to the document to call the 'init' method when the DOM is fully loaded.
 */

const renderTagsBanner = (tags) => {
    if (!tags || tags.length === 0) {
        return '';
    }
    const sortedTags = [...tags].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const tagSpans = sortedTags
        .map(tag => {
            const formattedTag = tag.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
            return `<span class="tag">${formattedTag}</span>`;
        })
        .join(', ');
    return `
        <div class="tags-banner">
            <span class="tags-label">Tags:</span> ${tagSpans}
        </div>
    `;
};

class JWTags {
    static init() {
        const tags = window.page_tags || [];
        const bannerHtml = renderTagsBanner(tags);
        const footer = document.querySelector('footer');
        if (footer && bannerHtml) {
            const tagsContainer = document.createElement('div');
            tagsContainer.innerHTML = bannerHtml;
            let footerContent = footer.querySelector('.footer-content');
            if (!footerContent) {
                footerContent = document.createElement('div');
                footerContent.className = 'footer-content';
                while (footer.firstChild) {
                    footerContent.appendChild(footer.firstChild);
                }
                footer.appendChild(footerContent);
            }
            footer.insertBefore(tagsContainer, footerContent);
        }
    }
}

document.addEventListener('DOMContentLoaded', JWTags.init);