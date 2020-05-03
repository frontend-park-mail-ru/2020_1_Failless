'use strict';

import Button from 'Blocks/button-comp/button-comp';
import MyView from 'Eventum/views/my-view';
import settings from 'Settings/config';
import profileLeftTemplate from 'Blocks/profile-left/template.hbs';
import profileMainTemplate from 'Components/profile-main/template.hbs';
import eventCardTemplate from 'Blocks/event/template.hbs';
import errorTemplate from 'Blocks/error/template.hbs';
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
        this.personalEvents = null;

        this.vDOM = {
            leftColumn: {
                comp: null,
                element: null,
            },
            mainColumn: {
                comp: null,
                element: null,
                subscriptions: null,
                personalEvents: null,
            },
        };
    }

    get subscriptionsDiv() {
        this.setDOMProfileElements();
        return this.subscriptions;
    }

    get personalEventsDiv() {
        this.setDOMProfileElements();
        return this.personalEvents;
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

        // Create components
        const buttonLogout = new Button({
            style: 're_btn re_btn__outline logout',
            state: null,
            text: 'Выйти',
            data_bind: 'logout',
        });

        this.vDOM.leftColumn.logout_button = {
            comp: buttonLogout,
            element: null,
        };

        document.getElementsByClassName('my__left-column-body')[0].insertAdjacentHTML(
            'beforeend', profileLeftTemplate({
                profile: profile,
                avatar: `${settings.aws}/users/${profile.avatar.path}`,
                button_logout: buttonLogout.data,
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
        while (!this.subscriptions) {
            this.subscriptions = document.querySelector('.profile-main__subscriptions');
        }
        while (!this.personalEvents) {
            this.personalEvents = document.querySelector('.profile-main__personal-events');
        }
        while (!this.vDOM.leftColumn.logout_button.element) {
            this.vDOM.leftColumn.logout_button.element = document.querySelector('.re_btn.re_btn__outline.logout');
        }
    }

    async renderEvents(events) {
        this.setDOMProfileElements();
        if (!events) {
            this.personalEvents.insertAdjacentHTML('afterbegin', '<span class="font font_bold font__size_small font__color_lg">У вас пока нет ни одного эвента</span>');
        } else {
            events.forEach((event) => {
                this.personalEvents.insertAdjacentHTML('beforeend', eventCardTemplate(event));
            });
        }
    }

    async renderEventsError() {
        this.showError(this.subscriptionsDiv, 'Error in subscriptions', 'warning', null);
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
     * Render motivational message to search for events
     * @return {Promise<void>}
     */
    async renderEmptySubscriptions() {
        const subsArea = this.subscriptionsDiv;
        makeEmpty(subsArea);
        subsArea.insertAdjacentHTML('afterbegin', errorTemplate({
            message: 'Вы ещё никуда не идёте',
            button: 'Найти эвент',
        }));
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