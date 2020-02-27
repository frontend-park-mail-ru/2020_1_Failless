'use strict';

import UserModel from '../models/user-model.js';

export default class Header {

    /**
     * Create action
     */
    static create(userLogged, parentNode) {
        const logged = userLogged;
        const parent = parentNode;

        if (document.getElementsByClassName('header').length !== 0) {
            document.getElementsByClassName('header')[0].remove();
        }

        this._render(logged, parent);
        
        const sweetHomePage = document.getElementsByClassName('image icon_btn icon__size_m header__item')[0];
        sweetHomePage.addEventListener('click', this._homeRedirect);

        console.log(logged);
        if (!logged) {
            console.log(logged);
            const userSignUp = document.getElementsByClassName('header__item')[1];
            userSignUp.addEventListener('click', this._signUpRedirect);

            const userLogin = document.getElementsByClassName('header__item')[2];
            userLogin.addEventListener('click', this._loginRedirect);
        } else {
            const eventSearch = document.getElementsByClassName('header__item')[1];
            eventSearch.addEventListener('click', this._eventSearchRedirect);
    
            const userLogout = document.getElementsByClassName('header__item')[2];
            userLogout.addEventListener('click', this._logoutRedirect);
    
            const userProfile = document.getElementsByClassName('header__item')[3];
            userProfile.addEventListener('click', this._profileRedirect);
        }
    }

    /**
     * Handle click on home event
     * @param {event} event
     */
    static _homeRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/');
        window.history.pushState({}, '', '/');
        window.history.back();
    }

    /**
     * Handle click on event search event
     * @param {event} event
     */
    static _eventSearchRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/event');
        window.history.pushState({}, '', '/event');
        window.history.back();
    }

    /**
     * Handle click on sign up event
     * @param {event} event
     */
    static _signUpRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/signup');
        window.history.pushState({}, '', '/signup');
        window.history.back();
    }

    /**
     * Handle click on login event
     * @param {event} event
     */
    static _loginRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/login');
        window.history.pushState({}, '', '/login');
        window.history.back();
    }

    /**
     * Handle click on login event
     * @param {event} event
     */
    static _logoutRedirect(event) {
        event.preventDefault();
        
        UserModel.getLogout().then((ok) => {
            if (ok) {
                window.history.pushState({}, '', '/');
                window.history.pushState({}, '', '/');
                window.history.back();
            } else {
                console.log('Client error, stay here');
            }
        });
    }

    /**
     * Handle click on home event
     * @param {event} event
     */
    static _profileRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/profile');
        window.history.pushState({}, '', '/profile');
        window.history.back();
    }

    static _render(logged, parent) {
        let template = [];
        if (!logged) {
            template = [
                {
                    block: 'header',
                    tag: 'nav',
                    content: [
                        {
                            block: 'image',
                            tag: 'img',
                            url: './static/images/logo.png',
                            mix: {'block': 'icon_btn icon__size_m header__item'},
                            attrs: { src: './static/images/logo.png', alt: 'Eventum' }
                        },
                        {
                            block: 'header__manage',
                            content: [
                                {
                                    block: 'header__item',
                                    tag: 'a',
                                    attrs: { href: '/signup' },
                                    content: 'Рега'
                                },
                                {
                                    block: 'header__item',
                                    tag: 'a',
                                    attrs: { href: '/login' },
                                    content: 'Войти'
                                }
                            ]   
                        }
                    ]
                }
            ];
        } else {
            template = [
                {
                    block: 'header',
                    tag: 'nav',
                    content: [
                        {
                            block: 'image',
                            tag: 'img',
                            url: './static/images/logo.png',
                            mix: {'block': 'icon_btn icon__size_m header__item'},
                            attrs: { src: './static/images/logo.png', alt: 'Eventum' }
                        },
                        {
                            block: 'header__manage',
                            content: [
                                {
                                    block: 'header__item',
                                    tag: 'a',
                                    attrs: { href: '/search' },
                                    content: 'Поиск'
                                }
                                ,
                                {
                                    block: 'header__item',
                                    tag: 'a',
                                    attrs: { href: '/logout' },
                                    content: 'Выйти'
                                },
                                {
                                    block: 'header__item',
                                    tag: 'a',
                                    attrs: { href: '/profile' },
                                    content: 'Профиль'
                                },
                            ]   
                        }
                    ]
                }
            ];
        }
        parent.insertAdjacentHTML('afterbegin', bemhtml.apply(template));
    }
}