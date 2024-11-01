// webBot.js

import { typeTitle } from './animators.js';

export function startNewChat() {
    const conversation = document.getElementById('conversation');
    conversation.innerHTML = ''; 
    document.getElementById('responseOutput').innerText = '';

    const welcomeSection = document.getElementById('welcomeSection');
    if (welcomeSection) welcomeSection.style.display = 'block';

    const newChatButton = document.querySelector('.new-chat-button');
    newChatButton.classList.remove('show-button');
    document.getElementById('messageInput').value = '';
}

// Async function to send a message
export async function sendMessage(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) {
            alert('Por favor, escribe un mensaje antes de enviar.');
            return;
        }

        messageInput.value = '';
        const conversation = document.getElementById('conversation');
        conversation.innerHTML += `<div class="message user">${message}</div>`;
        
        document.getElementById('responseOutput').innerText = "Procesando...";
        
        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection) welcomeSection.style.display = 'none';

        const newChatButton = document.querySelector('.new-chat-button');
        newChatButton.classList.add('show-button');

        try {
            const response = await fetch('http://22.ip.gl.ply.gg:20927/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            if (data.response) {
                conversation.innerHTML += `
                    <div class="message bot">
                        <img src="bot.png" alt="Bot" class="bot-image">
                        <span>${data.response}</span>
                    </div>`;
            } else {
                document.getElementById('responseOutput').innerText = "Error: Respuesta vacía del servidor.";
            }

        } catch (error) {
            console.error('Error sending message:', error);
            document.getElementById('responseOutput').innerText = 'Error: No se pudo enviar el mensaje. Inténtalo más tarde.';
        }

        conversation.scrollTop = conversation.scrollHeight;
    }
}

export function sendButtonMessage(message) {
    document.getElementById('messageInput').value = message;
    sendMessage({ type: 'click' });
}
