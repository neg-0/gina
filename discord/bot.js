client.on('messageCreate', async (message) => {
    // Prevent the bot from responding to itself
    if (message.author.bot) return;

    // Check if the message starts with a specific command (e.g., "!ask")
    if (message.content.startsWith('!ask')) {
        const question = message.content.slice(5).trim(); // Get the question and trim whitespace
        console.log('Received question:', question); // Debug log

        if (!question) {
            message.channel.send("Please provide a question after '!ask'.");
            return;
        }
        
        try {
            const response = await axios.post(URL, { question });
            console.log('Flask response:', response.data); // Debug log
            
            if (response.status === 200) {
                const answer = response.data.response;
                message.channel.send(answer); // Send the response back to the Discord channel
            } else {
                message.channel.send("Failed to get a valid response from the GPT4All service.");
            }
        } catch (error) {
            console.error('Error during Flask request:', error); // More detailed error logging
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
