export {toggleChatListItemActive, setChatListItemAsRead};

/**
 * Toggle all 'active' classes
 * @param {HTMLElement} chatListItem
 */
function toggleChatListItemActive(chatListItem) {
    chatListItem.classList.toggle('chat-list-item_active');
    chatListItem.querySelector('.chat-list-item__title').classList.toggle('gradient-text');
    chatListItem.querySelector('.chat-list-item__time').classList.toggle('chat-list-item__time_active');
}

function setChatListItemAsRead(chatListItem) {
    chatListItem.querySelector('.chat-list-item__time').classList.remove('chat-list-item__time_unread');
    chatListItem.querySelector('.chat-list-item__message').classList.remove('chat-list-item__message_unread');
    chatListItem.querySelector('.chat-list-item__alert').classList.remove('chat-list-item__alert_unread');
}