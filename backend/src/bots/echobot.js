const { ActivityHandler } = require('botbuilder');

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
          await context.sendActivity('Welcome to EchoBot. Type anything to get an echo!');
        }
      }
      await next();
    });
  }
}

module.exports.EchoBot = EchoBot;