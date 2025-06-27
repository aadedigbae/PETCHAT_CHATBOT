from flask import Flask, request, jsonify, send_from_directory
from transformers import TFAutoModelForSeq2SeqLM, AutoTokenizer
import tensorflow as tf
import os

app = Flask(__name__, static_folder='.')

# Load model and tokenizer
MODEL_PATH = "petchat_model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = TFAutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get('question', '')
    input_text = "question: " + question
    input_ids = tokenizer.encode(input_text, return_tensors="tf")
    output = model.generate(input_ids, max_length=128, num_beams=4, early_stopping=True)
    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return jsonify({'response': response})

# Serve static files (index.html, script.js, style.css)
@app.route('/')
def serve_index():
    return send_from_directory('.', 'templates/index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)