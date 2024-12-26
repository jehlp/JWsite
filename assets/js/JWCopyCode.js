/**
 * File: JWCopyCode.js
 * The JavaScript file adds a copy button to code blocks on a webpage.
 * The copy button is created using the 'createCopyButton' function, which generates a button element with a copy icon.
 * The 'wrapCodeBlock' function wraps the code block in a div element to position the copy button relative to the code block.
 * The 'addCopyButtonsToCodeBlocks' function iterates over all code blocks, adds the copy button, and sets up a click event listener.
 * On clicking the copy button, the code block's content is copied to the clipboard, and the button's icon changes to a check mark for 2 seconds.
 * The copy button is added to all code blocks once the webpage has fully loaded.
 */

const createCopyButton = () => {
    const button = document.createElement('button');
    button.classList.add('copy-button');
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

window.addEventListener('load', () => {
    addCopyButtonsToCodeBlocks();
});