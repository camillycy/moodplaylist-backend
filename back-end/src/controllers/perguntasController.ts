import { Request, Response } from "express";
import { analyzeEmotion } from "../services/PythonAIService";
import EmotionHistory from "../models/emotionHistory";

export const analisarResposta = async (req: Request, res: Response) => {
  try {
    const { userId, text } = req.body;

    if (!userId || !text)
      return res.status(400).json({ error: "userId e text são obrigatórios" });

    const aiResult = await analyzeEmotion(text);

    // Salva histórico de emoções
    await EmotionHistory.create({
      userId,
      text,
      emotion: aiResult.emotion,
      confidence: aiResult.confidence,
      date: new Date(),
    });

    res.json(aiResult);
  } catch (error) {
    console.error("❌ Erro na análise de emoção:", error);
    res.status(500).json({ error: "Erro ao processar emoção" });
  }
};
