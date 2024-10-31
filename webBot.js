// Función para iniciar un nuevo chat y volver a la pantalla de bienvenida
function startNewChat() {
    const conversation = document.getElementById('conversation');
    conversation.innerHTML = ''; // Limpiar el área de conversación

    document.getElementById('responseOutput').innerText = ''; // Limpiar cualquier mensaje de respuesta

    // Mostrar la sección de bienvenida nuevamente
    const welcomeSection = document.getElementById('welcomeSection');
    if (welcomeSection) {
        welcomeSection.style.display = 'block';
    }

    // Ocultar el botón de nuevo chat
    const newChatButton = document.querySelector('.new-chat-button');
    newChatButton.classList.remove('show-button');

    // Limpiar el campo de entrada
    document.getElementById('messageInput').value = '';
}



// Función asíncrona para enviar un mensaje al presionar 'Enter' o hacer clic en un botón
async function sendMessage(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) {
            alert('Por favor, escribe un mensaje antes de enviar.');
            return;
        }

        // Limpiar el campo de entrada antes de enviar la solicitud
        messageInput.value = '';

        // Mostrar el mensaje del usuario
        const conversation = document.getElementById('conversation');
        conversation.innerHTML += `<div class="message user">${message}</div>`;

        document.getElementById('responseOutput').innerText = "Procesando...";

        // Ocultar la sección de bienvenida
        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection) {
            welcomeSection.style.display = 'none';
        }

        // Mostrar el botón "Nuevo Chat" con animación
        const newChatButton = document.querySelector('.new-chat-button');
        newChatButton.classList.add('show-button');

        try {
            const response = await fetch('http://22.ip.gl.ply.gg:20927/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
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




// Función para enviar un mensaje al hacer clic en un botón con texto predefinido
function sendButtonMessage(message) {
    // Establecer el valor del campo de entrada de texto con el mensaje del botón
    document.getElementById('messageInput').value = message;
    
    // Llamar a la función sendMessage simulando un evento de 'click'
    sendMessage({ type: 'click' });
}
