const { CloudAdapter, ConfigurationBotFrameworkAuthentication, ActivityHandler } = require('botbuilder');
const express = require('express');
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

// Define the bot logic by extending ActivityHandler
class EchoBot extends ActivityHandler {
  constructor() {
    super();
    // OnMessage handler: Handles incoming text messages
    this.onMessage(async (context, next) => {
      const userMessage = context.activity.text;
      // Send back an echo message to the user
      await context.sendActivity(`You said: ${userMessage}. It worked!`);
      // Call the next middleware in the pipeline
      await next();
    });

    // OnMembersAdded handler: Greets new members when they join the conversation
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let idx in membersAdded) {
        if (membersAdded[idx].id !== context.activity.recipient.id) {
          await context.sendActivity('Welcome to the bot!');
        }
      }
      await next();
    });
  }
}

// Create an instance of the EchoBot
const bot = new EchoBot();

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
