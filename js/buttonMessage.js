// **buttonMessage.js

import { sendMessage } from './messageHandler.js';

export function sendButtonMessage(message) {
    // Set the value of the input field with the predefined button message
    document.getElementById('messageInput').value = message;

    // Call sendMessage, simulating a click event
    sendMessage({ type: 'click' });
}
