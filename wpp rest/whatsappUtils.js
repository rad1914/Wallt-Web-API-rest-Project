// whatsappUtils.js
import { processMessage } from './handlers/messageHandler/processMessage.js';
import { filterMessage } from './handlers/spamFilter.js';
import { sendDailyBirthdayNotifications } from './handlers/utilities/birthdays.js';
import { setupMessageListener } from './handlers/utilities/broadcast.js';
import schedule from 'node-schedule';
import { v4 as uuidv4 } from 'uuid';

export const startWhatsAppListeners = (sock, saveCreds, audioDir, videoDir) => {
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        console.log('Connection update:', update);

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconnecting in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                connectToWhatsApp();
            } else {
                console.log('Logged out, not reconnecting.');
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        const jid = message.key.remoteJid;

        if (message && !message.key.fromMe) {
            if (await filterMessage(sock, message, jid)) {
                return;
            }
            const response = await processMessage(sock, { messages: [message] }, audioDir, videoDir, 'whatsapp');
            responseMap.set(jid, response);
        }
    });

    sock.ev.on('creds.update', saveCreds);

    schedule.scheduleJob('0 0 * * *', () => {
        sendDailyBirthdayNotifications(sock).catch(console.error);
    });

    setupMessageListener(sock);
};

// Function to simulate an incoming WhatsApp message
export async function simulateUserMessage(sock, message, jid, audioDir, videoDir) {
    const simulatedMessage = {
        key: {
            remoteJid: jid,
            fromMe: false,
            id: uuidv4(),
            participant: undefined
        },
        messageTimestamp: Math.floor(Date.now() / 1000),
        pushName: 'Web User',
        broadcast: false,
        message: {
            conversation: message,
            extendedTextMessage: {
                text: message,
                previewType: 0,
                contextInfo: {},
                inviteLinkGroupTypeV2: 0
            },
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
                messageSecret: new Uint8Array(16).fill(0).map(() => Math.floor(Math.random() * 256)),
            }
        }
    };

    // Apply spam filter
    if (await filterMessage(sock, simulatedMessage, jid)) {
        console.log('Message blocked by spam filter.');
        return;
    }

    // Process the simulated message
    const response = await processMessage(sock, { messages: [simulatedMessage] }, audioDir, videoDir, 'web');
    console.log('Simulated message response:', response);
}
