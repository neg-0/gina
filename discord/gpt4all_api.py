from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt4all import GPT4All
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)

# Check model file existence
model_path = r"C:\Users\Evan\Desktop\gina\discord\Meta-Llama-3-8B-Instruct.Q4_0.gguf"
if not os.path.exists(model_path):
    logging.error("Model file not found at the specified path.")
    exit(1)

# Initialize GPT4All model
gpt = GPT4All(model_path)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/generate', methods=['POST'])
def generate():
    try:
        # Check if the content type is application/json
        if request.content_type != 'application/json':
            return jsonify({'error': 'Content-Type must be application/json'}), 415
        
        data = request.json
        
        # Check for the presence of the 'question' field
        question = data.get('question')
        if not question:
            return jsonify({'error': 'No question provided'}), 400
        
        # Use GPT4All within a chat session to generate a response
        with gpt.chat_session() as session:
            response = session.generate(question)
        
        if not response:
            return jsonify({'error': 'No response generated.'}), 500
        
        # Return the response as JSON
        return jsonify({'response': response})

    except FileNotFoundError:
        return jsonify({'error': 'Model file not found'}), 404
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logging.error(f"Error: {str(e)}")  # Log the error
        return jsonify({'error': 'An unexpected error occurred: ' + str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
