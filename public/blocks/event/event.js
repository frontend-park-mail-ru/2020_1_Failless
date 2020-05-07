export {determineClass, changeActionText, toggleActionText};

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
