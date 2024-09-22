from flask import Flask, request, jsonify
from gpt4all import GPT4All

# Initialize GPT4All model
gpt = GPT4All(r"C:\Users\Evan\Desktop\gina\discord\Meta-Llama-3-8B-Instruct.Q4_0.gguf")  # Ensure the model path is correct

# Initialize Flask app
app = Flask(__name__)

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
        
        # Return the response as JSON
        return jsonify({'response': response})

    except FileNotFoundError:
        return jsonify({'error': 'Model file not found'}), 404
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred: ' + str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
