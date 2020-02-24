'use strict';

import LandingController from './controllers/landing-conroller.js';
import ProfileController from './controllers/profile-controller.js';
import LoginController from './controllers/login-controller.js';
import SignUpController from './controllers/singnup-controller.js';
import createHeader from "./header.js";


let application = document.getElementById('application');
createHeader(application);
// const landing = new LandingController(application);
// landing.action();

// const profile = new ProfileController(application);
// profile.action();

// const login = new LoginController(application);
// login.action();

const singup = new SignUpController(application);
singup.action();