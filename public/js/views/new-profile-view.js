'use strict';

import MyView from './my-view.js';

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

        if (!profile) {
            profile = {
                birthday: '2020-02-28T13:55:04.306347+03:00',
                password: 'password',
                gender: 'M',
                phone: '88005553535',
                name: 'Егор',
                about: 'Ну, Егор, ну и что?',
                rating: '5',
                location: '',
                avatar: '/ProfilePhotos/1.jpg',
                photos: ['/ProfilePhotos/1.jpg', '/ProfilePhotos/3.jpg', '/ProfilePhotos/2.jpg',
                    '/ProfilePhotos/3.jpg', '/ProfilePhotos/2.jpg', '/ProfilePhotos/1.jpg'],
                email: 'eventum@gmail.com',
                tags: [
                    {title: '#хочувБАР'}, {title: '#хочувКИНО'}, {title: '#хочунаКАТОК'}],
                networks: [],
                events: {
                    personal: [{
                        photos: [
                            '/EventPhotos/3.jpg',
                            '/EventPhotos/4.jpg',
                        ],
                        place: 'Москва',
                    }],
                    others: [{
                        photos: [
                            '/EventPhotos/1.jpg',
                            '/EventPhotos/2.jpg',
                        ],
                        place: 'Питер',
                    }]
                }
            };
        }
        document.getElementsByClassName('my__left_column__body')[0].insertAdjacentHTML(
            'beforeend', Handlebars.templates['new-profile-left']({
                profile: profile,
            }));
        document.getElementsByClassName('my__main_column')[0].insertAdjacentHTML(
            'beforeend', Handlebars.templates['new-profile-main']({
                title: 'Профиль',
                profile: profile,
            }));
    }
}