// chatInit.js

export function startNewChat() {
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
