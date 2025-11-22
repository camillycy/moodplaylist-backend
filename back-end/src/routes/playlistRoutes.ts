import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
} from "../controllers/playlistController";

const router = express.Router();

router.post("/", createPlaylist);
router.get("/history/:userId", getUserPlaylists);
router.get("/:id", getPlaylistById);

export default router;
