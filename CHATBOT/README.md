# PetChat – Domain-Specific Pet Care QA Chatbot

## 1. Introduction

Pet ownership is at an all-time high, but access to trustworthy, actionable pet care advice remains a challenge. Misinformation, conflicting sources, and the lack of instant expert support can lead to poor decisions affecting pet health and well-being. As pet-related inquiries grow in volume and complexity, traditional manual response systems become impractical, leading to long wait times and inconsistencies in advice quality.

To address this, PetChat leverages recent advancements in Natural Language Processing (NLP), particularly Transformer-based models, to deliver expert, on-demand pet care guidance. Unlike traditional rule-based or classification-based chatbots, PetChat uses a generative model (FLAN-T5) to produce dynamic, contextually relevant responses for both simple and complex pet care questions.

**Project Goals:**
- Preprocess and clean a real-world pet care Q&A dataset for compatibility with T5.
- Fine-tune a FLAN-T5 model to generate high-quality, domain-specific answers.
- Deploy the chatbot with an intuitive Flask web interface.
- Evaluate performance quantitatively (BLEU, F1, perplexity) and qualitatively (sample conversations).

---

## 2. Dataset Collection & Preprocessing

### 2.1 Dataset Overview

- **Source:** Kaggle “Dog-Cat-QA.csv” (570+ Q&A pairs)
- **Coverage:** Feeding, grooming, health, training, behavior, breeds, and more.
- **Diversity:** Questions range from basic care to advanced health scenarios.

### 2.2 Dataset Structure

Each record in the dataset includes:
- **Question:** The pet owner's inquiry (e.g., “What should I feed my puppy?”)
- **Answer:** The ideal expert response (e.g., “Puppies need a balanced diet...”)

#### Sample Before & After Cleaning

| Original Question                | Cleaned Input                          | Cleaned Target                        |
|----------------------------------|----------------------------------------|---------------------------------------|
| What should I feed my puppy?     | question: what should i feed my puppy? | Puppies need a balanced diet...       |

### 2.3 Data Preprocessing

**Key Steps:**
- **Cleaning:** Removed missing values, duplicates, and answers with <5 words.
- **Normalization:** Lowercased text, cleaned punctuation, standardized whitespace.
- **Formatting:**  
  - **Input:** `question: <question>`
  - **Target:** `<answer>`
- **Tokenization:** Hugging Face T5 tokenizer (SentencePiece).
- **Splitting:** 90% training, 10% validation.

**Why This Dataset?**  
This dataset provides a diverse collection of real-world pet care queries, ensuring the model can generalize across a wide range of topics and phrasing styles. Its conversational format aligns well with generative models like T5, enabling the chatbot to produce fluent, contextually appropriate responses.

---

## 3. Model Selection & Fine-Tuning

### 3.1 Model Selection

- **Base Model:** `google/flan-t5-base` (Generative QA, encoder-decoder)
- **Framework:** TensorFlow (TF 2.x, Hugging Face Transformers)

**Why FLAN-T5?**  
FLAN-T5 is a powerful generative model capable of producing natural, context-aware responses. Its encoder-decoder structure ensures strong alignment between user queries and generated answers, making it ideal for domain-specific QA tasks.

### 3.2 Fine-Tuning Process

- **Batch Size:** 2 (optimized for local memory)
- **Learning Rate:** 5e-5
- **Epochs:** 15 (with early stopping)
- **Optimizer:** Adam
- **Early Stopping:** Monitors validation loss, restores best weights

**Training Pipeline:**
- Inputs formatted as `"question: <normalized question>"`
- Outputs as `<normalized answer>`
- Tokenized with max_length=128 for both input and output
- Model checkpointing and early stopping to prevent overfitting

### 3.3 Hyperparameter Tuning

| Experiment | Model           | Batch Size | LR     | Epochs | Best Val Loss | BLEU | F1   | Notes                |
|------------|-----------------|-----------|--------|--------|--------------|------|------|----------------------|
| 1          | flan-t5-base    | 2         | 5e-5   | 15     | 2.10         | 0.32 | 0.41 | Baseline             |
| 2          | flan-t5-base    | 4         | 3e-5   | 20     | 1.98         | 0.35 | 0.44 | Lower LR, larger BS  |
| 3          | flan-t5-small   | 4         | 5e-5   | 15     | 2.25         | 0.28 | 0.39 | Smaller model        |

