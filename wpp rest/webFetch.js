// webFetch.js

// Importaciones de módulos necesarios
import express from 'express';
import { processMessage } from './handlers/messageHandler/processMessage.js'; // Procesa mensajes entrantes
import { filterMessage } from './handlers/spamFilter.js'; // Filtra mensajes según el antispam
import { v4 as uuidv4 } from 'uuid'; // Genera identificadores únicos para mensajes

// Crear una instancia de aplicación de Express
const webApp = express();
webApp.use(express.json()); // Middleware para parsear JSON en las solicitudes

// Configuración del servidor web para manejar solicitudes API
export function setupWebFetch(sock, audioDir, videoDir) {
    // Ruta para el procesamiento de mensajes
    webApp.post('/api/message', async (req, res) => {
        try {
            // Extraer el mensaje y el ID de usuario de la solicitud
            const { message, jid = '5215539985884@s.whatsapp.net' } = req.body;
            console.log(`Received message: ${message} for JID: ${jid}`);

            // Simular un mensaje entrante, estructurándolo como un mensaje de WhatsApp
            const simulatedMessage = {
                key: {
                    remoteJid: jid, // ID del remitente
                    fromMe: false, // Indica que el mensaje no es del bot
                    id: uuidv4(), // ID único del mensaje
                    participant: undefined
                },
                messageTimestamp: Math.floor(Date.now() / 1000), // Marca de tiempo en segundos
                pushName: 'Web User', // Nombre del remitente simulado
                broadcast: false,
                message: {
                    conversation: message, // Mensaje de texto principal
                    extendedTextMessage: {
                        text: message,
                        previewType: 0,
                        contextInfo: {},
                        inviteLinkGroupTypeV2: 0
                    },
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                        messageSecret: new Uint8Array(16).fill(0).map(() => Math.floor(Math.random() * 256)), // Genera un "secreto" aleatorio para simular metadatos del dispositivo
                    }
                }
            };

            // Aplicar filtro antispam
            if (await filterMessage(sock, simulatedMessage, jid)) {
                console.log('Message blocked by spam filter.');
                return res.status(403).json({ error: 'Message blocked by spam filter' }); // Responder con error si el mensaje es bloqueado
            }

            // Procesar el mensaje y obtener respuesta
            const responseText = await processMessage(sock, { messages: [simulatedMessage] }, audioDir, videoDir, 'web');

            // Enviar la respuesta al cliente
            res.json({ response: responseText || 'Message processed successfully' });
        } catch (error) {
            console.error('Error processing web message:', error);
            res.status(500).json({ error: 'Internal Server Error' }); // Enviar error si algo falla
        }
    });

    // Iniciar el servidor en el puerto 3001
    webApp.listen(3001, () => {
        console.log('Web server running on http://localhost:3001');
    });
}
