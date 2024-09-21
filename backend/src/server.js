const { CloudAdapter, ConfigurationBotFrameworkAuthentication } = require('botbuilder');
const express = require('express');
const { DirectLine } = require('botframework-directlinejs');
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config();

// Set up authentication for CloudAdapter
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);

// Create the CloudAdapter
const adapter = new CloudAdapter(botFrameworkAuthentication);

// Define error handler
adapter.onTurnError = async (context, error) => {
  console.error(`[onTurnError] unhandled error: ${error}`);
  await context.sendActivity('Oops, something went wrong!');
};

// Create an instance of your bot
// const bot = new YourBot(); // Replace with your bot's instance

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'  // Allow only your frontend's origin
}));

// Define bot endpoint for Direct Line/Web Chat
app.post('/api/messages', async (req, res) => {
  await adapter.process(req, res, async (context) => {
    // Process bot activity
    await context.sendActivity(`You said ${context.activity.text}`)
  });
});

app.post('/api/token', async (req, res) => {
  const secret = 'YOUR_DIRECT_LINE_SECRET';
  const directLine = new DirectLine({
    secret,
    WebSocket: WebSocket
  });

  // Respond with the generated token
  res.json({ token: directLine.secret });
});

// Start the server
app.listen(3978, () => {
  console.log('Server is running on port 3978');
});
