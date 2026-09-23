const FILTERS = [
  ["all", "All"],
  ["watching", "Watching"],
  ["completed", "Completed"],
  ["planned", "Planned"],
  ["paused", "Paused"]
];

export function LibraryControls({ activeFilter, counts, searchTerm, onFilterChange, onSearchChange }) {
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">COLLECTION</p>
          <h2>My library</h2>
        </div>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">Search anime</span>
          <input
            type="search"
            placeholder="Search your library"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      <div className="filter-row" aria-label="Filter anime">
        {FILTERS.map(([value, label]) => (
          <button
            className={`filter ${activeFilter === value ? "active" : ""}`}
            type="button"
            key={value}
            onClick={() => onFilterChange(value)}
          >
            {label} <span>{counts[value]}</span>
          </button>
        ))}
      </div>
    </>
  );
}
