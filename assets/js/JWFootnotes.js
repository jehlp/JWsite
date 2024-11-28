const buildRef = index => {
    const superscript = document.createElement('sup');
    const ref = document.createElement('a');
    ref.href = `#fn-${index + 1}`;
    ref.id = `fn-ref-${index + 1}`;
    ref.className = 'footnote-ref';
    ref.textContent = `[${index + 1}]`;
    superscript.appendChild(ref);
    return superscript;
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

const formatUrl = href => {
    try {
        const url = new URL(href);
        const path = url.pathname.replace(/\/+$/, '');
        return `${url.hostname.replace(/^www\./, '')}${path}${url.search === '?' ? '' : url.search}`;
    } catch { 
        return href.replace(/\/+$/, ''); 
    }
};

const scrollToRef = element => window.scrollTo({
    top: element.getBoundingClientRect().top + window.pageYOffset - window.innerHeight / 4,
    behavior: 'smooth'
});

const buildSection = links => {
    const section = document.createElement('div');
    const list = document.createElement('ol');
    section.className = 'footnotes';
    section.innerHTML = '<h2>References</h2>';
    links.forEach((link, index) => {
        link.parentNode.insertBefore(buildRef(index), link.nextSibling);
        list.appendChild(buildFootnote(link, index));
    });
    list.querySelectorAll('.footnote-backref').forEach(ref => 
        ref.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(ref.getAttribute('href').slice(1));
            if (target) {
                scrollToRef(target);
                target.classList.add('highlight');
                setTimeout(() => target.classList.remove('highlight'), 2000);
            }
        })
    );
    section.appendChild(list);
    return section;
};

const filterLinks = async () => {
    const config = await fetch('/assets/config.yaml')
        .then(response => response.text())
        .then(jsyaml.load)
        .catch(() => ({ jw_footnotes_blacklist: [] }));
    const isValid = url => !url.startsWith('/') && 
                           !url.startsWith('#') && 
                           !url.startsWith(window.location.origin) && 
                           !config.jw_footnotes_blacklist.some(domain => url.includes(domain));
    const links = document.querySelector('main')?.getElementsByTagName('a') || [];
    return Array.from(links).filter(link => isValid(link.href));
};

const addFootnotes = async () => {
    const links = await filterLinks();
    if (links.length) document.querySelector('main')?.appendChild(buildSection(links));
};

document.addEventListener('DOMContentLoaded', addFootnotes);