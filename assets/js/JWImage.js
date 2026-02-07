/**
 * File: JWImage.js
 * The JavaScript file wraps images in a div container with specific classes for styling purposes.
 * It parses the alt text of the image to extract text, link, and alignment information.
 * If the alt text contains a link, it is extracted and the remaining text is used as the caption.
 * If the alt text specifies an alignment (left or right), it is applied to the image container.
 * A caption is added to the image container, which can be a plain text or a hyperlink based on the parsed alt text.
 * On document load, the script applies these transformations to all images in the document.
 */

const wrapImageInBox = (image) => {
    const imageBox = document.createElement("div");
    imageBox.classList.add("image-box");
    const { text, link, alignment } = parseAltText(image.alt);
    if (alignment) {
        imageBox.classList.add(`image-box-${alignment}`);
    }
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    image.parentNode.insertBefore(imageBox, image);
    imageWrapper.appendChild(image);
    imageBox.appendChild(imageWrapper);
    if (text) {
        addCaptionToImageBox(imageBox, text, link);
    }
};

const parseAltText = (altText) => {
    if (!altText) {
        return { text: "", link: null, alignment: null };
    }
    const result = { text: altText, link: null, alignment: null };
    const linkMatch = altText.match(/#link=(https?:\/\/[^\s#]+)/);
    if (linkMatch) {
        result.link = linkMatch[1];
        result.text = altText.replace(/#link=[^\s#]+/, "").trim();
    }
    const alignMatch = result.text.match(/#(left|right)\b/);
    if (alignMatch) {
        result.alignment = alignMatch[1];
        result.text = result.text.replace(/#(left|right)\b/, "").trim();
    }
    return result;
};

const addCaptionToImageBox = (imageBox, text, link) => {
    const caption = document.createElement("div");
    caption.classList.add("image-caption");
    if (link) {
        const captionLink = document.createElement("a");
        captionLink.href = link;
        captionLink.textContent = text;
        captionLink.target = "_blank";
        captionLink.rel = "noopener noreferrer";
        caption.appendChild(captionLink);
    } else {
        caption.textContent = text;
    }
    imageBox.appendChild(caption);
};

const wrapAllImagesInBoxes = () => {
    const main = document.querySelector("main");
    if (!main) return;
    const images = main.querySelectorAll("img:not(.image-wrapper img)");
    images.forEach(wrapImageInBox);
};

document.addEventListener("DOMContentLoaded", wrapAllImagesInBoxes);
