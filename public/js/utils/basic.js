'use strict';

import loadingTemplate from 'Blocks/loading/template.hbs';
import TextConstants from 'Eventum/utils/language/text';

const MOBILE_VIEW_PORT = 480;

function makeEmpty(element) {
    while (element.lastElementChild) {
        element.removeChild(element.lastElementChild);
    }
}

function detectMobile() {
    return window.innerWidth <= MOBILE_VIEW_PORT;
}

/**
 * Resize textarea vertically according to its content
 */
function resizeTextArea() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight + 2) + 'px';
}

async function showLoading(element) {
    element.insertAdjacentHTML('beforeend', loadingTemplate({LOADING: TextConstants.BASIC__LOADING}));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export {makeEmpty, detectMobile, resizeTextArea, showLoading, capitalizeFirstLetter};