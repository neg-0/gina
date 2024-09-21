import ReactWebChat from "botframework-webchat";
import { useEffect, useState } from "react";

const Chatbot = () => {
  const [directLine, setDirectLine] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch("http://localhost:3978/api/token", {
        // Replace with your token endpoint
        method: "POST",
      });
      const { token } = await res.json();

      // Use the token to initialize Direct Line
      setDirectLine(window.WebChat.createDirectLine({ token }));
    };

    fetchToken();
  }, []);

  return (
    <div style={{ height: "400px", width: "600px" }}>
      {directLine ? (
        <ReactWebChat directLine={directLine} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Chatbot;
