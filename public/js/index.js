'use strict';

import Router from './core/router.js';
import EventController from './controllers/event-controller.js';

const application = document.getElementById('application');

application.insertAdjacentHTML('beforeend', '<div id="main"></div>');
const main = document.getElementById('main');

const inst = new EventController(main);
console.log("EventController->", inst);
const router = new Router('', application).addRoute('test', new EventController(main));
router.start();

// import LandingController from './controllers/landing-conroller.js';

// let application = document.getElementById('application');
// const landing = new LandingController(application);
// landing.action();
