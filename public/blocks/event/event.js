import {staticTags} from 'Eventum/utils/static-data';

export {determineClass, prepareEventForRender, changeActionText, toggleActionText};

function determineClass(event) {
    if (event.limit === 2) {
        event.small = true;
        event.class = 'small';
    } else if (Object.prototype.hasOwnProperty.call(event, 'author')) {
        event.mid = true;
        event.class = 'mid';
    } else {
        event.big = true;
        event.class = 'big';
    }
}

/**
 * Fill all necessary fields for render
 * @param event {{
 *     tags: Array<number>|null,
 *     date: string,
 * }}
 * @param type {string}
 */
function prepareEventForRender(event, type) {
    if (event.tags) {
        event.tags = event.tags.map((tag) => {
            let newTag = staticTags[tag - 1];
            newTag.activeClass = 'tag__container_active';
            return newTag;});
    }
    event[type] = true;
    event.class = type; // basically Object.defineProperty
    event.date = new Date(event.date).toLocaleString();
}

function changeActionText(textElement, color, message) {
    textElement.classList.remove('font__color_black');
    textElement.classList.add(`font__color_${color}`);
    textElement.innerText = message;
}

function toggleActionText(textElement, message) {
    textElement.classList.toggle('font__color_red');
    textElement.classList.toggle('font__color_green');
    textElement.innerText = message;
}
