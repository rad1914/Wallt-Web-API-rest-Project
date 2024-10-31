// buttonMessage.js

import { sendMessage } from './messageHandler.js';

export function sendButtonMessage(message) {
    document.getElementById('messageInput').value = message;
    sendMessage({ type: 'click' });
}
