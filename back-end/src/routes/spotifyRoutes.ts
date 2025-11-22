import express from "express";
import {
  generateFromMood,
  getPlaylistById,
  getLastPlaylists,
} from "../controllers/spotifyController";

const router = express.Router();

// 🔹 Gerar playlist baseada em humor/texto
router.post("/generate", generateFromMood);

// 🔹 Buscar playlist pelo ID (para playlist.html)
router.get("/:id", getPlaylistById);

// 🔹 Buscar últimas 3 playlists do usuário (para a home)
router.get("/history/:userId", getLastPlaylists);

export default router;
