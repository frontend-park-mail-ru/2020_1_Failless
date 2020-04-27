'use strict';

import LandingController from 'Eventum/controllers/landing-controller.js';
import LoginController from 'Eventum/controllers/login-controller.js';
import SignUpController from 'Eventum/controllers/signup-controller.js';
import FeedController from 'Eventum/controllers/feed-controller.js';
import BigEventSearchController from 'Eventum/controllers/big-event-search-controller.js';
import ProfileController from 'Eventum/controllers/profile-controller.js';
import ChatController from 'Eventum/controllers/chat-controller.js';
import Router from 'Eventum/core/router.js';
import 'Static/css/style.css';

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

const router = new Router();
router.addRoute('/',            new LandingController(application));
router.addRoute('/login',       new LoginController(application));
router.addRoute('/signup',      new SignUpController(application));
router.addRoute('/search',      new BigEventSearchController(application));  // big & middle events
router.addRoute('/feed',        new FeedController(application));        // profiles
router.addRoute('/my/profile',  new ProfileController(application));
router.addRoute('/my/chats',    new ChatController(application));

router.route();
