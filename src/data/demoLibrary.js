const futureDate = (days, hours = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours, 0, 0, 0);
  return date.toISOString();
};

export const demoLibrary = [
  {
    id: crypto.randomUUID(),
    title: "Frieren: Beyond Journey's End",
    status: "watching",
    currentEpisode: 18,
    totalEpisodes: 28,
    nextRelease: futureDate(2, 4),
    image: "",
    color: "#8f73ff"
  },
  {
    id: crypto.randomUUID(),
    title: "Solo Leveling",
    status: "watching",
    currentEpisode: 7,
    totalEpisodes: 12,
    nextRelease: futureDate(0, 8),
    image: "",
    color: "#2ec5ce"
  },
  {
    id: crypto.randomUUID(),
    title: "Attack on Titan",
    status: "completed",
    currentEpisode: 87,
    totalEpisodes: 87,
    nextRelease: "",
    image: "",
    color: "#ff6b43"
  }
];
