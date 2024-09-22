require('dotenv').config(); // Load environment variables
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const TOKEN = process.env.DISCORD_TOKEN;
const URL = 'http://127.0.0.1:5000/generate';
console.log('Discord Token:', TOKEN);

client.once('ready', () => {
    if (!URL) {
        console.error("FLASK_URL environment variable is not defined!");
    } else {
        console.log('Flask URL:', URL);
    }
    if (!TOKEN) {
        console.error("DISCORD_TOKEN environment variable is not defined!");
    } else {
        console.log('Discord Token:', TOKEN);
    }
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    // Prevent the bot from responding to itself
    if (message.author.bot) return;

    // Check if the message starts with a specific command (e.g., "!ask")
    if (message.content.startsWith('!ask')) {
        const question = message.content.slice(5).trim(); // Get the question and trim whitespace
        if (!question) {
            message.channel.send("Please provide a question after '!ask'.");
            return;
        }
        
        try {
            const response = await axios.post(URL, { question });
            if (response.status === 200) {
                const answer = response.data.response;
                message.channel.send(answer); // Send the response back to the Discord channel
            } else {
                message.channel.send("Failed to get a valid response from the GPT4All service.");
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Error response:', error.response.data);
                message.channel.send(`Error from server: ${error.response.data.message || "Unable to retrieve response."}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
                message.channel.send("No response received from the GPT4All service.");
            } else {
                // Something happened in setting up the request that triggered an error
                console.error('Error:', error.message);
                message.channel.send("An unexpected error occurred while processing your request.");
            }
        }
    }
});

client.login(TOKEN).catch(console.error); // Log any errors
