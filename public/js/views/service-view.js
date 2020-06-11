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
        if (!this.vDOM.input) {
            this.vDOM.input = this.parent.querySelector('.service__input');
        }
        if (!this.vDOM.button) {
            this.vDOM.button = this.parent.querySelector('.service__button');
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
        let button = this.vDOM.button;

        this.#buttonColor('third');
    }

    /**
     * Animate input (hide placeholder)
     */
    animateInput() {
        let input = this.vDOM.input;
        let button = this.vDOM.button;

        if (input.value === '') {
            input.placeholder = '';
        }
        this.#buttonColor('second');
    }

    outerClick() {
        let input = this.vDOM.input;

        if (input.value === '') {
            input.placeholder = 'Email';
            this.#buttonColor('first');
        } else {
            this.#buttonColor('third');
        }

        input.classList.remove('service__input_active');
    }

    #buttonColor(color) {
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

        let button = this.vDOM.button;

        button.classList.remove(`service__button_${second}`, `service__button_${third}`);
        if (!button.classList.contains(`service__button_${color}`)) {
            button.classList.add(`service__button_${color}`);
        }

    }
}