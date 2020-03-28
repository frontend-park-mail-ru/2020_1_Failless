function highlightTag(event) {
    let elem = event.target.closest('.tag__container');
    if (!elem || !(elem.classList.contains('tag__container'))) {
        return;
    }

    elem.classList.contains('tag__container__active')
        ? elem.classList.remove('tag__container__active')
        : elem.classList.add('tag__container__active');
}

export {highlightTag};