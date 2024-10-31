// animators.js

// Texto a escribir en el título
const titleText = "¿Qué tienes en mente?";
const writingTitle = document.getElementById('writingTitle');
let index = 0;

function typeTitle() {
    if (index < titleText.length) {
        writingTitle.textContent += titleText.charAt(index);
        index++;
        setTimeout(typeTitle, 28); // Ajustar la velocidad de escritura aquí (28 ms por carácter)
    }
}

// Animación de botones e imagen al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.animate-button');
    const image = document.querySelector('.animate-image');

    // Animar la imagen
    if (image) {
        image.classList.add('fadeInImage');
    }

    // Animar los botones con un efecto escalonado
    buttons.forEach((button, index) => {
        setTimeout(() => {
            button.classList.add('fadeInButton');
        }, index * 200); // Retardo para cada botón
    });

    // Comenzar a escribir el título después de la animación de la imagen
    setTimeout(typeTitle, 500); // Retardo para comenzar a escribir después de la animación de la imagen
});

// Agregar animación al campo de entrada al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.getElementById('messageInput');
    
    // Añadir la clase para el efecto inicial de animación
    inputField.classList.add('fadeInInput');

    // Remover la clase después de la animación inicial
    setTimeout(() => {
        inputField.classList.remove('fadeInInput');
    }, 1000); // La duración de la animación
});
