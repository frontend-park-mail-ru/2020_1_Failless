'use strict';

function highlightTag(event) {
    let elem = event.target.closest('.tag__container');
    if (!elem || !(elem.classList.contains('tag__container'))) {
        return;
    }

    elem.classList.toggle('tag__container_active');
}

export {highlightTag};