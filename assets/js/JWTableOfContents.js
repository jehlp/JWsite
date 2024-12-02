const createTOCContainer = () => {
    const container = document.createElement("div");
    container.classList.add("toc-container");
    const title = document.createElement("h2");
    title.textContent = "Contents";
    const list = document.createElement("ol");
    container.appendChild(title);
    container.appendChild(list);
    return { container, list };
};

const ensureHeadingId = (heading) => {
    if (!heading.id) {
        heading.id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
};

const createTOCLink = (heading, section, subsection, subSubSection) => {
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    if (subSubSection) {
        link.textContent = `${section}.${subsection}.${subSubSection}. ${heading.textContent}`;
    } else if (subsection) {
        link.textContent = `${section}.${subsection}. ${heading.textContent}`;
    } else {
        link.textContent = `${section}. ${heading.textContent}`;
    }
    return link;
};

const appendTOCItem = (list, link) => {
    const item = document.createElement("li");
    item.appendChild(link);
    list.appendChild(item);
    return item;
};

const addSubListToSection = (section) => {
    let subList = section.querySelector("ol");
    if (!subList) {
        subList = document.createElement("ol");
        section.appendChild(subList);
    }
    return subList;
};

const generateTOC = (headings, tocList) => {
    let sectionCount = 0;
    let subSectionCount = 0;
    let subSubSectionCount = 0;
    let currentSection = null;
    let currentSubSection = null;
    for (const heading of headings) {
        ensureHeadingId(heading);
        if (heading.tagName === "H1") {
            sectionCount += 1;
            subSectionCount = 0;
            subSubSectionCount = 0;
            const link = createTOCLink(heading, sectionCount);
            currentSection = appendTOCItem(tocList, link);
            currentSubSection = null; 
        } else if (heading.tagName === "H2" && currentSection) {
            subSectionCount += 1;
            subSubSectionCount = 0;
            const link = createTOCLink(heading, sectionCount, subSectionCount);
            const subList = addSubListToSection(currentSection);
            currentSubSection = appendTOCItem(subList, link);
        } else if (heading.tagName === "H3" && currentSubSection) {
            subSubSectionCount += 1;
            const link = createTOCLink(
                heading,
                sectionCount,
                subSectionCount,
                subSubSectionCount
            );
            const subSubList = addSubListToSection(currentSubSection);
            appendTOCItem(subSubList, link);
        }
    }
};

const createContentSections = (contentNodes, endIndex) => {
    const alongsideToc = document.createElement("div");
    alongsideToc.classList.add("alongside-toc");
    const afterToc = document.createElement("div");
    afterToc.classList.add("after-toc");
    for (let index = 0; index < contentNodes.length; index++) {
        const node = contentNodes[index];
        if (index <= endIndex) {
            alongsideToc.appendChild(node.cloneNode(true));
        } else {
            afterToc.appendChild(node.cloneNode(true));
        }
    }
    return { alongsideToc, afterToc };
};

const findTOCEndIndex = (contentNodes) => {
    for (let index = 0; index < contentNodes.length; index++) {
        const node = contentNodes[index];
        if (node.nodeType === 1 && (node.tagName === "H2" || index >= 3)) {
            return index;
        }
    }
    return -1;
};

const initializeTOC = (main) => {
    const { container: tocContainer, list: tocList } = createTOCContainer();
    const contentNodes = Array.from(main.childNodes);
    const headings = Array.from(main.querySelectorAll("h1, h2, h3"));
    if (headings.length === 0) {
        return;
    }
    const tocEndIndex = findTOCEndIndex(contentNodes);
    generateTOC(headings, tocList);
    const { alongsideToc, afterToc } = createContentSections(contentNodes, tocEndIndex);
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
    main.appendChild(tocContainer);
    main.appendChild(alongsideToc);
    main.appendChild(afterToc);
};

document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");
    if (main) {
        initializeTOC(main);
    }
});