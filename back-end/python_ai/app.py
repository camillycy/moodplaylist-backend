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

def preprocess_text(text: str) -> str:
    text = re.sub(r'(.)\1{2,}', r'\1', text)

    text = re.sub(r'[^\w\s,!?]', '', text)

    translated = GoogleTranslator(source='pt', target='en').translate(text)

    return translated

@app.post("/analyze")
async def analyze_emotion(request: TextRequest):
    preprocessed_text = preprocess_text(request.text)

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