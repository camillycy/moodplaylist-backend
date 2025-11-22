// back-end/src/utils/moodQueries.ts
export type IntensityTier = "low" | "mid" | "high";

/**
 * Para cada mood nós definimos 3 buckets de query:
 * - low: leve (ex.: "triste" sem intensidade)
 * - mid: moderado
 * - high: muito intenso
 *
 * As queries são frases para a busca de playlists (q param do Spotify Search).
 */
export const moodQueries: Record<string, Record<IntensityTier, string[]>> = {
  joy: {
    low: [
      "happy vibes pop upbeat",
      "feel good playlist easy listening",
      "sunny day pop chill"
    ],
    mid: [
      "upbeat pop dance party hits",
      "feel good anthems upbeat",
      "happy indie pop energetic"
    ],
    high: [
      "euphoric pop high energy party anthems",
      "feel good hits massive sing along",
      "dancefloor bangers upbeat"
    ],
  },
  sadness: {
    low: [
      "soft melancholic acoustic mellow",
      "sad but calming acoustic",
      "melancholy indie soft"
    ],
    mid: [
      "emotional ballads deep sad songs",
      "sad songs heartbreak slow acoustic",
      "melancholic piano vocal"
    ],
    high: [
      "raw sad songs crying deep emotional",
      "depression melancholic dark acoustic",
      "heartbreak grief emotional"
    ],
  },
  anger: {
    low: ["grungy rock edgy alt rock", "angry indie rock"],
    mid: ["hard rock aggressive intense", "metal energetic rage"],
    high: ["metal hardcore rage pit", "extreme metal aggressive intense"]
  },
  fear: {
    low: ["ambient chill tension", "mysterious cinematic ambient"],
    mid: ["dark ambient cinematic suspense", "tense soundtrack dramatic"],
    high: ["horror soundtrack intense dark", "very suspenseful cinematic"]
  },
  surprise: {
    low: ["quirky indie eclectic", "surprising indie pop"],
    mid: ["experimental electronic upbeat", "eclectic hits mix"],
    high: ["high energy eclectic party unexpected"]
  },
  disgust: {
    low: ["gritty punk indie alternative"],
    mid: ["punk hardcore aggressive"],
    high: ["hardcore punk extreme"]
  },
  neutral: {
    low: ["chill vibes mellow playlist", "lofi chill study beats"],
    mid: ["popular hits mix top 40", "best of pop mix"],
    high: ["party hits dance anthems"]
  }
};

export function selectTier(intensity: number): IntensityTier {
  if (intensity >= 0.8) return "high";
  if (intensity >= 0.45) return "mid";
  return "low";
}
