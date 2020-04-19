export {makeEmpty};

function makeEmpty(element) {
    while (element.lastElementChild) {
        element.removeChild(element.lastElementChild);
    }
}