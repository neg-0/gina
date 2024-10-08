const { ActivityHandler } = require('botbuilder');
const { AzureOpenAI } = require("openai");
require('dotenv').config();

// NOTE: Cannot get Cognitive Services User to work with Azure OpenAI
// Instead we will use the Azure OpenAI endpoint and API key

// Add `Cognitive Services User` to identity for Azure OpenAI resource
// const {
//   DefaultAzureCredential,
//   getBearerTokenProvider,
// } = require("@azure/identity");

// const credential = new DefaultAzureCredential();
// const scope = "https://cognitiveservices.azure.com/.default";
// const azureADTokenProvider = getBearerTokenProvider(credential, scope);

// Get environment variables
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAIDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const azureOpenAIVersion = process.env.OPENAI_API_VERSION;
const assistantId = process.env.AZURE_OPENAI_ASSISTANT_ID;

if (!azureOpenAIEndpoint || !azureOpenAIDeployment || !azureOpenAIVersion) {
  throw new Error(
    "Please ensure to set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME, and OPENAI_API_VERSION in your environment variables."
  );
}

const options = {
  // azureADTokenProvider,
  deployment: azureOpenAIDeployment,
  apiVersion: azureOpenAIVersion,
  endpoint: azureOpenAIEndpoint,
};

const client = new AzureOpenAI(options);


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
            this.assistantResponse = await client.beta.assistants.retrieve(assistantId);
            console.log(`Assistant loaded: ${JSON.stringify(this.assistantResponse)}`);

            // Create a thread
            this.assistantThread = await client.beta.threads.create();
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
        const threadResponse = await client.beta.threads.messages.create(
          this.assistantThread.id,
          {
            role: "user",
            content: message,
          }
        );
        console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

        // Run the thread and poll it until it is in a terminal state
        const runResponse = await client.beta.threads.runs.createAndPoll(
          this.assistantThread.id,
          {
            assistant_id: this.assistantResponse.id,
          },
          { pollIntervalMs: 2000 }
        );

        // Check if there was an error
        if (runResponse.status === 'failed' && runResponse.last_error) {
          console.error(`Run error: ${runResponse.last_error.message}`);
          await context.sendActivity(`Error: ${runResponse.last_error.message}`);
        } else {
          console.log(`Run created:  ${JSON.stringify(runResponse)}`);

          // Get the messages
          const runMessages = await client.beta.threads.messages.list(
            this.assistantThread.id
          );

          console.log(`Messages: ${JSON.stringify(runMessages)}`);

          // Iterate over the messages
          for await (const runMessageDatum of runMessages) {
            for (const item of runMessageDatum.content) {
              // Only process assistant's text responses
              if (item.type === "text" && runMessageDatum.role === "assistant") {
                console.log(`Assistant's response: ${item.text?.value}`);
                await context.sendActivity(item.text?.value);
              }
            }
          }
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