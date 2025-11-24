import { Request, Response } from "express";
import Playlist from "../models/playlist";
import { searchPlaylists } from "../services/spotifyService";
import { analyzeEmotion } from "../services/PythonAIService";

export const generateFromMood = async (req: Request, res: Response) => {
  try {
    const { mood, type = "playlist", userId } = req.body;
    if (!mood)
      return res.status(400).json({ error: "Campo 'mood' obrigatório" });

    const ai = await analyzeEmotion(mood);
    const query = `${ai.style} ${ai.emotion} ${ai.energy} brazil`;

    const playlists = await searchPlaylists(query, 1);
    if (!playlists.length)
      return res.status(404).json({ error: "Nenhuma playlist encontrada" });

    const recommended = playlists[0];

    if (userId) {
      const saved = await Playlist.create({
        userId,
        mood,
        type,
        playlists: [recommended],
      });
      return res.json({
        message: "Playlist gerada e salva com sucesso!",
        playlist: saved,
      });
    }

    return res.json({
      message: "Playlist gerada com sucesso!",
      mood,
      type,
      playlists: [recommended],
    });
  } catch (err) {
    console.error("Erro ao gerar playlist:", err);
    res.status(500).json({ error: "Erro interno ao gerar playlist" });
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ error: "Playlist não encontrada" });
    res.json(playlist);
  } catch (err) {
    console.error("Erro ao buscar playlist:", err);
    res.status(500).json({ error: "Erro ao buscar playlist" });
  }
};

export const getLastPlaylists = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const playlists = await Playlist.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);
    res.json({ message: "Últimas playlists encontradas", playlists });
  } catch (err) {
    console.error("Erro ao buscar últimas playlists:", err);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
};
  