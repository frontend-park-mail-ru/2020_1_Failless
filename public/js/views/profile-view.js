'use strict';

import Button from 'Blocks/button-comp/button-comp';
import MyView from 'Eventum/views/my-view';
import settings from 'Settings/config';
import profileLeftTemplate from 'Blocks/profile-left/template.hbs';
import profileMainTemplate from 'Components/profile-main/template.hbs';
import eventCardTemplate from 'Blocks/event/template.hbs';
import errorTemplate from 'Blocks/error/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import {determineClass} from 'Blocks/event/event';
import EventEdit from 'Blocks/event-edit/event-edit';
import {staticTags} from 'Eventum/utils/static-data';
import {extendActiveTag} from 'Blocks/tag/tag';
import {prettifyDateTime} from 'Blocks/chat-list-item/chat-list-item';

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

        this.vDOM = {
            leftColumn: {
                comp: null,
                element: null,
            },
            mainColumn: {
                comp: null,
                element: null,
                subscriptions: {
                    comp: null,
                    element: null,
                },
                personalEvents: {
                    comp: null,
                    element: null,
                    event_edit: null, // component itself
                },
            },
        };
    }

    destructor() {
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
        return this.vDOM.mainColumn.subscriptions.element;
    }

    get personalEventsDiv() {
        this.setDOMProfileElements();
        return this.vDOM.mainColumn.personalEvents.element;
    }

    get eventEditComp() {
        this.setDOMProfileElements();
        return this.vDOM.mainColumn.personalEvents.event_edit;
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

        if (profile.events) {
            profile.events.forEach((event) => determineClass(event));
        }

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
        const logoutButton = new Button({
            style: 're_btn re_btn__outline logout',
            state: null,
            text: 'Выйти',
            data_bind: 'logout',
        });

        const saveButton = new Button({
            style: 're_btn re_btn__filled',
            state: null,
            text: 'Сохранить',
            data_bind: 'saveMeta',
        });

        const settingsButton = new Button({
            style: 're_btn re_btn__outline',
            state: null,
            text: 'Настройки',
            data_bind: 'showSettings',
        });

        const addEventButton = new Button({
            style: 're_btn re_btn__filled',
            state: null,
            text: 'Добавить',
            data_bind: 'addNewEventOnClick',
        });

        document.getElementsByClassName('my__left-column-body')[0].insertAdjacentHTML(
            'beforeend', profileLeftTemplate({
                profile: profile,
                avatar: `${settings.aws}/users/${profile.avatar.path}`,
                button_logout: logoutButton.data,
                save_button: saveButton.data,
                settings_button: settingsButton.data,
            })
        );
        document.getElementsByClassName('my__main-column-body')[0].insertAdjacentHTML(
            'beforeend', profileMainTemplate({
                title: 'Профиль',
                url: `${settings.aws}/users`,
                profile: profile,
                add_event_button: addEventButton.data,
                select_options: Array(14).fill(undefined, undefined, undefined).map((_, idx) => 2 + idx),
            })
        );

        this.vDOM.mainColumn.personalEvents.event_edit = new EventEdit(
            document.querySelector('.event-edit')
        );
    }

    setDOMProfileElements() {
        while (!this.vDOM.mainColumn.subscriptions.element) {
            this.vDOM.mainColumn.subscriptions.element = document.querySelector('.profile-main__subscriptions');
        }
        while (!this.vDOM.mainColumn.personalEvents.element) {
            this.vDOM.mainColumn.personalEvents.element = document.querySelector('.profile-main__personal-events');
        }
        while (!this.vDOM.mainColumn.personalEvents.event_edit.element) {
            this.vDOM.mainColumn.personalEvents.event_edit.element = document.querySelector('.event-edit');
        }
    }

    async renderNewEvent(event, type) {
        let helper = this.personalEventsDiv.querySelector('span.font.font_bold.font__size_small.font__color_lg');
        if (helper) {
            helper.remove();
        }
        if (event.tags) {event.tags = event.tags.map(tag => extendActiveTag(tag));}
        event.class = type;
        event[type] = true;
        event.date = new Date(event.date).toLocaleString();
        this.eventEditComp.element.insertAdjacentHTML('afterend', eventCardTemplate(event));
    }

    /**
     *
     * @param events {{
     *     eid: Number,
     *     uid: Number,
     *     title: string,
     *     description: string|null,
     *     tags: Array<{Number}>,
     *     date: string
     * }}
     * @return {Promise<void>}
     */
    async renderEvents(events) {
        const personalEvents = this.personalEventsDiv;
        makeEmpty(personalEvents);
        if (!events || events.length === 0) {
            personalEvents.insertAdjacentHTML('afterbegin', '<span class="font font_bold font__size_small font__color_lg">У вас пока нет ни одного эвента</span>');
        } else {
            events.forEach((event) => {
                determineClass(event);
                if (event.tags) {
                    event.tags = event.tags.map((tag) => {
                        let newTag = staticTags[tag - 1];
                        newTag.activeClass = 'tag__container_active';
                        return newTag;});
                }
                event.small = true;
                event.date = new Date(event.date).toLocaleString();
                personalEvents.insertAdjacentHTML('beforeend', eventCardTemplate(event));
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
        if (!subscriptions) {
            this.renderEmptySubscriptions();
            return;
        }
        const subsArea = this.subscriptionsDiv;
        makeEmpty(subsArea);
        subscriptions.forEach((sub) => {
            determineClass(sub);
            sub.followed = true;
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

    /**
     * Remove event from subscriptions
     * @param {{HTMLLinkElement}} link
     * @return {Promise<void>}
     */
    async removeSubscriptionByLink(link) {
        let eventToRemove = link.closest('.event');
        eventToRemove.style.cssText = 'transform: scale(0);';
        setTimeout(() => {
            eventToRemove.remove();
            if (this.subscriptionsDiv.childElementCount === 0) {
                this.renderEmptySubscriptions();
            }
        }, 300);
    }
}