'use strict';

import MyView from 'Eventum/views/my-view.js';
import settings from 'Settings/config.js';
import profileLeftTemplate from 'Blocks/profile-left/template.hbs';
import profileMainTemplate from 'Components/profile-main/template.hbs';

/**
 * @class create ProfileView class
 */
export default class ProfileView extends MyView {

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
     *      email: string,
     *      tags: {
     *          title: string,
     *          id: string,
     *      }
     *  } } profile -  user profile from server
     */
    render(profile) {
        super.render();

        let allowEdit = true;
        if (profile.avatar.path === null) {
            profile.avatar.path = 'default.png';
        }

        if ('tags' in profile) {
            if (!profile.tags) {
                profile.tags = [];
            } else {
                profile.tags.forEach((tag) => {
                    tag.active_class = 'tag__container__active';
                    tag.editable = true;
                });
            }
        }

        document.getElementsByClassName('my__left-column-body')[0].insertAdjacentHTML(
            'beforeend', profileLeftTemplate({
                profile: profile,
                url: `${settings.aws}/users`,
            })
        );
        document.getElementsByClassName('my__main-column-body')[0].insertAdjacentHTML(
            'beforeend', profileMainTemplate({
                title: 'Профиль',
                url: `${settings.aws}/users`,
                profile: profile,
            })
        );
    }
}