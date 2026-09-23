export function StatsGrid({ stats }) {
  const items = [
    { value: stats.watching, label: "Currently watching", detail: "Active series" },
    { value: stats.completed, label: "Completed", detail: "Finished series" },
    { value: stats.episodes.toLocaleString(), label: "Episodes watched", detail: "Across your library" },
    { value: stats.nextDrop, label: "Next release", detail: "Nearest scheduled drop" }
  ];

  return (
    <section className="stats-grid" aria-label="Watch statistics">
      {items.map((item) => (
        <article className="stat-card" key={item.label}>
          <span className="stat-label">{item.label}</span>
          <strong>{item.value}</strong>
          <span className="stat-detail">{item.detail}</span>
        </article>
      ))}
    </section>
  );
}
