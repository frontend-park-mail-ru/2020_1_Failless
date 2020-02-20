'use strict';

import LandingController from './controllers/landing-conroller';

let application = document.querySelector('#application')[0];
const landing = new LandingController(application);
landing.action();
