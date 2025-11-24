import { Request, Response } from "express";
import Playlist from "../models/playlist";

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { userId, mood, type, recommendations } = req.body;

    if (!userId || !mood || !type || !recommendations)
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });

    const newPlaylist = await Playlist.create({
      userId,
      mood,
      type,
      recommendations,
    });

    // retorna o objeto completo pro front redirecionar com base no ID
    res.status(201).json({
      message: "Playlist criada com sucesso!",
      playlist: newPlaylist,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar playlist" });
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ error: "Playlist não encontrada" });

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar playlist" });
  }
};

export const getUserPlaylists = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const playlists = await Playlist.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
};
