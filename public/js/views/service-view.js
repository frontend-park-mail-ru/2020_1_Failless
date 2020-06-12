'use strict';

import View from 'Eventum/core/view';
import ServiceTemplate from 'Components/service/template.hbs';

export default class ServiceView extends View {
    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
        this.vDOM = {
            notify: null,
            input: null,
            button: null,
        };
    }

    render() {
        this.parent.innerHTML = ServiceTemplate({
            MESSAGE: 'В данный момент мы в поте лица наводим марафет всему сервису<br>Мы можем сообщить вам, как только всё снова заработает<br>Благодарим Вас за терпение',
            BUTTON: 'Уведомить',
        });
        this.setvDOM();
    }

    setvDOM() {
        if (!this.input) {
            this.input = this.parent.querySelector('.service__input');
        }
        if (!this.button) {
            this.button = this.parent.querySelector('.service__button');
        }
        if (!this.notify) {
            this.notify = this.parent.querySelector('.service__notify');
        }
    }

    /**
     * Animate elements of notifier
     * @param event {Event}
     */
    inputHandler(event) {
        if (event.target.matches('.service__input')) {
            this.animateInput();
        } else if (event.target.matches('.service__button')) {
            this.handleButton();
        } else {
            this.outerClick();
        }
    }

    handleButton() {
        this.buttonColor('third');
    }

    /**
     * Animate input (hide placeholder)
     */
    animateInput() {
        let input = this.input;
        if (input.value === '') {
            input.placeholder = '';
        }
        this.buttonColor('second');
    }

    outerClick() {
        let input = this.input;

        if (input.value === '') {
            input.placeholder = 'Email';
            this.buttonColor('first');
        } else {
            this.buttonColor('third');
        }

        input.classList.remove('service__input_active');
    }

    /**
     * @param color {'first' | 'second' | 'third'}
     */
    buttonColor(color) {
        let main = color, second, third;
        if (color === 'first') {
            second = 'second';
            third = 'third';
        } else if (color === 'second') {
            second = 'first';
            third = 'third';
        } else if (color === 'third') {
            second = 'first';
            third = 'second';
        } else {
            return;
        }

        let button = this.button;

        button.classList.add(`service__button_${color}`);
        button.classList.remove(`service__button_${second}`, `service__button_${third}`);
    }

    async removeErrors() {
        let errors = this.parent.querySelectorAll('.service__error');
        if (errors) {
            errors.forEach(error => error.remove());
        }
        this.input.classList.remove('service__input_error');
        this.button.classList.remove('service__button_error');
    }

    async showInvalidEmail() {
        this.input.classList.add('service__input_error');
        this.button.classList.add('service__button_error');

        if (this.parent.querySelectorAll('.service__error').length === 0) {
            this.#createError()
                .then(error => this.input.insertAdjacentElement('beforebegin', error));
        }
    }

    /**
     * @return {Promise<HTMLDivElement>}
     */
    async #createError() {
        let div = document.createElement('div');
        div.innerText = 'Invalid email';
        div.classList.add('service__error');
        return div;
    }

    async clearInput() {
        this.input.value = '';
        this.input.placeholder = 'Email';
    }

    /**
     * @return {HTMLInputElement}
     */
    get input() {
        return this.vDOM.input;
    }

    /**
     * @param any {HTMLInputElement}
     */
    set input(any) {
        this.vDOM.input = any;
    }

    /**
     * @return {HTMLElement}
     */
    get button() {
        return this.vDOM.button;
    }

    /**
     * @param any {HTMLElement}
     */
    set button(any) {
        this.vDOM.button = any;
    }

    /**
     * @return {HTMLElement}
     */
    get notify() {
        return this.vDOM.notify;
    }

    /**
     * @param any {HTMLElement}
     */
    set notify(any) {
        this.vDOM.notify = any;
    }
}