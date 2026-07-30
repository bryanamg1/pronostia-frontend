import { UI_TEXT } from "../constants/uiText.js";

export function ResponsibleUsePanel({ compact = false }) {
  return (
    <section
      className={`responsible-panel${compact ? " responsible-panel--compact" : ""}`}
      aria-labelledby="responsible-title"
    >
      <div>
        <p className="section-heading__eyebrow">
          {UI_TEXT.responsibleUse.eyebrow}
        </p>
        <h2 id="responsible-title">{UI_TEXT.responsibleUse.title}</h2>
      </div>
      <ul className="responsible-panel__list">
        {UI_TEXT.responsibleUse.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
