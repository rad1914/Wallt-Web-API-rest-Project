export async function sendMessage(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) {
            alert('Por favor, escribe un mensaje antes de enviar.');
            return;
        }

        // Prepare the message for the server
        let serverMessage = message;
        if (!message.startsWith('/')) {
            serverMessage = `.ai ${message}`; // Prepend ".ai" to the message
        }

        messageInput.value = '';
        const conversation = document.getElementById('conversation');
        
        // Display the original message in the conversation
        conversation.innerHTML += `<div class="message user">${message}</div>`;
        document.getElementById('responseOutput').innerText = "Processing...";

        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection) {
            welcomeSection.style.display = 'none';
        }

        const newChatButton = document.querySelector('.new-chat-button');
        newChatButton.classList.add('show-button');

        // Log the final message to be sent to the server
        console.log("Final message to server:", serverMessage);

        try {
            const response = await fetch('http://22.ip.gl.ply.gg:20927/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: serverMessage }), // Send modified message
            });

            const data = await response.json();

            if (data.response) {
                conversation.innerHTML += `<div class="message bot">${data.response}</div>`;
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
