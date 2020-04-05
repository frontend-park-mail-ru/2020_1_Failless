'use strict';

function highlightTag(event) {
    let elem = event.target.closest('.tag__container');
    if (!elem || !(elem.classList.contains('tag__container'))) {
        return;
    }

    elem.classList.contains('tag__container_active')
        ? elem.classList.remove('tag__container_active')
        : elem.classList.add('tag__container_active');
}

export {highlightTag};