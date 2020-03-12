'use strict';

import LandingController from './controllers/landing-controller.js';
import ProfileController from './controllers/profile-controller.js';
import LoginController from './controllers/login-controller.js';
import SignUpController from './controllers/signup-controller.js';
import ProfileSearchController from "./controllers/profile-search-controller.js";
import MediumEventSearchController from "./controllers/medium-event-search-controller.js";
import BigEventSearchController from "./controllers/big-event-search-controller.js";
import Router from './core/router.js';

let application = document.getElementById('application');

let router = new Router();
router.addRoute('/', new LandingController(application));
router.addRoute('/login', new LoginController(application));
router.addRoute('/profile', new ProfileController(application));
router.addRoute('/signup', new SignUpController(application));
router.addRoute('/search', new BigEventSearchController(application));              // big events
router.addRoute('/feed/medium-events', new MediumEventSearchController(application)); // medium events
router.addRoute('/feed/profiles', new ProfileSearchController(application));          // profiles

router.route();
