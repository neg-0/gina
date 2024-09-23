import ReactWebChat from "botframework-webchat";
import { FluentThemeProvider } from "botframework-webchat-fluent-theme";
import { useEffect, useState } from "react";

const Chatbot = () => {
  const [directLine, setDirectLine] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const secret = import.meta.env.VITE_DIRECT_LINE_SECRET;
      console.log("secret", secret);

      const response = await fetch(
        "https://directline.botframework.com/v3/directline/tokens/generate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret}`,
          },
        }
      ).then((response) => response.json());

      console.log("response", response);

      const token = response.token;

      console.log("token", token);

      // Use the token to initialize Direct Line
      setDirectLine(window.WebChat.createDirectLine({ token }));
    };

    fetchToken();
  }, []);

  return (
    <div style={{ height: "400px", width: "600px" }}>
      {directLine ? (
        <FluentThemeProvider>
          <ReactWebChat
            directLine={directLine}
            styleOptions={{
              backgroundColor: "#F0F0F0", // Adjust theme as needed
            }}
            // Add event listeners for logging activity and errors
            onEvent={(event) => {
              console.log("Received event:", event);
            }}
            onError={(error) => {
              console.error("Web Chat Error:", error);
            }}
          />
        </FluentThemeProvider>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Chatbot;
