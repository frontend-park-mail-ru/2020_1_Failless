'use strict';

import createHeader from '../header.js';

/**
 * @class Basic controller class
 */
export default class Controller {

    /**
     * Construct obj of basic controller class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * virtual destructor
     */
    destructor() {
        console.log('I call the police');
        this.parent.innerHTML = '';
    }

    /**
     * Create action
     */
    action() {
        console.log('She\'s kind of cute');
        createHeader(this.parent);
    }
}
