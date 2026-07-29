import { UI_TEXT } from "../constants/uiText.js";

export function ResponsibleUsePanel() {
  return (
    <section className="responsible-panel" aria-labelledby="responsible-title">
      <div>
        <p className="section-heading__eyebrow">Responsible use</p>
        <h2 id="responsible-title">{UI_TEXT.responsibleUse.title}</h2>
      </div>
      <ul>
        {UI_TEXT.responsibleUse.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
