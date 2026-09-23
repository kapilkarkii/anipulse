export function StatsGrid({ stats }) {
  const items = [
    { icon: "▶", value: stats.watching, label: "Currently watching", cardClass: "stat-highlight", iconClass: "" },
    { icon: "✓", value: stats.completed, label: "Anime completed", cardClass: "", iconClass: "purple" },
    { icon: "◷", value: stats.episodes.toLocaleString(), label: "Episodes watched", cardClass: "", iconClass: "blue" },
    { icon: "↗", value: stats.nextDrop, label: "Until next drop", cardClass: "", iconClass: "pink" }
  ];

  return (
    <section className="stats-grid" aria-label="Watch statistics">
      {items.map((item) => (
        <article className={`stat-card ${item.cardClass}`} key={item.label}>
          <span className={`stat-icon ${item.iconClass}`}>{item.icon}</span>
          <div><strong>{item.value}</strong><span>{item.label}</span></div>
        </article>
      ))}
    </section>
  );
}
