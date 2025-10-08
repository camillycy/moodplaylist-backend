import axios from "axios";

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions";

export async function analyzeEmotion(text: string) {
  try {
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Obter apenas a emoção com maior score
    const predictions = response.data[0]; // primeiro array
    const topPrediction = predictions.reduce((prev: any, current: any) => 
      current.score > prev.score ? current : prev
    );

    console.log("Emoção predominante:", topPrediction);
    return topPrediction; // { label: "neutral", score: 0.919 }
  } catch (error: any) {
    console.error("❌ Erro Axios:", error.message);
    console.error("❌ Response completo:", error.response);
    console.error("❌ Config Axios:", error.config);
    return { error: "Erro real: veja console" };
  }
  
}