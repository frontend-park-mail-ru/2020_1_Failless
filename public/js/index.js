'use strict';

import LandingController from 'Eventum/controllers/landing-controller.js';
import LoginController from 'Eventum/controllers/login-controller.js';
import SignUpController from 'Eventum/controllers/signup-controller.js';
import FeedController from 'Eventum/controllers/feed-controller.js';
import SearchController from 'Eventum/controllers/search-controller.js';
import ProfileController from 'Eventum/controllers/profile-controller.js';
import ChatController from 'Eventum/controllers/chat-controller.js';
import ServiceController from 'Eventum/controllers/service-controller';
import Router from 'Eventum/core/router.js';
import {setStatic} from 'Eventum/utils/static-data';
import 'Public/style.scss';
import TextConstants from 'Eventum/utils/language/text';

const application = document.getElementById('application');

// if (navigator.serviceWorker) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('sw.js').then((registration) => {
//             console.log('Service worker is supported! Enjoy! Scope:', registration.scope);
//         })
//             .catch((err) => {
//                 console.log('Na ja! Das ist nicht arbeiten! No SW!', err);
//             });
//     });
// }

let lang = localStorage.getItem('cur_lang');
let winLang = window.navigator.language;
if (!lang) {
    if (winLang === 'ru-RU' || winLang === 'ru') {
        lang = TextConstants.LANGUAGES.RUSSIAN.short;
    } else if (winLang === 'es' || winLang.startsWith('es')) {
        lang = TextConstants.LANGUAGES.SPANISH.short;
    } else {
        lang = TextConstants.LANGUAGES.ENGLISH.short;
    }
}
TextConstants.translateTo(lang)
    .then(() => {
        setStatic();
        const router = new Router();
        router.addRoute('/',            new LandingController(application));
        router.addRoute('/login',       new LoginController(application));
        router.addRoute('/signup',      new SignUpController(application));
        router.addRoute('/search',      new SearchController(application));  // big & middle events
        router.addRoute('/feed',        new FeedController(application));        // profiles
        router.addRoute('/my/profile',  new ProfileController(application));
        router.addRoute('/my/chats',    new ChatController(application));
        router.addRoute('/service',     new ServiceController(application));
        router.route();
    });



