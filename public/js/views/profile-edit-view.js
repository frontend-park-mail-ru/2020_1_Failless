'use strict';

import View from 'Eventum/core/view.js';
import GetGender from 'Eventum/utils/get-gender.js';
import profileEditTemplate from 'Components/profile-edit/template.hbs';
import editFieldTemplate from 'Blocks/edit-field/template.hbs';
import TextConstants from 'Eventum/utils/language/text';

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

    destructor() {
    }

    /**
     * Render template
     * @param {JSON} profile -  user profile from server
     */
    render(profile) {
        const settingsTemplate = profileEditTemplate({
            fields: [
                {
                    id: 'popupPasswd',
                    name: TextConstants.BASIC__PASSWORD,
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
                    name: TextConstants.BASIC__PHONE,
                    value: `+7 ${profile.phone}`,
                },
                // {
                //     id: 'popupVerif',
                //     name: 'Верификация',
                //     value: profile.verified ? 'Да' : 'Нет',
                //     button: 'Подтвердить',
                // },
                {
                    id: 'popupSex',
                    name: TextConstants.BASIC__GENDER,
                    value: GetGender(profile.gender),
                },
                {
                    id: 'popupBirth',
                    name: TextConstants.BASIC__BIRTH,
                    value: '01.01.2000', // todo: fix it
                },
                {
                    id: 'popupLang',
                    name: TextConstants.BASIC__LANGUAGE,
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
        const template = editFieldTemplate(
            {
                id: 'passwordId',
                fields: [
                    {
                        name: TextConstants.AUTH__OLD_PASS,
                        type: 'password',
                    },
                    {
                        name: TextConstants.AUTH__NEW_PASS,
                        type: 'password',
                    },
                    {
                        name: TextConstants.AUTH__REPEAT_PASS,
                        type: 'password',
                    },
                ],
            });
        parent.innerHTML = '';
        parent.insertAdjacentHTML('beforeend', template);
    }
}