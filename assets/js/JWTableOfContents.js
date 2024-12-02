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

const createSectionNumber = (section, subsection, subSubSection) => {
    const number = document.createElement("span");
    number.classList.add("section-number");
    if (subSubSection) {
        number.textContent = `${section}.${subsection}.${subSubSection}.`;
    } else if (subsection) {
        number.textContent = `${section}.${subsection}.`;
    } else {
        number.textContent = `${section}.`;
    }
    return number;
};

const toggleSubListVisibility = (subList) => {
    if (subList) {
        const isExpanded = subList.style.display !== "none";
        subList.style.display = isExpanded ? "none" : "block";
    }
};

const createTOCEntry = (heading, section, subsection, subSubSection) => {
    const item = document.createElement("li");
    const wrapper = document.createElement("div");
    const sectionNumber = createSectionNumber(section, subsection, subSubSection);
    let hasSubList = false;
    if (heading.tagName === "H1" || heading.tagName === "H2") {
        const allHeadings = Array.from(heading.parentNode.querySelectorAll("h1, h2, h3"));
        const headingIndex = Array.from(heading.parentNode.children).indexOf(heading);
        hasSubList = hasSubsections(allHeadings, headingIndex, heading.tagName);
    }
    if (hasSubList) {
        sectionNumber.addEventListener("click", () => {
            const subList = item.querySelector("ol");
            toggleSubListVisibility(subList);
        });
    } else {
        sectionNumber.style.cursor = "default";
        sectionNumber.style.color = "inherit";
    }
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    wrapper.appendChild(sectionNumber);
    wrapper.appendChild(link);
    item.appendChild(wrapper);
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

const hasSubsections = (headings, index, tagName) => {
    for (let i = index + 1; i < headings.length; i++) {
        if (headings[i].tagName > tagName) {
            return true;
        }
        if (headings[i].tagName <= tagName) {
            break;
        }
    }
    return false;
};

const generateTOC = (headings, tocList) => {
    let sectionCount = 0,
        subSectionCount = 0,
        subSubSectionCount = 0;
    let currentSection = null,
        currentSubSection = null;
    headings.forEach((heading, index) => {
        ensureHeadingId(heading);
        if (heading.tagName === "H1") {
            sectionCount++;
            subSectionCount = subSubSectionCount = 0;
            currentSection = createTOCEntry(heading, sectionCount);
            tocList.appendChild(currentSection);
            if (hasSubsections(headings, index, "H1")) {
                addSubListToSection(currentSection);
            }
        } else if (heading.tagName === "H2" && currentSection) {
            subSectionCount++;
            subSubSectionCount = 0;
            const subList = addSubListToSection(currentSection);
            currentSubSection = createTOCEntry(heading, sectionCount, subSectionCount);
            subList.appendChild(currentSubSection);
            if (hasSubsections(headings, index, "H2")) {
                addSubListToSection(currentSubSection);
            }
        } else if (heading.tagName === "H3" && currentSubSection) {
            subSubSectionCount++;
            const subSubList = addSubListToSection(currentSubSection);
            const subSubItem = createTOCEntry(
                heading,
                sectionCount,
                subSectionCount,
                subSubSectionCount
            );
            subSubList.appendChild(subSubItem);
        }
    });
};

const splitContentByTOC = (contentNodes, endIndex) => {
    const alongsideToc = document.createElement("div");
    alongsideToc.classList.add("alongside-toc");
    const afterToc = document.createElement("div");
    afterToc.classList.add("after-toc");
    contentNodes.forEach((node, index) => {
        const clone = node.cloneNode(true);
        index <= endIndex ? alongsideToc.appendChild(clone) : afterToc.appendChild(clone);
    });
    return { alongsideToc, afterToc };
};

const findTOCEndIndex = (contentNodes) =>
    contentNodes.findIndex(
        (node, index) => node.nodeType === 1 && (node.tagName === "H2" || index >= 3)
    ) || -1;

const initializeTOC = (main) => {
    const { container, list } = createTOCContainer();
    const contentNodes = Array.from(main.childNodes);
    const headings = Array.from(main.querySelectorAll("h1, h2, h3"));
    if (!headings.length) {
        return;
    }
    const tocEndIndex = findTOCEndIndex(contentNodes);
    generateTOC(headings, list);
    const { alongsideToc, afterToc } = splitContentByTOC(contentNodes, tocEndIndex);
    main.innerHTML = "";
    main.appendChild(container);
    main.appendChild(alongsideToc);
    main.appendChild(afterToc);
};

document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");
    if (main) {
        initializeTOC(main);
    }
});
