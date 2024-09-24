const { CloudAdapter, ConfigurationBotFrameworkAuthentication, ActivityHandler } = require('botbuilder');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { AzureOpenAIConnector } = require('./bots/azureOpenAiConnector');

// Set up authentication for CloudAdapter
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);

// Create the CloudAdapter
const adapter = new CloudAdapter(botFrameworkAuthentication);

// Define error handler
adapter.onTurnError = async (context, error) => {
  console.error(`[onTurnError] unhandled error: ${error}`);
  await context.sendActivity('Oops, something went wrong!');
};

// Create an instance of the EchoBot
const bot = new AzureOpenAIConnector();

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));

// Define bot endpoint for Direct Line/Web Chat
app.post('/api/messages', async (req, res) => {
  await adapter.process(req, res, async (context) => {
    // Delegate activity processing to the bot instance
    await bot.run(context);
  });
});

// Start the server
app.listen(3978, () => {
  console.log('Server is running on port 3978');
});
