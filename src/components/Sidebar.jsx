import { Icon } from "./Icon";

const items = [["all", "My collection", "library"], ["watching", "Watching", "play"], ["planned", "Plan to watch", "bookmark"], ["completed", "Completed", "check"], ["paused", "On hold", "pause"]];

export function Sidebar({ counts, activeFilter, onFilterChange, onAddAnime }) {
  return <aside className="sidebar">
    <a className="brand" href="#" aria-label="AniPulse home"><span className="brand-mark"><Icon name="play" size={23}/></span><strong>ani<span>pulse</span></strong></a>
    <div className="sidebar-body">
      <p className="nav-label">YOUR SPACE</p>
      <nav aria-label="Library navigation">{items.map(([value, label, icon]) => <button key={value} className={`nav-item ${activeFilter === value ? "selected" : ""}`} aria-current={activeFilter === value ? "page" : undefined} onClick={() => onFilterChange(value)}><Icon name={icon}/><span>{label}</span><small>{counts[value]}</small></button>)}</nav>
      <div className="sidebar-note"><span className="note-symbol">＋</span><h3>There's always<br/>another story.</h3><p>Find your next favorite and make room on your list.</p><button className="text-button" onClick={onAddAnime}>Find an anime <Icon name="arrow" size={17}/></button></div>
    </div>
    <div className="local-profile"><span className="profile-icon"><Icon name="device"/></span><div><strong>Your personal space</strong><small>Saved on this device</small></div><span className="online-dot"/></div>
  </aside>;
}
