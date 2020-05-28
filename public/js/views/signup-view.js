'use strict';

import View from 'Eventum/core/view.js';
import authTemplate from 'Components/auth/template.hbs';
import TextConstants from 'Eventum/utils/language/text';

/**
 *
 */
export default class SignUpView extends View {

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
            data_bind: 'signup',
            title: TextConstants.BASIC__SIGNUP.toUpperCase(),
            title_style: 'auth__title__reg',
            input: [
                {
                    title: TextConstants.BASIC__NAME,
                    type: 'text',
                    placeholder: TextConstants.BASIC__RANDOM_NAME,
                    autocomplete: 'name',
                    name: 'name',
                    others: ['required', 'autofocus', 'signup'],
                },
                {
                    title: 'Email',
                    type: 'email',
                    name: 'email',
                    autocomplete: 'email',
                    placeholder: 'your@mail.com',
                },
                {
                    title: TextConstants.BASIC__PHONE,
                    type: 'tel',
                    autocomplete: 'tel',
                    name: 'phone',
                    placeholder: '+7 (800) 555-35-35',
                    others: ['required'],
                },
                {
                    title: TextConstants.BASIC__PASSWORD,
                    type: 'password',
                    name: 'password',
                    placeholder: '*******',
                    others: ['required'],
                },
                {
                    title: TextConstants.AUTH__REPEAT_PASS,
                    type: 'password',
                    name: 'passwordC',
                    placeholder: '*******',
                    others: ['required', 'second_password'],
                },
            ],
            button: TextConstants.AUTH__REG_ACTION,
        });
    }
}