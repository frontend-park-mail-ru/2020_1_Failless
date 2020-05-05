import Router from 'Eventum/core/router';

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
    Router.redirectForward(circle.getAttribute('data-circle-href'));
}