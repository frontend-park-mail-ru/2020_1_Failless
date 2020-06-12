'use strict';

import Controller from 'Eventum/core/controller';
import ServiceView from 'Eventum/views/service-view';
import EmailModel from 'Eventum/models/email-model';
import Snackbar from 'Blocks/snackbar/snackbar';
import ValidationModule from 'Eventum/utils/validation';

export default class ServiceController extends Controller {
    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new ServiceView(parent);
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    action() {
        super.action();
        this.view.render();
        this.initHandlers([
            {
                attr: 'animateNotify',
                events: [
                    {type: 'click', handler: this.#handleClick},
                ],
            },
        ]);

        this.addEventHandler(document.body, 'click', (event) => {
            if (!event.target.matches('.service__input') && this.view.input.value === '') {
                this.view.input.placeholder = 'Email';
                this.view.buttonColor('first');
            }
        })
    }

    #handleClick = (event) => {
        this.view.removeErrors();
        let input = this.view.input;
        if (event.target.matches('.service__input')) {
            if (input.value === '') {
                input.placeholder = '';
            }
            this.view.buttonColor('second');
        } else if (event.target.matches('.service__button')) {
            if (input.value !== '' && this.#emailCorrect().length !== 0) {
                this.view.showInvalidEmail();
            } else {
                this.#sendEmail(input.value);
                this.view.clearInput();
                Snackbar.instance.addMessage('Email has been sent. Thank you');
            }
            this.view.buttonColor('first');
        } else if (input.value === '') {
            input.placeholder = 'Email';
        }
    };

    async #sendEmail(email) {
        await EmailModel.sendNotify(email);
    }

    #emailCorrect() {
        return ValidationModule.validateEmail(this.view.input.value);
    }
}