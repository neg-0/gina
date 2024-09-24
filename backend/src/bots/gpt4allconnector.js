const { ActivityHandler } = require('botbuilder');
const { createCompletion, loadModel } = require("gpt4all");

class GPT4AllConnector extends ActivityHandler {
  constructor() {
    super();

    // Initialization logic moved to a separate async function
    this.initializeGPT4All();

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let idx in membersAdded) {
        if (membersAdded[idx].id !== context.activity.recipient.id) {
          await context.sendActivity('Now connected to GPT4ALL.');
        }
      }
      await next();
    });

    this.onMessage(async (context, next) => {
      const userMessage = context.activity.text;

      // Ensure GPT4All model is loaded before processing the message
      if (this.chatSession) {
        try {
          const response = await createCompletion(this.chatSession, userMessage);

          const gptResponse = response.data.response;
          await context.sendActivity(gptResponse);
        } catch (error) {
          console.error('Error contacting GPT4ALL:', error);
          await context.sendActivity('There was an error contacting GPT4ALL.');
        }
      } else {
        await context.sendActivity('GPT4ALL is not yet initialized.');
      }

      await next();
    });
  }

  // Separate async initialization method
  async initializeGPT4All() {
    try {
      const model = await loadModel("orca-mini-3b-gguf2-q4_0.gguf", {
        verbose: true,
        device: "gpu", // or 'cpu' depending on your environment
        nCtx: 2048,
      });

      // initialize chat session on the model
      this.chatSession = await model.createChatSession({
        temperature: 0.8,
        systemPrompt: "### System:\nYou are an advanced mathematician.\n\n",
      });

      console.log('GPT4ALL Model initialized successfully.');
    } catch (error) {
      console.error('Error initializing GPT4ALL model:', error);
    }
  }
}

module.exports.GPT4AllConnector = GPT4AllConnector;
