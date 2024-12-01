const createCopyButton = () => {
    const button = document.createElement('button');
    button.classList.add('copy-button');
    button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--accent-color);
        color: #fff;
        border: none;
        border-radius: 3px;
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-copy');
    button.appendChild(icon);
    return button;
};

const wrapCodeBlock = (pre) => {
    if (!pre.parentNode.classList.contains('code-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('code-wrapper');
        wrapper.style.position = 'relative';
        pre.parentNode.replaceChild(wrapper, pre);
        wrapper.appendChild(pre);
        return wrapper;
    }
    return pre.parentNode;
};

const addCopyButtonsToCodeBlocks = () => {
    document.querySelectorAll('pre > code').forEach((code) => {
        const pre = code.parentNode;
        const wrapper = wrapCodeBlock(pre);
        if (wrapper.querySelector('.copy-button')) {
            return;
        }
        const copyButton = createCopyButton();
        wrapper.appendChild(copyButton);
        copyButton.addEventListener('click', () => {
            const clonedPre = pre.cloneNode(true);
            clonedPre.querySelectorAll('.lineno').forEach((lineNumber) => lineNumber.remove());
            const codeWithoutLineNumbers = clonedPre.textContent;
            navigator.clipboard.writeText(codeWithoutLineNumbers).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    addCopyButtonsToCodeBlocks();
});
