import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SEARCH_URL = "https://api.spotify.com/v1/search";

let cachedToken: { token: string; expiresAt: number } | null = null;

/** 🔹 Pega token de acesso válido */
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret)
    throw new Error("Spotify client id/secret não definidos");

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await axios.post(
    TOKEN_URL,
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const token = res.data.access_token as string;
  const expires = res.data.expires_in as number;
  cachedToken = { token, expiresAt: Date.now() + (expires - 60) * 1000 };

  return token;
}

/** 🔹 Busca faixas (músicas) */
export async function searchTracks(query: string, limit = 5) {
  const token = await getAccessToken();

  const res = await axios.get(SEARCH_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "track", limit },
  });

  return res.data.tracks.items.map((t: any) => ({
    name: t.name,
    artist: t.artists.map((a: any) => a.name).join(", "),
    image: t.album.images[0]?.url || null,
    url: t.external_urls.spotify,
    spotifyId: t.id,
  }));
}

/** 🔹 Busca playlists */
export async function searchPlaylists(query: string, limit = 5) {
  const token = await getAccessToken();

  const res = await axios.get(SEARCH_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "playlist", limit },
  });

  return res.data.playlists.items.map((p: any) => ({
    name: p.name,
    image: p.images[0]?.url || null,
    url: p.external_urls.spotify,
    spotifyId: p.id,
  }));
}
