export function Header({ notificationsEnabled, onEnableNotifications, onAddAnime }) {
  return (
    <header className="topbar">
      <a className="brand" href="#" aria-label="AniPulse home">
        <span className="brand-mark" aria-hidden="true">A</span>
        <span>AniPulse</span>
      </a>

      <div className="top-actions">
        <button className="button button-ghost" type="button" onClick={onEnableNotifications}>
          <span aria-hidden="true">{notificationsEnabled ? "✓" : "◉"}</span>{" "}
          {notificationsEnabled ? "Alerts enabled" : "Enable alerts"}
        </button>
        <button className="button button-primary" type="button" onClick={onAddAnime}>
          <span aria-hidden="true">＋</span> Add anime
        </button>
      </div>
    </header>
  );
}
