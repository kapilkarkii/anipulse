import { Icon } from "./Icon";

export function Header({ notificationsEnabled, onEnableNotifications, onAddAnime }) {
  return (
    <header className="topbar">
      <a className="header-breadcrumb" href="#"><span className="mobile-brand">anipulse</span><span className="desktop-label">Your space</span><span className="desktop-label">/</span><strong>Library</strong></a>

      <div className="top-actions">
        <button className="button button-ghost" type="button" onClick={onEnableNotifications}>
          <Icon name={notificationsEnabled ? "check" : "bell"} size={17}/>
          {notificationsEnabled ? "Alerts enabled" : "Enable alerts"}
        </button>
        <button className="button button-primary" type="button" onClick={onAddAnime}>
          <Icon name="plus" size={17}/> Add anime
        </button>
      </div>
    </header>
  );
}
