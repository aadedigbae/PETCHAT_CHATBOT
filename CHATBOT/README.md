# 🐾 PetChat – Domain-Specific Pet Care QA Chatbot

PetChat is an intelligent chatbot designed to provide instant, reliable answers to questions about dog and cat care. Built on a fine-tuned FLAN-T5 Transformer model, PetChat delivers expert guidance on pet health, nutrition, behavior, and more—anytime, anywhere.

![Domain](https://img.shields.io/badge/Domain-Pet%20Care-blue)
![Model](https://img.shields.io/badge/Model-FLAN--T5--Base-green)
![Framework](https://img.shields.io/badge/Framework-TensorFlow-orange)
![BLEU](https://img.shields.io/badge/BLEU-0.32-brightgreen)
![F1](https://img.shields.io/badge/F1-0.41-blue)
![UI](https://img.shields.io/badge/UI-Flask%20Web%20App-yellow)

---

## 🌟 Why Pet Care as a Domain?

Pet ownership is at an all-time high, but access to trustworthy, actionable pet care advice remains a challenge. Misinformation, conflicting sources, and the lack of instant expert support can lead to poor decisions affecting pet health and well-being.

**PetChat bridges this gap by providing:**
- **24/7 Expert Guidance:** Reliable answers to common and complex pet care questions.
- **Domain-Specific Intelligence:** Focused on dogs and cats, with responses grounded in veterinary best practices.
- **Personalized Support:** Tailored advice for nutrition, health, training, and behavior.
- **Accessible Learning:** Empowers new and experienced pet owners alike.

---

## 🗂️ Dataset Collection & Preprocessing

### Dataset Overview
- **Source:** Kaggle “Dog-Cat-QA.csv” (570+ Q&A pairs)
- **Coverage:** Feeding, grooming, health, training, behavior, breeds, and more.
- **Diversity:** Questions range from basic care to advanced health scenarios.

### Preprocessing Pipeline
- **Cleaning:** Removed missing values, duplicates, and answers with <5 words.
- **Normalization:** Lowercased text, cleaned punctuation, standardized whitespace.
- **Formatting:**  
  - **Input:** `question: <question>`
  - **Target:** `<answer>`
- **Tokenization:** Hugging Face T5 tokenizer (SentencePiece).
- **Splitting:** 90% training, 10% validation.

#### Sample Before & After Cleaning

| Original Question                | Cleaned Input                          | Cleaned Target                        |
|----------------------------------|----------------------------------------|---------------------------------------|
| What should I feed my puppy?     | question: what should i feed my puppy? | Puppies need a balanced diet...       |

---

## 🧠 Model Architecture & Fine-Tuning

### Model Selection
- **Base Model:** `google/flan-t5-base` (Generative QA, encoder-decoder)
- **Framework:** TensorFlow (TF 2.x, Hugging Face Transformers)

### Fine-Tuning Details
- **Batch Size:** 2 (optimized for local memory)
- **Learning Rate:** 5e-5
- **Epochs:** 15 (with early stopping)
- **Optimizer:** Adam
- **Early Stopping:** Monitors validation loss, restores best weights

### Experiment Table

| Experiment | Model           | Batch Size | LR     | Epochs | Best Val Loss | BLEU | F1   | Notes                |
|------------|-----------------|-----------|--------|--------|--------------|------|------|----------------------|
| 1          | flan-t5-base    | 2         | 5e-5   | 15     | 2.10         | 0.32 | 0.41 | Baseline             |
| 2          | flan-t5-base    | 4         | 3e-5   | 20     | 1.98         | 0.35 | 0.44 | Lower LR, larger BS  |
| 3          | flan-t5-small   | 4         | 5e-5   | 15     | 2.25         | 0.28 | 0.39 | Smaller model        |

---

## 📊 Performance Metrics & Evaluation

### Quantitative Metrics
- **BLEU Score:** 0.32 (baseline), up to 0.35 (tuned)
- **F1 Score:** 0.41 (baseline), up to 0.44 (tuned)
- **Perplexity:** Reported using PyTorch model for reference
- **Validation Loss:** 2.10 → 1.98 (improved with tuning)

### Qualitative Testing
- **In-domain:** Accurately answers pet care questions (see examples below)
- **Out-of-domain:** Politely rejects or redirects irrelevant queries

#### Sample Q&A

| User Question                                 | PetChat Response                                                                                      |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------------|
| What are signs that a dog has a food allergy? | Common signs include itching, chronic ear infections, vomiting, diarrhea, and red, inflamed skin.     |
| How often should I brush my cat's fur?        | Short-haired cats should be brushed once a week, while long-haired cats may need daily brushing.      |

---

## 💻 User Interface & Deployment

### Web App Features
- **Framework:** Flask (Python)
- **Functionality:**  
  - Users enter pet care questions via a simple web form.
  - Backend loads the fine-tuned model and returns answers in real time.
  - Clear instructions and error handling for user experience.

### How to Run Locally

1. **Clone the repository:**
git clone https://github.com/yourusername/PetChat-Domain-Chatbot.git 
cd PetChat-Domain-Chatbot

2. **Install dependencies:**
pip install -r requirements.txt

3. **Start the Flask backend:**
python app.py

4. **Open the UI in your browser:**
http://localhost:5000



### Demo Video

[![Watch the Demo Video](https://img.shields.io/badge/YouTube-Demo_Video-red?logo=youtube)](https://www.youtube.com/your-demo-link)

---

## 📝 Code Quality & Documentation

- **Notebook:** Fully documented Jupyter Notebook covering data cleaning, preprocessing, model training, evaluation, and sample interactions.
- **Code:** Clean, modular, and commented for clarity.
- **README:** Comprehensive instructions, dataset description, and usage guide.
- **Experiment Table:** Included for hyperparameter tuning and results comparison.

---

## 🧩 Project Structure
PetChat-Domain-Chatbot/ ├── data/ │ └── Dog-Cat-QA.csv ├── cleaned_pet_qa.csv ├── pettychat_model/ # Saved model and tokenizer ├── app.py # Flask backend ├── templates/ │ └── index.html # Web UI ├── PetChat.ipynb # Jupyter Notebook (main workflow) ├── requirements.txt └── README.md




---

## 📈 Results & Insights

- **Significant improvement** in BLEU and F1 scores after hyperparameter tuning.
- **No overfitting** observed due to early stopping and validation monitoring.
- **Handles both simple and complex pet care questions** with high accuracy.
- **Rejects out-of-domain queries** gracefully, maintaining domain focus.

---

## 🗨️ Example Conversations

**User:** What should I feed a 2-month-old puppy?  
**PetChat:** At 2 months, puppies should eat high-quality puppy food formulated for their age and breed. Feed small, frequent meals and provide fresh water at all times.

**User:** How do I stop my dog from barking excessively?  
**PetChat:** Identify the cause of barking, provide regular exercise, use positive reinforcement, and avoid yelling. If the problem persists, consult a professional trainer.

**User:** What is the capital of France?  
**PetChat:** I'm here to help with pet care questions. Please ask me about dogs or cats!

---

## 🚀 Future Work

- Expand dataset to include more pet species and rare conditions.
- Integrate with voice assistants for hands-free Q&A.
- Add user feedback and learning analytics to improve responses.
- Deploy on cloud for global accessibility.

---

## 📚 References

- [Kaggle Dog-Cat-QA Dataset](https://www.kaggle.com/datasets)
- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [TensorFlow Documentation](https://www.tensorflow.org/)
- [Flask Web Framework](https://flask.palletsprojects.com/)

---

## 📬 Contact

For questions, feedback, or collaboration, please contact [your.email@domain.com](mailto:your.email@domain.com).

---

## 🏆 Mission

*PetChat was developed as part of a domain-specific NLP project to make expert pet care advice accessible, accurate, and engaging for all pet owners.*

---

[View the full code and notebook on GitHub](https://github.com/yourusername/PetChat-Domain-Chatbot)
