'use strict';

import LandingController from './controllers/landing-conroller.js';
import ProfileController from './controllers/profile-controller.js';


let application = document.getElementById('application');
// const landing = new LandingController(application);
// landing.action();
const profile = new ProfileController(application);
profile.action();