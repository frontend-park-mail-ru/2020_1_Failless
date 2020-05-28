'use strict';

import View from 'Eventum/core/view';
import authTemplate from 'Components/auth/template.hbs';
import TextConstants from 'Eventum/utils/language/text';

/**
 * @class create LoginView class
 */
export default class LoginView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    destructor() {
    }

    /**
     * Render template
     */
    render() {
        this.parent.innerHTML += authTemplate({
            data_bind: 'login',
            title: TextConstants.AUTH__LOGIN_TITLE.toUpperCase(),
            input: [
                {
                    title: TextConstants.AUTH__LOGIN_LABEL,
                    type: 'text',
                    placeholder: 'me@example.com',
                    others: ['required', 'autofocus', 'login'],
                },
                {
                    title: TextConstants.BASIC__PASSWORD,
                    type: 'password',
                    placeholder: '*******',
                    others: ['required'],
                },
            ],
            button: TextConstants.BASIC__LOGIN,
        });
    }
}