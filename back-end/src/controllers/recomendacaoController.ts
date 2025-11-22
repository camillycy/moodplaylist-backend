import { Request, Response } from "express";
import { getPlaylistsByMood } from "../services/recomendacaoService";
import { getMoodInfo } from "../utils/moodMapping";
import Playlist from "../models/playlist";

export const recomendarPlaylist = async (req: Request, res: Response) => {
  try {
    const { emotion, userId } = req.body;

    if (!emotion || !userId) {
      return res.status(400).json({ error: "Campos 'emotion' e 'userId' são obrigatórios" });
    }

    const moodInfo = getMoodInfo(emotion);

    // Use a query do Spotify — não o label!
    const playlists = await getPlaylistsByMood(moodInfo.spotifyQuery);

    const saved = await Playlist.create({
      userId,
      mood: moodInfo.label,
      type: "playlist",
      recommendations: playlists
    });

    return res.status(200).json({
      message: "Playlist recomendada e salva com sucesso!",
      playlist: saved
    });

  } catch (error) {
    console.error("❌ Erro na recomendação:", error);
    res.status(500).json({ error: "Erro ao gerar recomendação" });
  }
};


export const ultimaPlaylist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const playlist = await Playlist.findOne({ userId })
      .sort({ createdAt: -1 }) // pega a mais recente
      .lean();

    if (!playlist) {
      return res.status(404).json({ error: "Nenhuma playlist encontrada" });
    }

    res.status(200).json(playlist);

  } catch (error) {
    console.error("Erro ao buscar última playlist:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
