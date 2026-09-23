import { Icon } from "./Icon";
const FILTERS = [
  ["all", "All"],
  ["watching", "Watching"],
  ["completed", "Completed"],
  ["planned", "Planned"],
  ["paused", "Paused"]
];

export function LibraryControls({ activeFilter, counts, searchTerm, onFilterChange, onSearchChange, sortOrder, onSortChange, view, onViewChange }) {
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>Your collection <span className="collection-count">{counts.all}</span></h2>
          <p className="section-description">The ones you love. The ones still waiting.</p>
        </div>
        <div className="view-switch" aria-label="Collection layout">{["grid", "list"].map((mode) => <button key={mode} className={view === mode ? "active" : ""} aria-label={`${mode} view`} aria-pressed={view === mode} onClick={() => onViewChange(mode)}><Icon name={mode} size={18}/></button>)}</div>
      </div>
      <div className="collection-toolbar">
      <div className="filter-row" aria-label="Filter anime">
        {FILTERS.map(([value, label]) => <button className={`filter ${activeFilter === value ? "active" : ""}`} type="button" key={value} aria-pressed={activeFilter === value} onClick={() => onFilterChange(value)}>{label} <span>{counts[value]}</span></button>)}
      </div>
      <div className="collection-tools">
        <label className="search-box">
          <Icon name="search" size={17}/>
          <span className="sr-only">Search anime</span>
          <input
            type="search"
            placeholder="Find in collection…"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <label className="sort-control"><span className="sr-only">Sort collection</span><select value={sortOrder} onChange={(event) => onSortChange(event.target.value)}><option value="added">Recently added</option><option value="title">Title A–Z</option><option value="progress">Watch progress</option></select></label>
      </div>
      </div>
    </>
  );
}
