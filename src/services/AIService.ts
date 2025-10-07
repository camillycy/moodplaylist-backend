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

    console.log("✅ Sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro Axios:", error.message);
    console.error("❌ Response completo:", error.response);
    console.error("❌ Config Axios:", error.config);
    return { error: "Erro real: veja console" };
  }
}