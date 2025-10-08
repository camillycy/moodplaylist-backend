from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from deep_translator import GoogleTranslator
import re

app = FastAPI(title="Mood Playlist AI")

MODEL_NAME = "SamLowe/roberta-base-go_emotions"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

class TextRequest(BaseModel):
    text: str

# Função de pré-processamento
def preprocess_text(text: str) -> str:
    # 1️⃣ Remover múltiplas letras repetidas (ex: felizzz -> feliz)
    text = re.sub(r'(.)\1{2,}', r'\1', text)

    # 2️⃣ Remover emojis (opcional)
    text = re.sub(r'[^\w\s,!?]', '', text)

    # 3️⃣ Traduzir para inglês
    translated = GoogleTranslator(source='pt', target='en').translate(text)

    return translated

@app.post("/analyze")
async def analyze_emotion(request: TextRequest):
    # Pré-processar texto
    preprocessed_text = preprocess_text(request.text)

    # Tokenizar
    inputs = tokenizer(preprocessed_text, return_tensors="pt")

    # Inferência
    with torch.no_grad():
        outputs = model(**inputs)

    # Probabilidades
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    labels = model.config.id2label

    # Retornar apenas a emoção com maior probabilidade
    max_idx = torch.argmax(probs)
    top_emotion = labels[max_idx.item()]
    confidence = float(probs[0][max_idx])

    result = {
        "emotion": top_emotion,
        "confidence": confidence
    }

    return result
