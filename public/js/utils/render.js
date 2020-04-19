import ModalView from 'Eventum/views/modal-view.js';
import {redirects} from 'Eventum/utils/static-data';

function showMessageWithRedirect(message, redirectName) {
    let redirect = redirects.get(redirectName);
    let modalView = new ModalView(document.querySelector('#application'));
    modalView.render({
        message: message,
        last_buttons: [
            {
                title:  redirect.button_title,
            }
        ],
    });
    modalView.setHandlers(redirect.handler);
}

export {showMessageWithRedirect};