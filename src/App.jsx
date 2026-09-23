import { useEffect, useMemo, useRef, useState } from "react";
import { searchAnime } from "./api/jikan";
import { AnimeCard } from "./components/AnimeCard";
import { AnimeDialog } from "./components/AnimeDialog";
import { EmptyState } from "./components/EmptyState";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LibraryControls } from "./components/LibraryControls";
import { StatsGrid } from "./components/StatsGrid";
import { demoLibrary } from "./data/demoLibrary";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getReleaseDetails } from "./utils/anime";

const STORAGE_KEY = "anipulse-library-v1";

export default function App() {
  const [library, setLibrary] = useLocalStorage(STORAGE_KEY, demoLibrary);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [now, setNow] = useState(Date.now());
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => "Notification" in window && Notification.permission === "granted"
  );
  const imageMigrationStarted = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (imageMigrationStarted.current) return;
    const missingImages = library.filter((anime) => !anime.image).slice(0, 12);
    if (missingImages.length === 0) return;
    imageMigrationStarted.current = true;

    const hydrateImages = async () => {
      for (const anime of missingImages) {
        try {
          const [match] = await searchAnime(anime.title);
          if (match) {
            setLibrary((current) => current.map((item) => (
              item.id === anime.id ? { ...item, ...match, title: item.title } : item
            )));
          }
        } catch {
          // Keep the local fallback if the public catalog is temporarily unavailable.
        }
        await new Promise((resolve) => window.setTimeout(resolve, 450));
      }
    };

    hydrateImages();
  }, [library, setLibrary]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const counts = useMemo(() => ({
    all: library.length,
    watching: library.filter((anime) => anime.status === "watching").length,
    completed: library.filter((anime) => anime.status === "completed").length,
    planned: library.filter((anime) => anime.status === "planned").length,
    paused: library.filter((anime) => anime.status === "paused").length
  }), [library]);

  const stats = useMemo(() => {
    const episodes = library.reduce((total, anime) => total + Number(anime.currentEpisode), 0);
    const nextRelease = library
      .map((anime) => getReleaseDetails(anime.nextRelease, now))
      .filter((release) => release.milliseconds > 0)
      .sort((a, b) => a.milliseconds - b.milliseconds)[0];

    return {
      watching: counts.watching,
      completed: counts.completed,
      episodes,
      nextDrop: nextRelease?.short || "—"
    };
  }, [counts, library, now]);

  const visibleAnime = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return library.filter((anime) => {
      const matchesFilter = activeFilter === "all" || anime.status === activeFilter;
      return matchesFilter && anime.title.toLowerCase().includes(query);
    });
  }, [activeFilter, library, searchTerm]);

  const existingTitles = useMemo(
    () => new Set(library.map((anime) => anime.title.toLowerCase())),
    [library]
  );

  const updateEpisode = (id, amount) => {
    const selectedAnime = library.find((anime) => anime.id === id);
    if (!selectedAnime) return;
    const updatedEpisode = Math.max(
      0,
      Math.min(selectedAnime.totalEpisodes, selectedAnime.currentEpisode + amount)
    );

    setLibrary((current) => current.map((anime) => {
      if (anime.id !== id) return anime;
      return {
        ...anime,
        currentEpisode: updatedEpisode,
        status: updatedEpisode === anime.totalEpisodes
          ? "completed"
          : amount > 0 && anime.status !== "watching" ? "watching" : anime.status
      };
    }));
    setToast(amount > 0 ? `Episode ${updatedEpisode} marked watched` : `Progress moved back to episode ${updatedEpisode}`);
  };

  const removeAnime = (id) => {
    const anime = library.find((item) => item.id === id);
    if (!anime || !window.confirm(`Remove “${anime.title}” from your library?`)) return;
    setLibrary((current) => current.filter((item) => item.id !== id));
    setToast(`${anime.title} removed`);
  };

  const addAnime = (anime) => {
    setLibrary((current) => [anime, ...current]);
    setActiveFilter("all");
    setDialogOpen(false);
    setToast(`${anime.title} added to your library`);
  };

  const notifyUpcomingRelease = () => {
    const upcoming = library.find((anime) => {
      const milliseconds = getReleaseDetails(anime.nextRelease).milliseconds;
      return milliseconds > 0 && milliseconds <= 24 * 3_600_000;
    });
    if (!upcoming) return;
    new Notification(`${upcoming.title} airs soon`, {
      body: getReleaseDetails(upcoming.nextRelease).long,
      icon: `${import.meta.env.BASE_URL}favicon.svg`
    });
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      setToast("Notifications are not supported in this browser");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setToast("Notification permission was not enabled");
      return;
    }
    setNotificationsEnabled(true);
    setToast("Release alerts are enabled on this device");
    notifyUpcomingRelease();
  };

  return (
    <>
      <Header
        notificationsEnabled={notificationsEnabled}
        onEnableNotifications={enableNotifications}
        onAddAnime={() => setDialogOpen(true)}
      />

      <main className="shell">
        <Hero />
        <StatsGrid stats={stats} />

        <section className="library-section">
          <LibraryControls
            activeFilter={activeFilter}
            counts={counts}
            searchTerm={searchTerm}
            onFilterChange={setActiveFilter}
            onSearchChange={setSearchTerm}
          />

          {visibleAnime.length > 0 ? (
            <div className="anime-grid">
              {visibleAnime.map((anime) => (
                <AnimeCard
                  anime={anime}
                  now={now}
                  onChangeEpisode={updateEpisode}
                  onRemove={removeAnime}
                  key={anime.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState onAddAnime={() => setDialogOpen(true)} />
          )}
        </section>

        <footer className="site-footer">
          <span>© 2026 AniPulse</span>
          <span>Catalog data via <a href="https://kitsu.io" target="_blank" rel="noreferrer">Kitsu</a> and <a href="https://jikan.moe" target="_blank" rel="noreferrer">Jikan</a>.</span>
        </footer>
      </main>

      {dialogOpen && (
        <AnimeDialog
          existingTitles={existingTitles}
          onAdd={addAnime}
          onClose={() => setDialogOpen(false)}
        />
      )}

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
