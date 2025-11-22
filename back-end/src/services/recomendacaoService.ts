import axios from "axios";
import qs from "qs";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SEARCH_URL = "https://api.spotify.com/v1/search";

// Cache do token
let cachedToken: { token: string; expiresAt: number } | null = null;

// Função para pegar Token válido
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify Client ID/Secret não configurados no .env");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await axios.post(
    TOKEN_URL,
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const token = res.data.access_token;
  const expires = res.data.expires_in * 1000;

  cachedToken = {
    token,
    expiresAt: Date.now() + expires - 60 * 1000,
  };

  return token;
}

/**
 * Buscar playlists por humor
 */
export async function getPlaylistsByMood(query: string) {
  const token = await getAccessToken();

  const res = await axios.get(SEARCH_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      q: query,
      type: "playlist",
      limit: 1, // você pediu APENAS UMA playlist
    },
  });

  return res.data.playlists.items.map((p: any) => ({
    name: p.name,
    description: p.description,
    image: p.images[0]?.url || null,
    url: p.external_urls.spotify,
    id: p.id,
  }));
}
