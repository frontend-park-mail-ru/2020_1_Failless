'use strict';

import MyView from './my-view.js';
import settings from '../../settings/config.js';

/**
 * @class create NewProfileView class
 */
export default class NewProfileView extends MyView {

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
     * @param {
     *  {
     *      birthday: string,
     *      password: string,
     *      gender: string,
     *      phone: string,
     *      name: string,
     *      about: string,
     *      rating: string,
     *      location: string,
     *      avatar: string,
     *      photos: string,
     *      email: string
     *  } } profile -  user profile from server
     */
    render(profile) {
        super.render();

        let allowEdit = true;
        if (profile.avatar.path === null) {
            profile.avatar.path = `${settings.aws}/app/default.png`;
        } else {
            profile.avatar.path = `${settings.aws}/users/${profile.avatar.path}`;
        }

        document.getElementsByClassName('my__left_column__body')[0].insertAdjacentHTML(
            'beforeend', Handlebars.templates['new-profile-left']({
                profile: profile,
            })
        );
        document.getElementsByClassName('my__main_column')[0].insertAdjacentHTML(
            'beforeend', Handlebars.templates['new-profile-main']({
                title: 'Профиль',
                profile: profile,
            })
        );
    }
}