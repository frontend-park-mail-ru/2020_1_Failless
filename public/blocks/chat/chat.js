export {scrollChatDown, resizeTextArea, toggleChatOnMobile};

/**
 * Automatically scroll chat to the bottom
 * @param {HTMLElement} chatBody
 */
function scrollChatDown(chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
}

/**
 * Resize textarea vertically according to its content
 */
function resizeTextArea() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight + 2) + 'px';
}

/**
 * There is a complete different chat opening on mobiles
 * So we need to slide chat from the right
 * and add a return button on header
 */
function toggleChatOnMobile() {
    this.classList.toggle('chat_active');
}