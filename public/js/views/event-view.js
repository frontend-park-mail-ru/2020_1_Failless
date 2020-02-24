'use strict';

import View from '../core/view.js';

export default class EventView extends View {

    constructor(parent) {
        super(parent);
    }

    render(event) {
        const template = [
            { block: 'link' },
            { tag: 'br' },
            { block: 'link', url: '/', content: 'Home link' },
            { tag: 'br' },
            { block: 'link', target: '_blank', url: '/' },
            { tag: 'br' },
            { block: 'link', mods: { disabled: true }, url: '/' }
          ];
        this.parent.insertAdjacentHTML('beforeend', bemhtml.apply(template));
    }
}