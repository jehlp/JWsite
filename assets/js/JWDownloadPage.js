function downloadAsPDF() {
    const originalTitle = document.title;
    document.title = document.querySelector('h1')?.textContent || originalTitle;
    window.print();
    document.title = originalTitle;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.download-pdf')) {
        const main = document.querySelector('main');
        const downloadSection = document.createElement('div');
        downloadSection.className = 'footnotes download-pdf';
        downloadSection.style.order = '9999';
        downloadSection.innerHTML = `<div class="download-button"><i class="fas fa-file-pdf"></i><h2>Download page as PDF</h2></div>`;
        main.appendChild(downloadSection);
        downloadSection.addEventListener('click', (event) => { event.preventDefault(); downloadAsPDF(); });
        main.style.display = 'flex';
        main.style.flexDirection = 'column';
    }
});