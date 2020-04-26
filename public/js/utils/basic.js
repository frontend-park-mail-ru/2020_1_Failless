const MOBILE_VIEW_PORT = 480;

function makeEmpty(element) {
    while (element.lastElementChild) {
        element.removeChild(element.lastElementChild);
    }
}

function detectMobile() {
    return window.innerWidth <= MOBILE_VIEW_PORT;
}

export {makeEmpty, detectMobile};