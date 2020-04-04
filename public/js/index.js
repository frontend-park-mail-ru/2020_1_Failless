'use strict';

import LandingController from 'Eventum/controllers/landing-controller.js';
import LoginController from 'Eventum/controllers/login-controller.js';
import SignUpController from 'Eventum/controllers/signup-controller.js';
import FeedUsersController from 'Eventum/controllers/feed-users-controller.js';
import BigEventSearchController from 'Eventum/controllers/big-event-search-controller.js';
import ProfileController from 'Eventum/controllers/profile-controller.js';
import Router from 'Eventum/core/router.js';
import 'Static/css/style.css';

let application = document.getElementById('application');

let router = new Router();
router.addRoute('/', new LandingController(application));
router.addRoute('/login', new LoginController(application));
router.addRoute('/signup', new SignUpController(application));
router.addRoute('/search', new BigEventSearchController(application));  // big & middle events
router.addRoute('/feed/users', new FeedUsersController(application));   // profiles
router.addRoute('/feed/events', new FeedUsersController(application));  // events
router.addRoute('/my/profile', new ProfileController(application));

router.route();
