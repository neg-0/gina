const { ActivityHandler } = require('botbuilder');
const { AzureOpenAI } = require("openai");
require('dotenv').config();

// Add `Cognitive Services User` to identity for Azure OpenAI resource
const {
  DefaultAzureCredential,
  getBearerTokenProvider,
} = require("@azure/identity");

// Get environment variables
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAIDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const azureOpenAIVersion = process.env.OPENAI_API_VERSION;
const assistantId = process.env.AZURE_OPENAI_ASSISTANT_ID;
const apiKey = process.env.AZURE_OPENAI_API_KEY;

// Check env variables
if (!azureOpenAIEndpoint || !azureOpenAIDeployment || !azureOpenAIVersion) {
  throw new Error(
    "Please ensure to set AZURE_OPENAI_DEPLOYMENT_NAME and AZURE_OPENAI_ENDPOINT in your environment variables."
  );
}

// Get Azure SDK client
const getClient = () => {
  const credential = new DefaultAzureCredential();
  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(credential, scope);

  const endpoint = azureOpenAIEndpoint;
  const apiVersion = azureOpenAIVersion;
  const deploymentName = azureOpenAIDeployment;

  const assistantsClient = new AzureOpenAI({
    apiKey,
    apiVersion,
    deployment: deploymentName,
  });

  return assistantsClient;
};

const assistantsClient = getClient();

class AzureOpenAIConnector extends ActivityHandler {
  constructor() {
    super();

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let idx in membersAdded) {
        if (membersAdded[idx].id !== context.activity.recipient.id) {
          try {

            // Load the assistant
            console.log(`Loading Assistant: ${assistantId}`);
            this.assistantResponse = await assistantsClient.beta.assistants.retrieve(assistantId);
            console.log(`Assistant loaded: ${JSON.stringify(this.assistantResponse)}`);

            // Create a thread
            this.assistantThread = await assistantsClient.beta.threads.create({});
            console.log(`Thread created: ${JSON.stringify(this.assistantThread)}`);

            await context.sendActivity("Hi, I'm GINA!");
          } catch (error) {
            console.error(error);
          }
        }
      }
      await next();
    });

    this.onMessage(async (context, next) => {
      const message = context.activity.text;

      try {
        // Add a user question to the thread
        const threadResponse = await assistantsClient.beta.threads.messages.create(
          this.assistantThread.id,
          {
            role: "user",
            content: message,
          }
        );
        console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

        // Run the thread and poll it until it is in a terminal state
        const runResponse = await assistantsClient.beta.threads.runs.createAndPoll(
          this.assistantThread.id,
          {
            assistant_id: this.assistantResponse.id,
          },
          { pollIntervalMs: 2000 }
        );

        // Check if there was an error (e.g., rate limit)
        if (runResponse.status === 'failed' && runResponse.last_error) {
          console.error(`Run error: ${runResponse.last_error.message}`);
          await context.sendActivity(`Error: ${runResponse.last_error.message}`);
        } else {
          console.log(`Run created:  ${JSON.stringify(runResponse)}`);

          // Get the messages
          const runMessages = await assistantsClient.beta.threads.messages.list(
            this.assistantThread.id
          );

          console.log(`Messages: ${JSON.stringify(runMessages)}`);

          // Access messages from the runMessages.body.data
          const messages = runMessages.body.data;

          for (const runMessageDatum of messages) {
            // Only process messages that are newer than the last message ID we processed
            if (!this.lastMessageId || runMessageDatum.id > this.lastMessageId) {
              for (const item of runMessageDatum.content) {
                // types are: "image_file" or "text"
                if (item.type === "text" && runMessageDatum.role === "assistant") { // Only handle assistant responses
                  console.log(`Assistant's response: ${item.text?.value}`);
                  await context.sendActivity(item.text?.value);
                }
              }
            }
          }

          // Update the lastMessageId to the most recent message
          this.lastMessageId = messages[messages.length - 1].id;
        }
      } catch (error) {
        console.error(error);
        await context.sendActivity(`Error: ${error.message}`);
      }

      await next();
    });
  }
}

module.exports.AzureOpenAIConnector = AzureOpenAIConnector;