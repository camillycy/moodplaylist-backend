import express from "express";
import type { Request, Response, Express } from "express";
import dotenv from "dotenv";
import { analyzeEmotion } from "./services/AIService.ts";

dotenv.config();

const app: Express = express();
app.use(express.json());

const PORT: number | string = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Mood Playlist API rodando 🚀");
});

app.post("/test-ai", async (req: Request, res: Response) => {
  const { text } = req.body;

  try {
    const result = await analyzeEmotion(text);
    res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Erro desconhecido" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na portag ${PORT}`);
});