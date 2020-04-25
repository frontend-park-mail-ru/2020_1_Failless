export {scrollChatDown};

/**
 *
 * @param {HTMLElement} chatBody
 */
function scrollChatDown(chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
}