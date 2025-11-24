import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

import userRoutes from "./routes/userRoutes";
import spotifyRoutes from "./routes/spotifyRoutes";
import recomendacaoRoutes from "./routes/recomendacaoRoutes";
import { analyzeEmotion } from "./services/PythonAIService";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 📌 Caminho CORRETO: src/uploads
const uploadsPath = path.join(__dirname, "uploads");

// Criar pasta uploads se não existir
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Servir os arquivos estáticos (fotos)
app.use("/uploads", express.static(uploadsPath));

// 📸 Configuração Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 📌 MongoDB
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI!)
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// =======================
//        ROTAS
// =======================

// Teste básico
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// Teste da IA
app.post("/test-ai", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "O campo 'text' é obrigatório" });
  }

  try {
    const result = await analyzeEmotion(text);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Erro desconhecido" });
  }
});

// Upload da foto de perfil
app.post("/upload-profile", upload.single("profile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  // URL final da imagem
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({ url: imageUrl });
});

// Rotas principais
app.use("/api/users", userRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/recomendacao", recomendacaoRoutes);

// Start
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
