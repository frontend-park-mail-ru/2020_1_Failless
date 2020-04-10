export {makeEmpty};

function makeEmpty(element) {
    // Remove all tagsField children
    while (element.lastElementChild) {
        element.removeChild(element.lastElementChild);
    }
}