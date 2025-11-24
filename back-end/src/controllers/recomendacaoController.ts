// recomendacaoController.ts
import { Request, Response } from "express";
import { getPlaylistsByMood } from "../services/recomendacaoService";
import { getMoodInfo } from "../utils/moodMapping";
import Playlist from "../models/playlist";
import User from "../models/user";

export const recomendarPlaylist = async (req: Request, res: Response) => {
  try {
    const { emotion, userId } = req.body;

    if (!emotion || !userId) {
      return res.status(400).json({ error: "Campos 'emotion' e 'userId' são obrigatórios" });
    }

    // validar usuario antes
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const moodInfo = getMoodInfo(emotion);

    // buscar playlist
    const playlists = await getPlaylistsByMood(moodInfo.spotifyQuery);

    const saved = await Playlist.create({
      userId,
      userName: user.name || "Usuário",
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
      .sort({ createdAt: -1 })
      .lean();

    if (!playlist) {
      return res.status(404).json({ error: "Nenhuma playlist encontrada" });
    }

    // Garantir que userName exista
    playlist.userName = playlist.userName || "Usuário";

    res.status(200).json(playlist);

  } catch (error) {
    console.error("Erro ao buscar última playlist:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
