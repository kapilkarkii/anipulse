const API_URL = "https://api.jikan.moe/v4";
const KITSU_API_URL = "https://kitsu.io/api/edge";
const CACHE_PREFIX = "anipulse-search:";
const CACHE_TTL = 24 * 60 * 60 * 1000;

function readCache(query) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(`${CACHE_PREFIX}${query}`));
    return cached && Date.now() - cached.createdAt < CACHE_TTL ? cached.data : null;
  } catch {
    return null;
  }
}

function writeCache(query, data) {
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${query}`, JSON.stringify({ createdAt: Date.now(), data }));
  } catch {
    // Search still works when storage is unavailable.
  }
}

function normalizeAnime(anime) {
  return {
    malId: anime.mal_id,
    title: anime.title_english || anime.title,
    originalTitle: anime.title,
    image: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || "",
    totalEpisodes: anime.episodes || 12,
    year: anime.year || anime.aired?.prop?.from?.year || null,
    format: anime.type || "Anime",
    score: anime.score || null,
    airing: Boolean(anime.airing)
  };
}

function normalizeKitsuAnime(entry) {
  const anime = entry.attributes;
  const rating = Number(anime.averageRating);
  return {
    malId: `kitsu-${entry.id}`,
    title: anime.titles?.en || anime.titles?.en_jp || anime.canonicalTitle,
    originalTitle: anime.canonicalTitle,
    image: anime.posterImage?.large || anime.posterImage?.original || anime.posterImage?.medium || "",
    totalEpisodes: anime.episodeCount || 12,
    year: anime.startDate ? Number(anime.startDate.slice(0, 4)) : null,
    format: anime.subtype ? anime.subtype.toUpperCase() : "Anime",
    score: Number.isFinite(rating) ? Number((rating / 10).toFixed(2)) : null,
    airing: anime.status === "current"
  };
}

async function searchKitsu(query, signal) {
  const params = new URLSearchParams({
    "filter[text]": query.trim(),
    "page[limit]": "8"
  });
  const response = await fetch(`${KITSU_API_URL}/anime?${params}`, {
    signal,
    headers: { Accept: "application/vnd.api+json" }
  });
  if (!response.ok) throw new Error("Kitsu catalog request failed.");
  const payload = await response.json();
  return (payload.data || []).map(normalizeKitsuAnime);
}

async function searchJikan(query, signal) {
  const params = new URLSearchParams({
    q: query.trim(),
    limit: "8",
    sfw: "true",
    order_by: "popularity",
    sort: "asc"
  });
  const response = await fetch(`${API_URL}/anime?${params}`, { signal });
  if (!response.ok) throw new Error("Jikan catalog request failed.");
  const payload = await response.json();
  return (payload.data || []).map(normalizeAnime);
}

export async function searchAnime(query, signal) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 2) return [];

  const cached = readCache(normalizedQuery);
  if (cached) return cached;

  let results;
  try {
    results = await searchKitsu(query, signal);
  } catch (kitsuError) {
    if (kitsuError.name === "AbortError") throw kitsuError;
    try {
      results = await searchJikan(query, signal);
    } catch (jikanError) {
      if (jikanError.name === "AbortError") throw jikanError;
      throw new Error("Anime search is temporarily unavailable.");
    }
  }

  writeCache(normalizedQuery, results);
  return results;
}
