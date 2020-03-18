'use strict';

import View from '../core/view.js';
import GetGender from '../utils/get-gender.js';


/**
 *
 */
export default class ProfileEditView extends View {

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
     * @param {JSON} profile -  user profile from server
     */
    render(profile) {
        const settingsTemplate = Handlebars.templates['profile-edit']({
            fields: [
                {
                    id: 'popupPasswd',
                    name: 'Пароль',
                    value: '*'.repeat(profile.password),
                    button: 'Изменить',
                },
                {
                    id: 'popupMail',
                    name: 'Email',
                    value: profile.email,
                },
                {
                    id: 'popupPhone',
                    name: 'Телефон',
                    value: `+7 ${profile.phone}`,
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
        });

        this.parent.insertAdjacentHTML('beforeend', settingsTemplate);
    }

    /**
     *
     * @param parent
     */
    renderPasswordForm(parent) {
        const template = Handlebars.templates['edit-field'](
            {
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
            });
        parent.innerHTML = '';
        parent.insertAdjacentHTML('beforeend', template);
    }
}