export {makeEmpty};

function makeEmpty(element) {
    while (element.lastElementChild) {
        element.lastElementChild.remove();
    }
}