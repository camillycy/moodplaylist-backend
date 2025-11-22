import axios from "axios";

const PYTHON_API_URL = "http://localhost:8000/analyze";

export async function analyzeEmotion(text: string) {
  try {
    const response = await axios.post(PYTHON_API_URL, { text });
    console.log("🎯 Resposta da IA Python:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao se conectar com a IA Python:", error.message);
    if (error.response) console.error("🔍 Detalhes:", error.response.data);
    throw new Error("Falha ao comunicar com o serviço de IA Python");
  }
}
