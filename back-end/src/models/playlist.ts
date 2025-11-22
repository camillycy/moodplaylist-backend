// src/models/playlist.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRecommendation {
  name: string;
  artist?: string;
  image?: string;
  url: string;
  spotifyId?: string;
}

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  mood: string;
  type: "playlist" | "music";
  recommendations: IRecommendation[];
  createdAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, required: true },
  type: { type: String, enum: ["playlist", "music"], required: true },
  recommendations: [
    {
      name: { type: String, required: true },
      artist: String,
      image: String,
      url: { type: String, required: true },
      spotifyId: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
