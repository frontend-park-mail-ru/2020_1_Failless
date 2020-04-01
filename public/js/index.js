'use strict';

import LandingController from './controllers/landing-controller.js';
import LoginController from './controllers/login-controller.js';
import SignUpController from './controllers/signup-controller.js';
import FeedUsersController from './controllers/feed-users-controller.js';
import BigEventSearchController from './controllers/big-event-search-controller.js';
import ProfileController from './controllers/profile-controller.js';
import Router from './core/router.js';
import '../static/css/style.css';

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
