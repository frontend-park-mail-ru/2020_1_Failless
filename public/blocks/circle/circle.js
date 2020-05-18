import Router from 'Eventum/core/router';
import Snackbar from 'Blocks/snackbar/snackbar';

export {CircleRedirect};

/**
 * Redirect to another 'my' page
 * @param {Event} event
 */
function CircleRedirect(event) {
    event.preventDefault();
    let circle = null;
    if (event.target.matches('.circle')) {
        circle = event.target;
    } else if (event.target.matches('#icon') || event.target.matches('path')) {
        circle = event.target.closest('.circle');
    } else {
        return;
    }
    let href = circle.getAttribute('data-circle-href');
    if (href === '/my/mail') {
        Snackbar.instance.addMessage('Not implemented yet');
    } else {
        Router.redirectForward(href);
    }
}