**Generation Parameters:**  
- `num_beams=4`, `repetition_penalty=2.0`, `no_repeat_ngram_size=3`, `temperature=1.2`, `top_p=0.95`  
These settings reduce repetitive answers and improve response diversity.

---

## 4. Performance Evaluation

### 4.1 Quantitative Metrics

- **BLEU Score:** 0.32 (baseline), up to 0.35 (tuned)
- **F1 Score:** 0.41 (baseline), up to 0.44 (tuned)
- **Perplexity:** Calculated using both TensorFlow and PyTorch models for reference
- **Validation Loss:** 2.10 → 1.98 (improved with tuning)

### 4.2 Qualitative Testing

**In-domain:**  
Accurately answers pet care questions (see examples below)

**Out-of-domain:**  
Politely rejects or redirects irrelevant queries

#### Sample Q&A

| User Question                                 | PetChat Response                                                                                      |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------------|
| What are signs that a dog has a food allergy? | Common signs include itching, chronic ear infections, vomiting, diarrhea, and red, inflamed skin.     |
| How often should I brush my cat's fur?        | Short-haired cats should be brushed once a week, while long-haired cats may need daily brushing.      |

---

## 5. UI Integration

### 5.1 Web App Features

- **Framework:** Flask (Python)
- **Functionality:**  
  - Users enter pet care questions via a simple web form.
  - Backend loads the fine-tuned model and returns answers in real time.
  - Clear instructions and error handling for user experience.

### 5.2 How to Run Locally

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/PetChat-Domain-Chatbot.git 
    cd PetChat-Domain-Chatbot
    ```

2. **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

3. **Start the Flask backend:**
    ```sh
    python app.py
    ```

4. **Open the UI in your browser:**
    ```
    http://localhost:5000
    ```

### 5.3 Demo Video

[![Watch the Demo Video](https://drive.google.com/drive/folders/1iQss2Zp--QzHxGidopp6stTOpMOD-g_y?usp=sharing)](https://drive.google.com/drive/folders/1iQss2Zp--QzHxGidopp6stTOpMOD-g_y?usp=sharing)

---

## 6. Project Structure

```
PetChat-Domain-Chatbot/
├── datasets/
│   ├── Dog-Cat-QA.csv
│   └── cleaned_pet_qa.csv
├── petchat_model/           # Saved model and tokenizer
│   ├── config.json
│   ├── tokenizer_config.json
│   ├── special_tokens_map.json
│   └── tf_model.h5
├── app.py                   # Flask backend
├── templates/
│   └── index.html           # Web UI
├── static/                  # CSS/JS assets
├── PetChat.ipynb            # Jupyter Notebook (main workflow)
├── requirements.txt
└── README.md
```

---

## 7. Results & Insights

- **Significant improvement** in BLEU and F1 scores after hyperparameter tuning.
- **No overfitting** observed due to early stopping and validation monitoring.
- **Handles both simple and complex pet care questions** with high accuracy.
- **Rejects out-of-domain queries** gracefully, maintaining domain focus.

---

## 8. Example Conversations

**User:** What should I feed a 2-month-old puppy?  
**PetChat:** At 2 months, puppies should eat high-quality puppy food formulated for their age and breed. Feed small, frequent meals and provide fresh water at all times.

**User:** How do I stop my dog from barking excessively?  
**PetChat:** Identify the cause of barking, provide regular exercise, use positive reinforcement, and avoid yelling. If the problem persists, consult a professional trainer.

**User:** What is the capital of France?  
**PetChat:** I'm here to help with pet care questions. Please ask me about dogs or cats!

---

## 9. References

- [Kaggle Dog-Cat-QA Dataset](https://www.kaggle.com/datasets)
- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [TensorFlow Documentation](https://www.tensorflow.org/)
- [Flask Web Framework](https://flask.palletsprojects.com/)

---

## 10. Mission

*PetChat was developed as part of a domain-specific NLP project to make expert pet care advice accessible, accurate, and engaging for all pet owners.*

---

## 11. Appendices

### Appendix A: Code Repository

- [GitHub Repository](https://github.com/aadedigbae/PETCHAT_CHATBOT)

### Appendix B: Demo Video

- [Demo Video](https://drive.google.com/drive/folders/1iQss2Zp--QzHxGidopp6stTOpMOD-g_y?usp=sharing)
