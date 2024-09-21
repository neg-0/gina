# GINA: Project Idea Assistant

## Overview

**GINA** is an intelligent, GPT-powered chatbot designed to assist in project management, idea generation, and innovation. This tool helps users to pitch ideas, scope them, and track them through a streamlined conversational interface. The bot also aids in evaluating the value and effort of ideas for prioritization, storing project data, and integrating with external services like Microsoft Teams.

The project is structured in two parts:

1. **Frontend**: A chatbot UI built using React and Microsoft Bot Framework Web Chat, designed for web interaction.
2. **Backend**: An Express server that connects the frontend to a locally run or cloud-hosted LLM (Large Language Model) and manages the bot’s logic.

---

## Tech Stack

### **Frontend (React Application)**:

- **React.js**: Component-based UI library for building the chatbot interface.
- **MaterialUI**: A popular React UI framework used to create sleek and responsive interfaces.
- **Microsoft Bot Framework Web Chat**: Embedded web chat control that allows users to interact with the bot.

### **Backend (Node.js & Express)**:

- **Node.js**: JavaScript runtime for building the server-side logic.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **Bot Framework CloudAdapter**: Used to manage bot interactions and handle communication between the bot and Direct Line.
- **WebSocket (ws)**: A WebSocket library for Node.js to handle real-time communication.

### **LLM Integration**:

- Locally hosted LLMs such as **GPT-J**, **GPT-4All**, or **OpenAssistant** can be integrated for language generation.
- Optionally, Microsoft Cognitive Services can be connected for enhanced AI capabilities.

---

## Features

1. **Chatbot Interface**: A clean and responsive chatbot frontend using React and Microsoft Bot Framework Web Chat.
2. **Project Idea Submission**: Users can submit their ideas and receive suggestions to refine the scope.
3. **Idea Scoring**: The bot evaluates ideas based on value and effort, helping to prioritize them.
4. **Project Tracking**: Ideas and projects are stored in a database and can be referenced or updated.
5. **File Upload**: Users can upload files (such as project-related documents) for additional context.
6. **Integration with LLM**: The bot uses a locally hosted LLM for natural language processing and generation.
7. **Future Integration with Teams**: Designed with future scalability to integrate with Microsoft Teams.

---

## Getting Started

### Prerequisites

- **Node.js** (version 16.x or higher)
- **npm** (Node Package Manager)
- **MongoDB** (for project data storage, optional based on your database preference)
- **Direct Line Secret** (if integrating with Microsoft Bot Framework)

### Clone the Repository

```bash
git clone https://github.com/neg-0/gina.git
cd gina
```

### Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

### Running the Application Locally

1. **Set up environment variables**:
   Create `.env` files in both the `frontend` and `backend` directories:

   **Frontend `.env`**:

   ```bash
   REACT_APP_API_URL=http://localhost:3978/api
   ```

   **Backend `.env`**:

   ```bash
   PORT=3978
   MicrosoftAppId=YOUR_MICROSOFT_APP_ID
   MicrosoftAppPassword=YOUR_MICROSOFT_APP_PASSWORD
   DirectLineSecret=YOUR_DIRECT_LINE_SECRET
   ```

2. **Start the Backend**:
   From the `backend` directory, run the following command:

   ```bash
   npm start
   ```

   This will start the Express server on `http://localhost:3978`.

3. **Start the Frontend**:
   From the `frontend` directory, run:

   ```bash
   npm run dev
   ```

   This will start the React frontend on `http://localhost:5173`.

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173` to interact with the chatbot.

---

## Development Roadmap

### **Phase 1: MVP (Minimum Viable Product)**

- [ ] Set up React-based frontend using Microsoft Bot Framework Web Chat.
- [ ] Implement project submission and value/effort evaluation via bot.
- [ ] Create REST API for project data storage and retrieval.
- [ ] Integrate a local LLM for conversational AI.

### **Phase 2: Integration & Refinement**

- [ ] Add user authentication (optional for project data security).
- [ ] Enable project tracking and history updates.
- [ ] Refine the bot’s scoring algorithm for value/effort prioritization.
- [ ] Integrate with Microsoft Teams for multi-channel support.
- [ ] Implement advanced LLM-based features (natural language understanding, etc.).

### **Phase 3: Scalability & AI Enhancements**

- [ ] Deploy on scalable cloud infrastructure (e.g., Azure, AWS).
- [ ] Add support for other external integrations (SharePoint, OneDrive).
- [ ] Use Azure Cognitive Services for improved AI capabilities.
- [ ] Expand file management with document search and retrieval.

---

## Contribution

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m "Added feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
