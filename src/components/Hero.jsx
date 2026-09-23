import { useState } from "react";
import { Icon } from "./Icon";

export function Hero({ anime, onChangeEpisode, onAddAnime }) {
  const [failedImage, setFailedImage] = useState("");
  const progress = anime ? Math.min(100, Math.round(anime.currentEpisode / anime.totalEpisodes * 100)) : 0;
  return (
    <section className="feature" aria-label="Continue your watchlist">
      <div className="feature-copy">
        <p className="feature-kicker"><span/> {anime ? "BACK TO YOUR STORY" : "YOUR NEXT CHAPTER"}</p>
        <h2>{anime ? anime.title : "A little escape.\nA whole new world."}</h2>
        <p className="feature-meta">{anime ? [anime.format || "Anime", anime.year, `${anime.totalEpisodes} episodes`].filter(Boolean).join("  /  ") : "Every great watchlist starts with one anime."}</p>
        <div className="feature-bottom">
          {anime && <div className="feature-progress"><div><span>Episode <strong>{anime.currentEpisode}</strong> of {anime.totalEpisodes}</span><span>{progress}%</span></div><div className="progress-track"><span style={{ width: `${progress}%` }}/></div></div>}
          <button className="button feature-button" onClick={() => anime ? onChangeEpisode(anime.id, 1) : onAddAnime()}><Icon name={anime ? "check" : "plus"} size={18}/>{anime ? `Mark episode ${anime.currentEpisode + 1} watched` : "Find your first anime"}<Icon name="arrow" size={18}/></button>
        </div>
      </div>
      <div className="feature-art">
        {anime?.image && failedImage !== anime.image ? <img src={anime.image} alt={`${anime.title} artwork`} onError={() => setFailedImage(anime.image)} fetchPriority="high"/> : <div className="feature-art-empty"><Icon name="play" size={90}/></div>}
        <span className="feature-art-caption">{anime ? "ON YOUR WATCHLIST" : "MAKE IT YOURS"}</span>
      </div>
    </section>
  );
}
