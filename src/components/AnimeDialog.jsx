import { useEffect, useRef, useState } from "react";

const COLORS = ["#ff6b43", "#8f73ff", "#2ec5ce", "#ff5c8a", "#e6b94c"];
const COLOR_NAMES = ["Orange", "Purple", "Cyan", "Pink", "Gold"];

export function AnimeDialog({ existingTitles, onAdd, onClose }) {
  const dialogRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title").trim();
    const totalEpisodes = Number(form.get("totalEpisodes"));
    const currentEpisode = Number(form.get("currentEpisode"));

    if (currentEpisode > totalEpisodes) {
      setError("Episode reached cannot be greater than total episodes.");
      return;
    }
    if (existingTitles.has(title.toLowerCase())) {
      setError("That anime is already in your library.");
      return;
    }

    const rawRelease = form.get("nextRelease");
    onAdd({
      id: crypto.randomUUID(),
      title,
      status: currentEpisode === totalEpisodes ? "completed" : form.get("status"),
      currentEpisode,
      totalEpisodes,
      nextRelease: rawRelease ? new Date(rawRelease).toISOString() : "",
      image: form.get("image").trim(),
      color: form.get("color")
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
          <div><p className="eyebrow">NEW TO YOUR LIST</p><h2>Add anime</h2></div>
          <button className="icon-button" type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>

        <label>Anime title<input name="title" required maxLength="80" placeholder="e.g. Frieren" autoFocus /></label>
        <div className="form-row">
          <label>Status
            <select name="status" defaultValue="watching">
              <option value="watching">Watching</option>
              <option value="planned">Planned</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label>Total episodes<input name="totalEpisodes" type="number" min="1" max="5000" defaultValue="12" required /></label>
        </div>
        <div className="form-row">
          <label>Episode reached<input name="currentEpisode" type="number" min="0" max="5000" defaultValue="0" required /></label>
          <label>Next release<input name="nextRelease" type="datetime-local" /></label>
        </div>
        <label>Poster URL <span className="optional">optional</span><input name="image" type="url" placeholder="https://…" /></label>
        <label>Accent color
          <div className="color-options">
            {COLORS.map((color, index) => (
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={index === 0}
                aria-label={COLOR_NAMES[index]}
                key={color}
              />
            ))}
          </div>
        </label>
        <p className="form-error" role="alert">{error}</p>
        <div className="modal-actions">
          <button className="button button-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="button button-primary" type="submit">Add to library</button>
        </div>
      </form>
    </dialog>
  );
}
