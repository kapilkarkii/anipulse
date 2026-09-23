import { useState } from "react";
import { getInitials, getReleaseDetails, STATUS_LABELS } from "../utils/anime";
import { Icon } from "./Icon";

export function AnimeCard({ anime, now, onChangeEpisode, onRemove }) {
  const [imageFailed, setImageFailed] = useState(false);
  const progress = Math.min(100, Math.round((anime.currentEpisode / anime.totalEpisodes) * 100));
  const release = getReleaseDetails(anime.nextRelease, now);
  const completed = anime.currentEpisode >= anime.totalEpisodes;

  return (
    <article className="anime-card" style={{ "--accent": anime.color || "#ff6b43" }}>
      <div className="poster">
        <div className="poster-fallback" aria-hidden="true"><span>{getInitials(anime.title)}</span></div>
        {anime.image && !imageFailed && (
          <img
            src={anime.image}
            alt={`${anime.title} poster`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className={`status-badge status-${anime.status}`}><span/>{STATUS_LABELS[anime.status]}</span>
        <button className="delete-button" type="button" aria-label={`Remove ${anime.title}`} onClick={() => onRemove(anime.id)}><Icon name="close" size={16}/></button>
        {anime.score && <span className="poster-score"><Icon name="star" size={13}/>{anime.score}</span>}
      </div>

      <div className="card-content">
        <h3 title={anime.title}>{anime.title}</h3>
        <p className="anime-meta">
          {[anime.format || "Anime", anime.year, `${anime.totalEpisodes} episodes`].filter(Boolean).join(" · ")}
        </p>
        <div className="episode-line">
          <span><strong>{anime.currentEpisode}</strong> / {anime.totalEpisodes} episodes</span>
          <span className="episode-percent">{progress}%</span>
        </div>
        <div className="progress-track" aria-label={`${progress}% complete`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="release-row">
          <Icon name={completed ? "check" : "clock"} size={14}/>
          <span className="release-copy">
            {completed ? "All caught up. What a journey." : anime.nextRelease ? <><strong>{release.short}</strong> · {release.long}</> : "At your own pace"}
          </span>
        </div>
        <div className="card-actions">
          <button
            className="episode-button"
            type="button"
            aria-label={`Decrease ${anime.title} episode`}
            disabled={anime.currentEpisode <= 0}
            onClick={() => onChangeEpisode(anime.id, -1)}
          ><Icon name="minus" size={16}/></button>
          <button
            className="continue-button"
            type="button"
            disabled={completed}
            onClick={() => onChangeEpisode(anime.id, 1)}
          ><Icon name="check" size={15}/>{completed ? "Finished" : "Episode watched"}</button>
          <button
            className="episode-button"
            type="button"
            aria-label={`Increase ${anime.title} episode`}
            disabled={completed}
            onClick={() => onChangeEpisode(anime.id, 1)}
          ><Icon name="plus" size={16}/></button>
        </div>
      </div>
    </article>
  );
}
