'use strict';

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
        this.parent.innerHTML = '';
    }

    /**
     * Create action
     */
    action() {
    }
}
