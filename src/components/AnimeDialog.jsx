import { useEffect, useRef, useState } from "react";
import { useAnimeSearch } from "../hooks/useAnimeSearch";

const COLORS = ["#7c6cff", "#4f8cff", "#20b486", "#ef7b45", "#e05f8a"];

export function AnimeDialog({ existingTitles, onAdd, onClose }) {
  const dialogRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("watching");
  const [totalEpisodes, setTotalEpisodes] = useState(12);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [nextRelease, setNextRelease] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [formError, setFormError] = useState("");
  const { results, loading, error: searchError } = useAnimeSearch(query);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const chooseAnime = (anime) => {
    setSelected(anime);
    setQuery("");
    setTotalEpisodes(anime.totalEpisodes || 12);
    setCurrentEpisode(0);
    setStatus("watching");
    setFormError("");
  };

  const submit = (event) => {
    event.preventDefault();
    if (!selected) {
      setFormError("Search for and select an anime first.");
      return;
    }
    if (currentEpisode > totalEpisodes) {
      setFormError("Episode reached cannot be greater than total episodes.");
      return;
    }
    if (existingTitles.has(selected.title.toLowerCase())) {
      setFormError("That anime is already in your library.");
      return;
    }

    onAdd({
      ...selected,
      id: crypto.randomUUID(),
      status: currentEpisode === totalEpisodes ? "completed" : status,
      currentEpisode,
      totalEpisodes,
      nextRelease: nextRelease ? new Date(nextRelease).toISOString() : "",
      color
    });
  };

  return (
    <dialog
      className="modal"
      ref={dialogRef}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <form className="modal-card" onSubmit={submit}>
        <div className="modal-heading">
          <div>
            <p className="eyebrow">ADD TO LIBRARY</p>
            <h2>Find an anime</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>

        {!selected ? (
          <div className="catalog-search">
            <label className="catalog-search-input">
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by anime title"
                autoFocus
              />
            </label>

            <div className="search-feedback" aria-live="polite">
              {loading && "Searching the anime catalog…"}
              {!loading && query.trim().length < 2 && "Enter at least two characters to search."}
              {!loading && searchError && searchError}
            </div>

            {results.length > 0 && (
              <div className="catalog-results">
                {results.map((anime) => (
                  <button className="catalog-result" type="button" key={anime.malId} onClick={() => chooseAnime(anime)}>
                    <img src={anime.image} alt="" loading="lazy" />
                    <span className="catalog-result-copy">
                      <strong>{anime.title}</strong>
                      <span>{[anime.format, anime.year, anime.totalEpisodes ? `${anime.totalEpisodes} eps` : null].filter(Boolean).join(" · ")}</span>
                    </span>
                    {anime.score && <span className="catalog-score">★ {anime.score}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="selected-anime">
              <img src={selected.image} alt={`${selected.title} cover`} />
              <div>
                <span className="selected-label">Selected anime</span>
                <h3>{selected.title}</h3>
                <p>{[selected.format, selected.year, selected.score ? `★ ${selected.score}` : null].filter(Boolean).join(" · ")}</p>
              </div>
              <button className="text-button" type="button" onClick={() => setSelected(null)}>Change</button>
            </div>

            <div className="form-row">
              <label>Status
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="watching">Watching</option>
                  <option value="planned">Planned</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label>Total episodes
                <input type="number" min="1" max="5000" value={totalEpisodes} onChange={(event) => setTotalEpisodes(Number(event.target.value))} required />
              </label>
            </div>
            <div className="form-row">
              <label>Episode reached
                <input type="number" min="0" max="5000" value={currentEpisode} onChange={(event) => setCurrentEpisode(Number(event.target.value))} required />
              </label>
              <label>Next release <span className="optional">optional</span>
                <input type="datetime-local" value={nextRelease} onChange={(event) => setNextRelease(event.target.value)} />
              </label>
            </div>
            <label>Card accent
              <div className="color-options">
                {COLORS.map((option) => (
                  <input
                    type="radio"
                    name="color"
                    value={option}
                    checked={color === option}
                    onChange={() => setColor(option)}
                    aria-label={`Select ${option}`}
                    style={{ "--radio-color": option }}
                    key={option}
                  />
                ))}
              </div>
            </label>
          </>
        )}

        <p className="form-error" role="alert">{formError}</p>
        <div className="modal-actions">
          <button className="button button-ghost" type="button" onClick={onClose}>Cancel</button>
          {selected && <button className="button button-primary" type="submit">Add to library</button>}
        </div>
      </form>
    </dialog>
  );
}
