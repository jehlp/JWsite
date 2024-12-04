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
        const navbar = document.querySelector('nav') || document.querySelector('header');
        if (navbar && bannerHtml) {
            navbar.insertAdjacentHTML('afterend', bannerHtml);
        }
    }
}

document.addEventListener('DOMContentLoaded', JWTags.init);