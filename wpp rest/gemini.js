// gemini.js

// Importación de módulos necesarios
import { GoogleGenerativeAI } from "@google/generative-ai";
import ora from "ora"; // Librería para mostrar un spinner de carga en la consola
import chalk from "chalk"; // Para colores en el texto de la consola
import dotenv from "dotenv"; // Carga las variables de entorno

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Lista de claves API, separadas por comas, obtenidas de la variable de entorno
const apiKeys = process.env.GEMINI_API_KEYS.split(',');

// Inicialización de la clave API actual y el cliente del modelo
let currentApiKeyIndex = 0; // Índice para alternar entre claves API en caso de errores
let model; // Instancia del modelo generativo

// Función para inicializar la API generativa de Google con una clave específica
const initializeGenAI = async (apiKey) => {
  try {
    // Crear una instancia de GoogleGenerativeAI con la clave API proporcionada
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Obtener el modelo específico con configuración de respuestas personalizadas
    const model = await genAI.getGenerativeModel({
      model: "gemini-1.5-pro-exp-0801",
      systemInstruction: "Polite Straightforward Latinoamerican Spanish responses. Use emoticons instead of emojis",
    });

    console.log(chalk.green(`Successfully initialized with API key: ${apiKey}`));
    return model;

  } catch (error) {
    console.error(chalk.red(`Failed to initialize with API key: ${apiKey}`), error);
    throw error; // Propagar el error si falla la inicialización
  }
};

// Función para cambiar la clave API en caso de error o agotamiento de cuota
const switchAPIKey = async () => {
  // Actualizar el índice de la clave actual de forma cíclica
  currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
  console.log(chalk.yellow(`Switching to API key index: ${currentApiKeyIndex}`));
  
  // Reintentar inicializar el modelo con la nueva clave API
  model = await initializeGenAI(apiKeys[currentApiKeyIndex]);
};

// Configuración inicial del modelo generativo
const setupInitialModel = async () => {
  try {
    // Intentar inicializar el modelo con la primera clave API
    model = await initializeGenAI(apiKeys[currentApiKeyIndex]);
  } catch (error) {
    console.error(chalk.red('Failed to setup initial model'), error);
    process.exit(1); // Terminar el proceso si la configuración inicial falla
  }
};

// Configuración de generación de respuestas
const generationConfig = {
  temperature: 1, // Grado de variabilidad en las respuestas
  topP: 0.95, // Proporción de probabilidad acumulativa
  topK: 64, // Cantidad de opciones de tokens para elegir
  maxOutputTokens: 3192, // Máximo número de tokens en la respuesta
  responseMimeType: "text/plain",
};

// Función principal para obtener la respuesta de Gemini
const getGeminiResponse = async (query) => {
  const spinner = ora('Generating response...').start(); // Inicia un spinner de carga en la consola
  let responseText = '';

  // Intentar generar respuesta con cada clave API disponible
  for (let i = 0; i < apiKeys.length; i++) {
    try {
      // Iniciar una sesión de chat con el modelo actual y configuración específica
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              { text: "You are WAALT, a multifunctional WhatsApp bot..." }
            ],
          },
        ],
      });

      // Enviar el mensaje de consulta del usuario
      const result = await chatSession.sendMessage(query);
      responseText = await result.response.text();

      spinner.stop(); // Detener el spinner de carga al recibir la respuesta
      return `✦ ${responseText}`; // Devolver la respuesta formateada

    } catch (error) {
      spinner.stop(); // Detener el spinner de carga si ocurre un error
      console.error(chalk.red('✦ Error during response generation:'), error.message);
      if (error.response) {
        console.error(chalk.red('✦ API response:'), error.response.data);
      }

      // Verificar si el error se debe al agotamiento de la cuota
      if (error.message.includes('quota')) {
        console.log(chalk.yellow('Quota exceeded. Switching API key.'));
        await switchAPIKey(); // Cambiar a la siguiente clave API
      } else {
        throw error; // Lanzar el error si no es relacionado con la cuota
      }
    }
  }

  // Si todas las claves API están agotadas, enviar mensaje de agotamiento
  responseText = "Estoy exhausto 😮‍💨\nDame un rato para descansar, mientras, consulta mis comandos predefinidos desde `.menu`.";
  return `✦ ${responseText}`;
};

// Inicializar el modelo en la primera ejecución
setupInitialModel();

// Exportar la función principal de respuesta para uso externo
export { getGeminiResponse };
