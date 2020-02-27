'use strict';

import LandingController from './controllers/landing-controller.js';
import ProfileController from './controllers/profile-controller.js';
import LoginController from './controllers/login-controller.js';
import SignUpController from './controllers/signup-controller.js';
import EventController from './controllers/event-controller.js';
import Header from './core/header.js'
import Router from './core/router.js';

let application = document.getElementById('application');

Header.create(false, application);

let router = new Router();
router.addRoute('/', new LandingController(application));
router.addRoute('/signup', new SignUpController(application));
router.addRoute('/login', new LoginController(application));
router.addRoute('/me', new ProfileController(application));
router.addRoute('/profile', new ProfileController(application));
router.addRoute('/event', new EventController(application));

router.route();
