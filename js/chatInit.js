// **chatInit.js

export function startNewChat() {
    const conversation = document.getElementById('conversation');
    if (conversation) {
        conversation.innerHTML = ''; // Clear conversation area
        console.log("Conversation area cleared.");
    }

    document.getElementById('responseOutput').innerText = ''; // Clear response message
    console.log("Response output cleared.");

    // Show welcome section again
    const welcomeSection = document.getElementById('welcomeSection');
    if (welcomeSection) {
        welcomeSection.style.display = 'block';
        console.log("Welcome section displayed.");
    } else {
        console.warn("Welcome section not found.");
    }

    // Check for new chat button and make it visible
    const newChatButton = document.querySelector('.new-chat-button');
    if (newChatButton) {
        newChatButton.classList.add('show-button'); // Make sure button is visible
        console.log("New chat button found and made visible:", newChatButton.classList);
    } else {
        console.error("New chat button not found. Please check if the element exists in the DOM.");
    }

    // Clear input field
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.value = '';
        console.log("Message input cleared.");
    } else {
        console.warn("Message input field not found.");
    }
}
