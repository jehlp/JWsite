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
    const images = document.querySelectorAll("img");
    images.forEach(wrapImageInBox);
};

document.addEventListener("DOMContentLoaded", wrapAllImagesInBoxes);
