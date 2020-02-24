'use strict';

import LandingController from './controllers/landing-conroller.js';

let application = document.getElementById('application');
const landing = new LandingController(application);
landing.action();
