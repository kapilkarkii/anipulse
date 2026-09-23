import { useState } from "react";
import { getInitials, getReleaseDetails, STATUS_LABELS } from "../utils/anime";

export function AnimeCard({ anime, now, onChangeEpisode, onRemove }) {
  const [imageFailed, setImageFailed] = useState(false);
  const progress = Math.min(100, Math.round((anime.currentEpisode / anime.totalEpisodes) * 100));
  const release = getReleaseDetails(anime.nextRelease, now);
  const completed = anime.currentEpisode >= anime.totalEpisodes;

  return (
    <article className="anime-card" style={{ "--accent": anime.color || "#ff6b43" }}>
      <div className="poster">
        <div className="poster-fallback"><span>{getInitials(anime.title)}</span></div>
        {anime.image && !imageFailed && (
          <img
            src={anime.image}
            alt={`${anime.title} poster`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="status-badge">{STATUS_LABELS[anime.status]}</span>
        <button className="delete-button" type="button" aria-label={`Remove ${anime.title}`} onClick={() => onRemove(anime.id)}>×</button>
      </div>

      <div className="card-content">
        <h3 title={anime.title}>{anime.title}</h3>
        <div className="episode-line">
          <span>Episode {anime.currentEpisode} of {anime.totalEpisodes}</span>
          <span className="episode-percent">{progress}%</span>
        </div>
        <div className="progress-track" aria-label={`${progress}% complete`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="release-row">
          <span className="release-icon">◷</span>
          <span className="release-copy">
            {anime.nextRelease ? <><strong>{release.short}</strong> · {release.long}</> : release.long}
          </span>
        </div>
        <div className="card-actions">
          <button
            className="episode-button"
            type="button"
            aria-label={`Decrease ${anime.title} episode`}
            disabled={anime.currentEpisode <= 0}
            onClick={() => onChangeEpisode(anime.id, -1)}
          >−</button>
          <button
            className="continue-button"
            type="button"
            disabled={completed}
            onClick={() => onChangeEpisode(anime.id, 1)}
          >{completed ? "Completed" : "Mark next episode"}</button>
          <button
            className="episode-button"
            type="button"
            aria-label={`Increase ${anime.title} episode`}
            disabled={completed}
            onClick={() => onChangeEpisode(anime.id, 1)}
          >＋</button>
        </div>
      </div>
    </article>
  );
}
