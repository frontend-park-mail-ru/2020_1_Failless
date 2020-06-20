'use strict';

import Controller from 'Eventum/core/controller';
import ServiceView from 'Eventum/views/service-view';
import EmailModel from 'Eventum/models/email-model';
import Snackbar from 'Blocks/snackbar/snackbar';
import ValidationModule from 'Eventum/utils/validation';
import TextConstants from 'Eventum/utils/language/text';

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
                if (!this.view.button.classList.contains('service__button_third')) {
                    this.view.buttonColor('first');
                }
            }
        });
        this.addEventHandler(window, 'keydown', (event) => {
            if (event.code === 'Enter') {
                this.#handleClickOnButton();
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
            this.#handleClickOnButton();
        } else if (input.value === '') {
            input.placeholder = 'Email';
        }
    };

    #handleClickOnButton() {
        let input = this.view.input;
        let errors = this.#emailCorrect();
        if (errors.length !== 0) {
            this.view.showInvalidEmail(errors[0]);
            this.view.buttonColor('first');
        } else {
            this.#sendEmail(input.value);
            this.view.clearInput();
            Snackbar.instance.addMessage(TextConstants.SERVICE__EMAIL_SENT);
            this.view.buttonColor('third');
            setTimeout(() => {
                this.view.buttonColor('first');
            }, 5000);
        }
        input.blur();
    }

    async #sendEmail(email) {
        await EmailModel.sendNotify(email);
    }

    #emailCorrect() {
        return ValidationModule.validateEmail(this.view.input.value);
    }
}