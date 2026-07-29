export function InfoState({ title, description, tone = "neutral", actions }) {
  return (
    <section className={`info-state info-state--${tone}`} aria-live="polite">
      <h2>{title}</h2>
      <p>{description}</p>
      {actions ? <div className="info-state__actions">{actions}</div> : null}
    </section>
  );
}
