const buildRef = i => {
    const sup = document.createElement('sup');
    const ref = document.createElement('a');
    ref.href = `#fn-${i + 1}`;
    ref.className = 'footnote-ref';
    ref.textContent = `[${i + 1}]`;
    sup.appendChild(ref);
    return sup;
};

const buildFootnote = (link, i) => {
    const item = document.createElement('li');
    const url = formatUrl(link.href);
    item.id = `fn-${i + 1}`;
    item.innerHTML = `<span class="footnote-text">${link.textContent}</span>
        <a href="${link.href}" class="footnote-url" target="_blank" rel="noopener noreferrer">${url}</a>
        <a href="#fn-ref-${i + 1}" class="footnote-backref">↩</a>`;
    return item;
};

const formatUrl = href => {
    try { const url = new URL(href); return `${url.hostname}${url.pathname}${url.search}`; } 
    catch { return href; }
};

const buildSection = links => {
    const section = document.createElement('div');
    const list = document.createElement('ol');
    section.className = 'footnotes';
    section.innerHTML = '<h2>References</h2>';
    links.forEach((link, i) => {
        link.parentNode.insertBefore(buildRef(i), link.nextSibling);
        list.appendChild(buildFootnote(link, i));
    });
    section.appendChild(list);
    return section;
};

const filterLinks = async () => {
    const config = await fetch('/assets/config.yaml')
        .then(r => r.text())
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