import UserModel from '../models/user-model.js';

/**
 * Handle click on login event
 * @param {Event} event
 */
const logoutRedirect = (event) => {
    console.log('Client error, stay here');
    event.preventDefault();
    UserModel.getLogout().then((ok) => {
        if (ok) {
            window.history.pushState({}, '', '/');
            window.history.pushState({}, '', '/');
            window.history.back();
        } else {
            // TODO: cool popup
            console.log('Client error, stay here');
        }
    });
};

export default logoutRedirect;