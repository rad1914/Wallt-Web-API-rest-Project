const servers = [
    { name: 'Kali Bot', ip: '20.ip.gl.ply.gg', port: 41633, statusId: 'serverStatusWhatsAppBot' },
];

async function updateServerStatus(server) {
    const { ip, port, statusId } = server;
    const statusElement = document.getElementById(statusId);

    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`);
        const data = await response.json();

        if (data.online) {
            statusElement.innerHTML = `
                <span class="minecraft-text" style="color: #8FF57F;">Server Status: Online</span><br>
                Version: 0.1r<br>
                API: Whiskeys/baileys<br>
                Hostname: ${ip}<br>
                Software: Nodejs
            `;
        } else {
            statusElement.innerHTML = `<span class="minecraft-text" style="color: #FF8F7F;">Server Status: Offline</span>`;
        }

    } catch (error) {
        console.error('Error fetching server status:', error);
        statusElement.innerHTML = `<span style="color: #FF8F7F;">Error</span>`;
    }
}

function updateAllServers() {
    servers.forEach(updateServerStatus);
}

updateAllServers();
setInterval(updateAllServers, 5000);
