export function EmptyState({ onAddAnime }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">✦</div>
      <h3>No anime found</h3>
      <p>Add a title or change your search to fill this space.</p>
      <button className="button button-primary" type="button" onClick={onAddAnime}>Add your first anime</button>
    </div>
  );
}
