const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');
const { exec } = require('child_process');

// Cấu hình bot Discord
const TOKEN = 'MTMxMzc5NzIwNTYzNDg0MjY1NQ.Gm84x1.QSCNSdwqyd-8nlBen83gTWeYxo8TpEeG9dbMNE';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

// Hàm chạy lệnh trong Codespaces qua API
async function runCommand(command) {
    // URL và token Codespaces API
    const CODESPACE_API_URL = 'https://api.github.com/...'; // Thay bằng URL API của Codespaces
    const CODESPACE_TOKEN = 'YOUR_CODESPACE_API_TOKEN';

    const response = await fetch(CODESPACE_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CODESPACE_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
    });

    if (!response.ok) throw new Error('Failed to execute command');
    return await response.json();
}

// Khi bot nhận lệnh từ Discord
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('!run') || message.author.bot) return;

    const command = message.content.replace('!run ', '');
    try {
        const result = await runCommand(command);
        message.reply(`Lệnh đã chạy thành công: ${result.output}`);
    } catch (error) {
        message.reply(`Lỗi: ${error.message}`);
    }
});

// Tự động chạy lệnh mỗi 10 phút
setInterval(() => {
    const command = 'echo "Hello from Codespaces"'; // Thay lệnh bạn muốn chạy
    runCommand(command)
        .then((res) => console.log('Command executed:', res))
        .catch((err) => console.error('Command failed:', err));
}, 10 * 60 * 1000); // 10 phút

client.login(TOKEN);
