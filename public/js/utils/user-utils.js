'use strict';

import UserModel from 'Eventum/models/user-model';
import router from 'Eventum/core/router';

/**
 * Handle click on login event
 * @param {Event} event
 */
const logoutRedirect = (event) => {
    event.preventDefault();
    UserModel.getLogout().then((ok) => {
        if (ok) {
            router.redirectForward('/');
        } else {
            // TODO: cool popup
            console.log('Client error, stay here');
        }
    });
};

function profileCheck(user) {
    let message = [];
    if (user.about.length === 0) {
        message.push('Добавьте описание');
    }
    if (!user.photos) {
        message.push('Добавьте фото');
    }
    return message;
}

export {logoutRedirect, profileCheck};