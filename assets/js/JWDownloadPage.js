const { jsPDF } = window.jspdf;

const formatCodeBlock = (pre) => {
    if (pre.parentNode === null) {
        return;
    }
    pre.querySelectorAll('.lineno').forEach((lineNumber) => lineNumber.remove());
    const span = document.createElement('span');
    span.textContent = pre.textContent || pre.innerText;
    span.classList.add('formatted-code-block');
    pre.parentNode.replaceChild(span, pre);
};

const formatInlineCode = (code) => {
    const span = document.createElement('span');
    span.textContent = code.textContent || code.innerText;
    span.classList.add('formatted-inline-code');
    code.parentNode.replaceChild(span, code);
};

const preparePDFContent = () => {
    const container = document.createElement('div');
    container.classList.add('pdf-container', 'pdf-content');
    const content = document.querySelector('main').cloneNode(true);
    ['.theme-toggle', '.download-button', 'nav', 'footer', '.copy-button', '.image-caption'].forEach((selector) =>
        content.querySelectorAll(selector).forEach((element) => element.remove())
    );
    content.querySelectorAll('pre').forEach(formatCodeBlock);
    content.querySelectorAll('code:not(pre code)').forEach(formatInlineCode);
    container.appendChild(content);
    return container;
};

const captureContent = async (content) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return html2canvas(content, {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollX: -50,
        scrollY: 0,
        width: 1000,
        windowWidth: 1000,
        backgroundColor: '#ffffff',
        onclone: (doc) => {
            const clone = doc.querySelector('.pdf-content');
            clone.style.opacity = '1';
            clone.style.position = 'static';
            clone.style.backgroundColor = '#ffffff';
        }
    });
};

const addPDFPages = (pdf, canvas, dims) => {
    let remainingHeight = dims.contentHeight;
    let currentPage = 0;
    while (remainingHeight > 0) {
        if (currentPage > 0) {
            pdf.addPage();
        }
        pdf.addImage(
            canvas.toDataURL('image/jpeg', 1.0),
            'JPEG',
            dims.margin,
            dims.margin - (dims.pageHeight - dims.margin * 2) * currentPage,
            dims.contentWidth,
            dims.contentHeight,
            null,
            'FAST'
        );
        remainingHeight -= dims.pageHeight - dims.margin * 2;
        currentPage += 1;
    }
};

const createPDF = async (content) => {
    const canvas = await captureContent(content);
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
    });
    const dims = {
        margin: 40,
        pageWidth: pdf.internal.pageSize.getWidth(),
        pageHeight: pdf.internal.pageSize.getHeight()
    };
    dims.contentWidth = dims.pageWidth - dims.margin * 2;
    dims.contentHeight = dims.contentWidth / (canvas.width / canvas.height);
    addPDFPages(pdf, canvas, dims);
    return pdf;
};

const downloadAsPDF = async () => {
    const originalTitle = document.title;
    const mainHeading = document.querySelector('h1');
    const newTitle = mainHeading ? mainHeading.textContent : originalTitle;
    try {
        const content = preparePDFContent();
        document.body.appendChild(content);
        document.title = newTitle;
        const pdf = await createPDF(content);
        pdf.save(`${document.title}.pdf`);
        document.body.removeChild(content);
        document.title = originalTitle;
    } catch (error) {
        const content = document.querySelector('.pdf-content');
        if (content) {
            document.body.removeChild(content);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.querySelector('.download-button');
    if (downloadButton) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (!isMobile) {
            downloadButton.addEventListener('click', (event) => {
                event.preventDefault();
                downloadAsPDF();
            });
        } else {
            downloadButton.style.display = 'none';
        }
    }
});