export {toggleChatListItemActive, setChatListItemAsRead, setChatListItemAsUnread};

/**
 * Toggle all 'active' classes
 * @param {HTMLElement} chatListItem
 */
async function toggleChatListItemActive(chatListItem) {
    chatListItem.classList.toggle('chat-list-item_active');
    chatListItem.querySelector('.chat-list-item__title').classList.toggle('gradient-text');
    chatListItem.querySelector('.chat-list-item__time').classList.toggle('chat-list-item__time_active');
    chatListItem.querySelector('.chat-list-item__avatar').classList.toggle('chat-list-item__avatar_active');
}

/**
 * Mark this chat list item as read
 * @param {HTMLElement} chatListItem
 * @return {Promise<void>}
 */
async function setChatListItemAsRead(chatListItem) {
    chatListItem.querySelector('.chat-list-item__time').classList.remove('chat-list-item__time_unread');
    chatListItem.querySelector('.chat-list-item__message').classList.remove('chat-list-item__message_unread');
    chatListItem.querySelector('.chat-list-item__alert').classList.remove('chat-list-item__alert_unread');
}

/**
 * Mark this chat list item as unread
 * @param {HTMLElement} chatListItem
 * @return {Promise<void>}
 */
async function setChatListItemAsUnread(chatListItem) {
    chatListItem.querySelector('.chat-list-item__time').classList.add('chat-list-item__time_unread');
    chatListItem.querySelector('.chat-list-item__message').classList.add('chat-list-item__message_unread');
    chatListItem.querySelector('.chat-list-item__alert').classList.add('chat-list-item__alert_unread');
}
