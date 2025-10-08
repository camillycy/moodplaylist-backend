import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { analyzeEmotion } from "./services/AIService.ts";

dotenv.config();

const app = express(); // não precisa tipar como Express
app.use(express.json());

const PORT: number | string = process.env.PORT || 3000;

// --- MongoDB ---
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI não definido no .env");
  process.exit(1);
}

console.log("🔹 Tentando conectar ao MongoDB...");
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch(err => {
    console.error("❌ Erro ao conectar MongoDB:", err);
    process.exit(1);
  });

// --- Rotas ---
app.get("/", (req, res) => {
  res.send("Mood Playlist API rodando 🚀");
});

app.post("/test-ai", async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "O campo 'text' é obrigatório" });

  try {
    const result = await analyzeEmotion(text);
    res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
    else res.status(500).json({ error: "Erro desconhecido" });
  }
});

// --- Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
