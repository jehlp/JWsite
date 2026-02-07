/**
 * File: JWDropcap.js
 * Applies dropcap styling to specified letters using :big(letter): syntax
 * Uses TreeWalker for efficient DOM traversal without destroying event listeners
 */

const applyDropcaps = () => {
    const dropcapRegex = /:big\((\w)\):/g;

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
    );

    const nodesToProcess = [];
    let node;

    while ((node = walker.nextNode())) {
        if (dropcapRegex.test(node.textContent)) {
            nodesToProcess.push(node);
        }
        dropcapRegex.lastIndex = 0;
    }

    nodesToProcess.forEach(textNode => {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        const text = textNode.textContent;

        dropcapRegex.lastIndex = 0;

        while ((match = dropcapRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            const span = document.createElement('span');
            span.className = 'dropcap';
            span.textContent = match[1];
            fragment.appendChild(span);

            lastIndex = dropcapRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        textNode.parentNode.replaceChild(fragment, textNode);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    applyDropcaps();
});
