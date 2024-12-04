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

const extractTags = (markdownContent) => {
    const frontMatterMatch = markdownContent.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) {
        return [];
    }
    const frontMatter = frontMatterMatch[1];
    const tagsMatch = frontMatter.match(/tags:\s*\[(.*?)\]/);
    if (!tagsMatch) {
        return [];
    }
    return tagsMatch[1].split(',').map(tag => tag.trim());
};

const addTags = (markdownContent, newTags) => {
    if (!Array.isArray(newTags)) {
        newTags = [newTags];
    }
    const frontMatterMatch = markdownContent.match(/^---\n([\s\S]*?)\n---/);
    if (frontMatterMatch) {
        let frontMatter = frontMatterMatch[1];
        const tagsMatch = frontMatter.match(/tags:\s*\[(.*?)\]/);
        if (tagsMatch) {
            const existingTags = tagsMatch[1].split(',').map(tag => tag.trim());
            const allTags = [...new Set([...existingTags, ...newTags])];
            frontMatter = frontMatter.replace(
                /tags:\s*\[(.*?)\]/,
                `tags: [${allTags.join(', ')}]`
            );
        } else {
            frontMatter += `\ntags: [${newTags.join(', ')}]`;
        }

        return markdownContent.replace(
            /^---\n[\s\S]*?\n---/,
            `---\n${frontMatter}\n---`
        );
    }
    return markdownContent;
};

const getAllTags = (markdownContents) => {
    const allTags = new Set();
    markdownContents.forEach(content => {
        const tags = extractTags(content);
        tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
};

const findPostsByTag = (markdownContents, tag) => {
    return markdownContents.filter(content => {
        const postTags = extractTags(content);
        return postTags.includes(tag);
    });
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