export {scrollChatDown, resizeTextArea};

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