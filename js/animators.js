// animators.js

// Texto a escribir en el título
const titleText = "¿Qué tienes en mente?";
const writingTitle = document.getElementById('writingTitle');
let index = 0;

export function typeTitle() {
    if (index < titleText.length) {
        writingTitle.textContent += titleText.charAt(index);
        index++;
        setTimeout(typeTitle, 28); // Ajustar la velocidad de escritura aquí (28 ms por carácter)
    }
}

// Animación de botones e imagen al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.animate-button');
    const image = document.querySelector('.animate-image');

    if (image) image.classList.add('fadeInImage');

    buttons.forEach((button, idx) => {
        setTimeout(() => button.classList.add('fadeInButton'), idx * 200);
    });

    setTimeout(typeTitle, 500); // Retardo para comenzar a escribir después de la animación de la imagen
});

// Agregar animación al campo de entrada al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById('messageInput');
    
    inputField.classList.add('fadeInInput');

    setTimeout(() => inputField.classList.remove('fadeInInput'), 1000);
});

