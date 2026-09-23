export function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">YOUR WATCHSPACE</p>
        <h1>Pick up exactly<br />where you left off.</h1>
        <p className="hero-copy">
          Track every episode, see what drops next, and keep your watchlist in rhythm.
        </p>
      </div>

      <div className="hero-orbit" aria-hidden="true">
        <div className="orbit-ring" />
        <div className="orbit-core">▶</div>
        <div className="orbit-dot dot-one" />
        <div className="orbit-dot dot-two" />
      </div>
    </section>
  );
}
