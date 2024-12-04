const getDefaultTooltipRules = () => [
    {
        selector: '.section-number',
        description: () =>
            '<i class="fas fa-expand-alt"></i><i class="fas fa-compress-alt"></i> Click to expand or collapse this section',
    },
    {
        selector: 'a[href]',
        description: element => {
            const url = new URL(element.href);
            const textContent = element.textContent.trim();
            const hasAlphabets = /[a-zA-Z]/.test(textContent);
            if (url.host === window.location.host) {
                if (element.hash) {
                    return hasAlphabets
                        ? `<i class="fas fa-location-arrow"></i> Jump to section "${textContent}"`
                        : `<i class="fas fa-location-arrow"></i> Jump`;
                }
                return `<i class="fas fa-link"></i> Navigating within the site to <strong>${url.pathname}</strong>`;
            }
            return `<i class="fas fa-external-link-alt"></i> Navigate to external site: <strong>${url.href}</strong>`;
        },
    },
    {
        selector: '.theme-toggle',
        description: () => {
            const isLightMode = document.documentElement.dataset.theme === 'light';
            return isLightMode
                ? '<i class="fas fa-moon"></i> Swap to dark mode'
                : '<i class="fas fa-sun"></i> Swap to light mode';
        },
    },
    {
        selector: '.copy-button',
        description: () => '<i class="fas fa-copy"></i> Copy code block',
    },
    {
        selector: '.download-button',
        description: () => {
            const relativePath = window.location.pathname;
            return `<i class="fas fa-file-download"></i> Download PDF of <strong>${relativePath}</strong>`;
        },
    },
];

const createTooltipElement = () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'clickable-tooltip';
    const tooltipText = document.createElement('span');
    tooltipText.className = 'clickable-tooltip-text';
    tooltip.appendChild(tooltipText);
    document.body.appendChild(tooltip);
    return tooltip;
};


const getAllClickableElements = (root, rules) => {
    const selectors = rules.map(rule => rule.selector).join(', ');
    return root.querySelectorAll(selectors);
};

const addTooltipListeners = (element, handleMouseEnter, handleMouseLeave) => {
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
};

const handleDOMChanges = (mutations, rules, addTooltipListenersFn) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                const newClickables = getAllClickableElements(node, rules);
                newClickables.forEach(element =>
                    addTooltipListenersFn(element)
                );
            }
        });
    });
};

const updateTooltipText = (tooltip, text) => {
    const tooltipText = tooltip.querySelector('.clickable-tooltip-text');
    tooltipText.innerHTML = text;
};

class ClickableTooltip {
    constructor() {
        this.tooltip = createTooltipElement();
        this.currentHoverTarget = null;
        this.hoverTimeout = null;
        this.hideTimeout = null;
        this.isVisible = false;
        this.rules = getDefaultTooltipRules();
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.initializeListeners();
        this.setupThemeChangeListener();
    }

    initializeListeners() {
        this.addListenersToExistingElements();
        const observer = new MutationObserver(mutations =>
            handleDOMChanges(mutations, this.rules, element =>
                addTooltipListeners(element, this.handleMouseEnter, this.handleMouseLeave)
            )
        );
        observer.observe(document.body, { childList: true, subtree: true });
    }

    setupThemeChangeListener() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (this.isVisible && this.currentHoverTarget.matches('.theme-toggle')) {
                    const updatedDescription = this.getElementDescription(this.currentHoverTarget);
                    this.showTooltip(updatedDescription);
                }
            });
        }
    }

    addListenersToExistingElements() {
        const clickableElements = getAllClickableElements(document, this.rules);
        clickableElements.forEach(element =>
            addTooltipListeners(element, this.handleMouseEnter, this.handleMouseLeave)
        );
    }

    getElementDescription(element) {
        for (const rule of this.rules) {
            if (element.matches(rule.selector)) {
                return rule.description(element);
            }
        }
        return 'Clickable element';
    }

    handleMouseEnter(event) {
        const element = event.target;
        this.currentHoverTarget = element;
        clearTimeout(this.hoverTimeout);
        clearTimeout(this.hideTimeout);
        this.hoverTimeout = setTimeout(() => {
            if (this.currentHoverTarget === element) {
                const description = this.getElementDescription(element);
                this.showTooltip(description);
            }
        }, 3000);
    }

    handleMouseLeave() {
        clearTimeout(this.hoverTimeout);
        this.currentHoverTarget = null;
        if (this.isVisible) {
            this.hideTooltip();
        }
    }

    showTooltip(text) {
        updateTooltipText(this.tooltip, text);
        this.tooltip.classList.add('visible');
        this.isVisible = true;
    }

    hideTooltip() {
        this.tooltip.classList.remove('visible');
        this.isVisible = false;
    }

    addRule(selector, descriptionCallback) {
        this.rules.push({ selector, description: descriptionCallback });
        this.addListenersToExistingElements();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
        new ClickableTooltip();
    }
});