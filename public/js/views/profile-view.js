'use strict';

import MyView from 'Eventum/views/my-view';
import settings from 'Settings/config';
import profileLeftTemplate from 'Blocks/profile-left/template.hbs';
import profileMainTemplate from 'Components/profile-main/template.hbs';
import eventCardTemplate from 'Blocks/event/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';

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
        this.subscriptions = null;
    }

    get subscriptionsDiv() {
        this.setDOMProfileElements();
        return this.subscriptionsArea;
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

        // let allowEdit = true;
        if (!profile.avatar.path) {
            profile.avatar.path = 'default.png';
        }

        if ('tags' in profile) {
            if (!profile.tags) {
                profile.tags = [];
            } else {
                profile.tags.forEach((tag) => {
                    tag.activeClass = 'tag__container_active';
                    tag.editable = true;
                });
            }
        }

        document.getElementsByClassName('my__left-column-body')[0].insertAdjacentHTML(
            'beforeend', profileLeftTemplate({
                profile: profile,
                avatar: `${settings.aws}/users/${profile.avatar.path}`,
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

    setDOMProfileElements() {
        while (!this.subscriptionsArea) {
            this.subscriptionsArea = document.querySelector('.profile-main__subscriptions');
        }
    }

    /**
     * This function depends on non-empty chats
     * so check it somewhere outside
     * @param subscriptions[{event}]
     * @return {Promise<void>}
     */
    async renderSubscriptions(subscriptions) {
        const subsArea = this.subscriptionsDiv;
        makeEmpty(subsArea);

        subscriptions.forEach((sub) => {
            subsArea.insertAdjacentHTML('beforeend', eventCardTemplate(sub));
        });
    }

    /**
     * Show error in subscription div
     * @return {Promise<void>}
     */
    async renderSubscriptionsError() {
        this.showError(this.subscriptionsDiv, 'Error in subscriptions', 'warning', null);
    }

    drawEventCard(eventInfo) {
        document.querySelector('.profile-main__group').insertAdjacentHTML(
            'afterbegin', eventCardTemplate(eventInfo));
    }
}