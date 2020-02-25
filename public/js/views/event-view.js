'use strict';

import View from '../core/view.js';

/**
 * @class EventView
 */
export default class EventView extends View {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
    }

    /**
     * Create Event page
     * @param {JSON} event data
     */
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