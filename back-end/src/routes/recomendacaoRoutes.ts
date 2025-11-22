import express from "express";
import { recomendarPlaylist } from "../controllers/recomendacaoController";
import Playlist from "../models/playlist";

const router = express.Router();

router.post("/", recomendarPlaylist);

router.get("/ultima/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const playlist = await Playlist.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!playlist) {
      return res.status(404).json({ error: "Nenhuma playlist encontrada" });
    }

    return res.json(playlist);

  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar playlist" });
  }
});

export default router;
