const createPDFContent = () => {
    const content = document.querySelector('main').cloneNode(true);
    const container = document.createElement('div');
    container.classList.add('pdf-container');
    container.appendChild(content);
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    content.setAttribute('data-theme', currentTheme);
    const removableElements = ['.theme-toggle', '.download-button', 'nav', 'footer'];
    removableElements.forEach(selector => content.querySelectorAll(selector).forEach(element => element.remove()));
    return container;
};

const handleCodeBlocks = content => {
    content.querySelectorAll('pre').forEach(pre => {
        if (pre.parentNode) {
            pre.querySelectorAll('.lineno').forEach(lineNumber => lineNumber.remove());
            const span = document.createElement('span');
            span.textContent = pre.textContent || pre.innerText;
            span.style.cssText = `
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10pt;
                display: block;
                white-space: pre;
                margin: 1em 0;
                color: inherit; 
                background: none; 
            `;
            pre.parentNode.replaceChild(span, pre);
        } 
    });
};

const handleInlineCode = content => {
    content.querySelectorAll('code:not(pre code)').forEach(code => {
        const span = document.createElement('span');
        span.textContent = code.textContent || code.innerText;
        span.style.cssText = `
            font-family: 'IBM Plex Mono', monospace;
            font-size: 10pt;
        `;
        code.parentNode.replaceChild(span, code);
    });
};

const captureContentToCanvas = async content => {
    return await html2canvas(content, {
        scale: 2, 
        useCORS: true, 
        letterRendering: true, 
        scrollX: 0, 
        scrollY: 0, 
        windowWidth: content.offsetWidth, 
        logging: false, 
        backgroundColor: '#ffffff'
    });
};

const addImagesToPDF = (pdf, canvas, pdfWidth, pdfHeight, pageWidth, pageHeight) => {
    let remainingHeight = pdfHeight, currentPage = 1;
    while (remainingHeight > pageHeight - 80) {
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 40, 40 - (pageHeight - 80) * currentPage, pdfWidth, pdfHeight, null, 'FAST');
        remainingHeight -= (pageHeight - 80);
        currentPage++;
    }
};

const downloadAsPDF = async () => {
    const { jsPDF } = window.jspdf;
    const content = createPDFContent();
    handleCodeBlocks(content);
    handleInlineCode(content);
    const originalTitle = document.title;
    document.title = document.querySelector('h1')?.textContent || originalTitle;
    document.body.appendChild(content);
    const canvas = await captureContentToCanvas(content);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4', putOnlyUsedFonts: true, compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pdfWidth = pageWidth - 80;
    const pdfHeight = pdfWidth / (canvas.width / canvas.height);
    pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 40, 40, pdfWidth, pdfHeight, null, 'FAST');
    if (pdfHeight > pageHeight - 80) {
        addImagesToPDF(pdf, canvas, pdfWidth, pdfHeight, pageWidth, pageHeight);
    }
    pdf.save(`${document.title}.pdf`);
    document.body.removeChild(content);
    document.title = originalTitle;
};

document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.querySelector('.download-button');
    if (downloadButton) downloadButton.addEventListener('click', event => {
        event.preventDefault();
        downloadAsPDF();
    });
});
