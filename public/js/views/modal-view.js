'use strict';

import View from 'Eventum/core/view.js';
import modalTemplate from 'Blocks/modal-window/template.hbs';
import GetGender from 'Eventum/utils/get-gender.js';

/**
 *
 */
export default class ModalView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    /**
     * Render template
     * @param {JSON} context
     */
    render(context) {
        document.body.insertAdjacentHTML('beforeend', modalTemplate(context));
    }

    renderProfileSettings(context, profile) {
        let profileContext = {
            fields: [
                {
                    id: 'popupPasswd',
                    name: 'Пароль',
                    value: '*'.repeat(profile.password),
                    button: 'Изменить',
                    edit_field: {
                        id: 'passwordId',
                        fields: [
                            {
                                name: 'Старый пароль',
                                type: 'password',
                            },
                            {
                                name: 'Новый пароль',
                                type: 'password',
                            },
                            {
                                name: 'Повторите пароль',
                                type: 'password',
                            },
                        ],
                    }
                },
                {
                    id: 'popupMail',
                    name: 'Email',
                    value: profile.email,
                    edit_field: {
                        id: 'emailId',
                        fields: [
                            {
                                name: 'Новая почта',
                                type: 'email',
                            },
                        ],
                    }
                },
                {
                    id: 'popupPhone',
                    name: 'Телефон',
                    value: `${profile.phone}`,
                    edit_field: {
                        id: 'phoneId',
                        fields: [
                            {
                                name: 'Новый телефон',
                                type: 'tel',
                            },
                        ],
                    }
                },
                {
                    id: 'popupVerif',
                    name: 'Верификация',
                    value: profile.verified ? 'Да' : 'Нет',
                    button: 'Подтвердить',
                },
                {
                    id: 'popupSex',
                    name: 'Пол',
                    value: GetGender(profile.gender),
                },
                {
                    id: 'popupBirth',
                    name: 'Дата рождения',
                    value: '01.01.2000', // todo: fix it
                },
                {
                    id: 'popupLang',
                    name: 'Язык',
                    value: 'Русский',
                },
            ],
        };

        document.body.insertAdjacentHTML('beforeend', modalTemplate(Object.assign({}, context, profileContext)));
    }

    clear() {
        document.body.getElementsByClassName('modal__bg')[0].remove();
    }
}