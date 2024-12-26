/**
 * File: JWFootnotes.js
 * The JavaScript file is used to create footnotes for a webpage.
 * It identifies external links on the page and generates a reference for each one.
 * It assigns an icon to each link based on the domain it points to, using a predefined map.
 * It creates a 'References' section at the end of the page, listing all the external links with their references.
 * It also adds a smooth scrolling effect when a reference is clicked, highlighting the corresponding link for a short period.
 * It fetches a blacklist configuration to filter out certain domains from being included in the footnotes.
 */

const getWebsiteIcon = (href) => {
    try {
        const url = new URL(href);
        const domain = url.hostname.toLowerCase();
        const iconMap = {
            'wikipedia.org': 'fab fa-wikipedia-w',
            'x.com': 'fab fa-x-twitter',
            'github.com': 'fab fa-github',
            'youtube.com': 'fab fa-youtube',
        };
        for (const [site, icon] of Object.entries(iconMap)) {
            if (domain.includes(site)) {
                return icon;
            }
        }
        return null;
    } catch {
        return null;
    }
};

const buildRef = (index, href) => {
    const container = document.createElement('span');
    container.className = 'footnote-container';
    const superscript = document.createElement('sup');
    const ref = document.createElement('a');
    ref.href = `#fn-${index + 1}`;
    ref.id = `fn-ref-${index + 1}`;
    ref.className = 'footnote-ref';
    ref.textContent = `[${index + 1}]`;
    superscript.appendChild(ref);
    container.appendChild(superscript);
    const icon = getWebsiteIcon(href);
    if (icon) {
        const sub = document.createElement('sub');
        const iconElement = document.createElement('i');
        iconElement.className = `${icon} footnote-icon`;
        sub.appendChild(iconElement);
        container.appendChild(sub);
    }
    return container;
};

const buildFootnote = (link, index) => {
    const listItem = document.createElement('li');
    const url = formatUrl(link.href);
    listItem.id = `fn-${index + 1}`;
    listItem.innerHTML = `<span class="footnote-text">${link.textContent}</span>
        <a href="${link.href}" class="footnote-url" target="_blank" rel="noopener noreferrer">${url}</a>
        <a href="#fn-ref-${index + 1}" class="footnote-backref">↩</a>`;
    return listItem;
};

const formatUrl = (href) => {
    try {
        const url = new URL(href);
        const path = url.pathname.replace(/\/+$/, '');
        const formattedUrl = `${url.hostname.replace(/^www\./, '')}${path}`;
        return url.search !== '?' ? `${formattedUrl}${url.search}` : formattedUrl;
    } catch {
        return href.replace(/\/+$/, '');
    }
};

const scrollToRef = (element) => {
    window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - window.innerHeight / 4,
        behavior: 'smooth'
    });
};

const buildSection = (links) => {
    const section = document.createElement('div');
    const list = document.createElement('ol');
    section.className = 'footnotes';
    section.innerHTML = '<h2>References</h2>';
    links.forEach((link, index) => {
        const ref = buildRef(index, link.href);
        link.parentNode.insertBefore(ref, link.nextSibling);
        const footnote = buildFootnote(link, index);
        list.appendChild(footnote);
    });
    list.querySelectorAll('.footnote-backref').forEach((ref) => {
        ref.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.getElementById(ref.getAttribute('href').slice(1));
            if (target) {
                scrollToRef(target);
                target.classList.add('highlight');
                setTimeout(() => {
                    target.classList.remove('highlight');
                }, 2000);
            }
        });
    });
    section.appendChild(list);
    return section;
};

const filterLinks = async () => {
    const config = await fetch('/assets/config.yaml')
        .then((response) => response.text())
        .then(jsyaml.load)
        .catch(() => ({ jw_footnotes_blacklist: [] }));
    const isValid = (url) => {
        if (url.startsWith(window.location.origin)) {
            return false;
        }
        return !config.jw_footnotes_blacklist.some(domain => url.includes(domain));
    };
    const links = document.querySelector('main')?.getElementsByTagName('a') || [];
    return Array.from(links).filter((link) => isValid(link.href));
};

const addFootnotes = async () => {
    const links = await filterLinks();
    if (links.length > 0) {
        const section = buildSection(links);
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.appendChild(section);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    addFootnotes();
});
