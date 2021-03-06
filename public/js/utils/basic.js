'use strict';

import loadingTemplate from 'Blocks/loading/template.hbs';

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
    element.insertAdjacentHTML('beforeend', loadingTemplate());
}

export {makeEmpty, detectMobile, resizeTextArea, showLoading};