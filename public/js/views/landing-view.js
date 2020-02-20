'use strict';

import View from '../core/view';

/**
 *
 */
export default class LandingView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    render() {
        const template = [
            {
                block: 'login-popup',
                content: [
                    {
                        block: 'title',
                        wrappedInside: 'login-popup',
                        wrappedAs: 'title',
                        content: 'Вход',
                    }
                ]
            }
        ];
        this.parent.insertAdjacentHTML('beforeend', bemhtml.apply(template));
    }
}