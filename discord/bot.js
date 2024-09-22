require('dotenv').config(); // Load environment variables
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const TOKEN = process.env.DISCORD_TOKEN;
const URL = 'http://127.0.0.1:5000/generate';

client.once('ready', () => {
    console.log('Bot is online!');
    console.log('Flask URL:', URL);
    console.log('Discord Token:', TOKEN ? 'Loaded' : 'Not loaded');
});



client.on('messageCreate', async (message) => {
    // Prevent the bot from responding to itself
    if (message.author.bot) return;

    console.log(`Message received: "${message.content}" from ${message.author.username}`);
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
    // Check if the message starts with a specific command (e.g., "!ask")
    if (message.content.startsWith('!ask')) {
        const question = message.content.slice(5).trim(); // Get the question after '!ask' and trim whitespace
        if (!question) {
            message.channel.send("Please provide a question after '!ask'.");
            console.log("No question provided.");
            return;
        }

        console.log(`Question sent to GPT4All: "${question}"`);

        try {
            const response = await axios.post(URL, { question });
            console.log('Received response from GPT4All:', response.data);

            if (response.status === 200) {
                const answer = response.data.response;
                message.channel.send(answer); // Send the response back to the Discord channel
                console.log(`Response sent: "${answer}"`);
            } else {
                console.error('Unexpected response status:', response.status);
                message.channel.send("Failed to get a valid response from the GPT4All service.");
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                message.channel.send(`Error from server: ${error.response.data.message || "Unable to retrieve response."}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                message.channel.send("No response received from the GPT4All service.");
            } else {
                console.error('Error:', error.message);
                message.channel.send("An unexpected error occurred while processing your request.");
            }
        }
    }
});

// Handle login errors
client.login(TOKEN)
    .then(() => console.log('Logged in successfully.'))
    .catch(err => console.error('Failed to login:', err));
