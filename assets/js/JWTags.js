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