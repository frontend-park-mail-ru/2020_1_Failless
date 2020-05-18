export {showMessage};

/**
 * Make message appear smoothly
 * @param {Element} messageElement
 */
function showMessage(messageElement) {
    messageElement.classList.remove('chat-message__container_new');
}