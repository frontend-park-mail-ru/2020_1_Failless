'use strict';

function changeActionText(textElement, color, message) {
    textElement.classList.remove('font__color_black');
    textElement.classList.add(`font__color_${color}`);
    textElement.innerText = message;
}

export {changeActionText};