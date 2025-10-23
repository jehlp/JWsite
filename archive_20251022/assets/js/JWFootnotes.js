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
            'arxiv.org': 'fas fa-scroll',
            'scholar.google.com': 'fas fa-graduation-cap',
            'researchgate.net': 'fab fa-researchgate',
            'doi.org': 'fas fa-book',
            'jstor.org': 'fas fa-books',
            'archive.org': 'fas fa-archive',
            'britannica.com': 'fas fa-book-open',
            'goodreads.com': 'fas fa-goodreads-g',
            'librarything.com': 'fas fa-bookmark',
            'gutenberg.org': 'fas fa-book-open',
            'poetryfoundation.org': 'fas fa-feather',
            'abebooks.com': 'fas fa-book',
            'worldcat.org': 'fas fa-globe-books',
            'loc.gov': 'fas fa-landmark',
            'nature.com': 'fas fa-microscope',
            'science.org': 'fas fa-atom',
            'plato.stanford.edu': 'fas fa-university',
            'sciencedirect.com': 'fas fa-flask',
            'academia.edu': 'fas fa-graduation-cap',
            'github.com': 'fab fa-github',
            'stackoverflow.com': 'fab fa-stack-overflow',
            'developer.mozilla.org': 'fab fa-firefox-browser',
            'python.org': 'fab fa-python',
            'rust-lang.org': 'fas fa-gear',
            'kubernetes.io': 'fas fa-dharmachakra',
            'youtube.com': 'fab fa-youtube',
            'x.com': 'fab fa-x-twitter',
            'twitter.com': 'fab fa-x-twitter',
            'medium.com': 'fab fa-medium',
            'substack.com': 'fas fa-newsletter',
            'nytimes.com': 'fas fa-newspaper',
            'newyorker.com': 'fas fa-magazine',
            'economist.com': 'fas fa-chart-line',
            'theguardian.com': 'fas fa-newspaper',
            'bloomberg.com': 'fas fa-money-bill',
            'reuters.com': 'fas fa-globe',
            'metmuseum.org': 'fas fa-landmark-dome',
            'britishmuseum.org': 'fas fa-landmark',
            'smithsonianmag.com': 'fas fa-landmark',
            'moma.org': 'fas fa-palette',
            'nationalgeographic.com': 'fas fa-earth',
            'arstechnica.com': 'fas fa-microchip',
            'technologyreview.com': 'fas fa-robot',
            'wired.com': 'fas fa-wifi',
            'techcrunch.com': 'fas fa-rocket',
            'lwn.net': 'fab fa-linux',
            'coursera.org': 'fas fa-graduation-cap',
            'kaggle.com': 'fas fa-chart-line',
            'mathoverflow.net': 'fas fa-square-root-alt',
            'philpapers.org': 'fas fa-scroll',
            'ssrn.com': 'fas fa-file-contract',
            'polygon.com': 'fas fa-dice-d20',
            'rockpapershotgun.com': 'fas fa-hand-rock',
            'eurogamer.net': 'fas fa-globe-europe',
            'gamedeveloper.com': 'fas fa-code',
            'kotaku.com': 'fas fa-gamepad',
            'destructoid.com': 'fas fa-robot',
            'gamespot.com': 'fas fa-crosshairs',
            'ign.com': 'fas fa-newspaper',
            'gameinformer.com': 'fas fa-info',
            'waypoint.vice.com': 'fas fa-map-marker'
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