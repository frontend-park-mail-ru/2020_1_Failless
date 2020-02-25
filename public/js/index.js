'use strict';

import LandingController from './controllers/landing-conroller.js';
import ProfileController from './controllers/profile-controller.js';
import LoginController from './controllers/login-controller.js';
import SignUpController from './controllers/singnup-controller.js';
import createHeader from "./header.js";
import Router from './router.js';


let application = document.getElementById('application');
createHeader(application);

let router = new Router();
router.addRoute('/', new SignUpController(application));
router.addRoute('/login', new LoginController(application));
router.addRoute('/me', new ProfileController(application));
router.addRoute('/profile', new ProfileController(application));

router.route();
