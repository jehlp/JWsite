class ClickableTooltip {
    constructor() {
        this.tooltip = this.createTooltip();
        this.currentHoverTarget = null;
        this.hoverTimeout = null;
        this.hideTimeout = null;
        this.isVisible = false;
        this.rules = this.getDefaultRules();
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.initializeListeners();
        this.setupThemeChangeListener();
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'clickable-tooltip';
        const tooltipText = document.createElement('span');
        tooltipText.className = 'clickable-tooltip-text';
        tooltip.appendChild(tooltipText);
        document.body.appendChild(tooltip);
        return tooltip;
    }

    initializeListeners() {
        this.addListenersToExistingElements();
        const observer = new MutationObserver(this.handleDOMChanges.bind(this));
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
        const clickableElements = this.getAllClickableElements();
        clickableElements.forEach(this.addTooltipListeners.bind(this));
    }

    addTooltipListeners(element) {
        element.addEventListener('mouseenter', this.handleMouseEnter);
        element.addEventListener('mouseleave', this.handleMouseLeave);
    }

    handleDOMChanges(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const newClickables = this.getAllClickableElements(node);
                    newClickables.forEach(this.addTooltipListeners.bind(this));
                }
            });
        });
    }

    getAllClickableElements(root = document) {
        const selectors = this.rules.map(rule => rule.selector).join(', ');
        return root.querySelectorAll(selectors);
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
        }, 1500);
    }

    handleMouseLeave() {
        clearTimeout(this.hoverTimeout);
        this.currentHoverTarget = null;
        if (this.isVisible) {
            this.hideTooltip();
        }
    }

    showTooltip(text) {
        const tooltipText = this.tooltip.querySelector('.clickable-tooltip-text');
        tooltipText.innerHTML = text;
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

    getDefaultRules() {
        return [
            {
                selector: '.section-number',
                description: () => '<i class="fas fa-expand-alt"></i><i class="fas fa-compress-alt"></i> Click to expand or collapse this section',
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
                description: () => '<i class="fas fa-copy"></i> Click to copy the code block',
            },
        ];
    }    
}

document.addEventListener('DOMContentLoaded', () => {
    new ClickableTooltip();
});