const futureDate = (days, hours = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours, 0, 0, 0);
  return date.toISOString();
};

export const demoLibrary = [
  {
    id: crypto.randomUUID(),
    malId: 52991,
    title: "Frieren: Beyond Journey's End",
    status: "watching",
    currentEpisode: 18,
    totalEpisodes: 28,
    nextRelease: futureDate(2, 4),
    image: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
    year: 2023,
    format: "TV",
    score: 9.26,
    color: "#8f73ff"
  },
  {
    id: crypto.randomUUID(),
    malId: 52299,
    title: "Solo Leveling",
    status: "watching",
    currentEpisode: 7,
    totalEpisodes: 12,
    nextRelease: futureDate(0, 8),
    image: "https://cdn.myanimelist.net/images/anime/1801/142390l.jpg",
    year: 2024,
    format: "TV",
    score: 8.15,
    color: "#2ec5ce"
  },
  {
    id: crypto.randomUUID(),
    malId: 16498,
    title: "Attack on Titan",
    status: "completed",
    currentEpisode: 87,
    totalEpisodes: 87,
    nextRelease: "",
    image: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    year: 2013,
    format: "TV",
    score: 8.56,
    color: "#ff6b43"
  }
];
