export const moodMapping: Record<
  string,
  { label: string; emoji: string; spotifyQuery: string }
> = {
  joy: {
    label: "Feliz",
    emoji: "😊",
    spotifyQuery: "mood happy uplifting pop upbeat good vibes -birthday"
  },
  sadness: {
    label: "Triste",
    emoji: "😢",
    spotifyQuery: "mood sad melancholic acoustic soft emotional rainy day"
  },
  anger: {
    label: "Irritado",
    emoji: "😠",
    spotifyQuery: "rock aggressive metal angry workout intense"
  },
  surprise: {
    label: "Surpreso",
    emoji: "😲",
    spotifyQuery: "trending discovery new music explore"
  },
  neutral: {
    label: "Neutro",
    emoji: "😐",
    spotifyQuery: "focus chill lofi study relax"
  },
  fear: {
    label: "Assustado",
    emoji: "😨",
    spotifyQuery: "dark ambient cinematic thriller soundtrack tense"
  },
  disgust: {
    label: "Enojado",
    emoji: "🤢",
    spotifyQuery: "punk alternative indie edgy raw"
  }
};

export function getMoodInfo(emotion: string) {
  const key = emotion.toLowerCase();
  return moodMapping[key] || {
    label: "Desconhecido",
    emoji: "❓",
    spotifyQuery: "chill"
  };
}
