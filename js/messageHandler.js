// **messageHandler.js

export async function sendMessage(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) {
            alert('Por favor, escribe un mensaje antes de enviar.');
            return;
        }

        // Prepare message for the server
        let serverMessage = message.startsWith('/') ? message : `.ai ${message}`;
        messageInput.value = ''; // Clear input field
        const conversation = document.getElementById('conversation');

        // Display the user's message in the conversation
        if (conversation) {
            conversation.innerHTML += `<div class="message user">${message}</div>`;
        }
        document.getElementById('responseOutput').innerText = "Processing...";

        // Log the final message to be sent
        console.log("Final message to server:", serverMessage);

        // Hide welcome section and display new chat button
        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection) {
            welcomeSection.style.display = 'none';
        }

        // Check for new-chat-button existence
        const newChatButton = document.querySelector('.new-chat-button');
        if (newChatButton) {
            newChatButton.classList.add('show-button');
        }

        // Record start time
        const startTime = Date.now();

        try {
            // Send request to the server
const response = await fetch('https://163b-2806-102e-19-594c-f68e-38ff-fea7-6ac4.ngrok-free.app/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: serverMessage }),
});

            // Calculate response time
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            console.log(`Response time: ${responseTime} ms`);

            const data = await response.json();

            // Log the full response from the server
            console.log("Server response:", data);

            if (data.response) {
                if (conversation) {
                    conversation.innerHTML += `<div class="message bot">${data.response}</div>`;
                }
            } else {
                document.getElementById('responseOutput').innerText = "Error: Respuesta vacía del servidor.";
            }

        } catch (error) {
            console.error('Error sending message:', error);
            document.getElementById('responseOutput').innerText = 'Error: No se pudo enviar el mensaje. Inténtalo más tarde.';
        }

        // Scroll to the latest message if conversation exists
        if (conversation) {
            conversation.scrollTop = conversation.scrollHeight;
        }
    }
}

