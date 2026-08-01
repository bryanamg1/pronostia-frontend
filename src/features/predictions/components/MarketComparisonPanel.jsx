import { PREDICTION_TEXT } from "../constants/predictionText.js";

export function MarketComparisonPanel({ prediction }) {
  return (
    <section className="detail-panel">
      <h2>{PREDICTION_TEXT.marketComparisonTitle}</h2>
      <p>{prediction.explanation.marketAnalysis}</p>
      <div className="detail-metric-grid">
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.estimatedProbability}</span>
          <strong>{prediction.selection.modelProbabilityLabel}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.marketProbability}</span>
          <strong>{prediction.selection.marketProbabilityLabel}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.difference}</span>
          <strong>{prediction.selection.edgeLabel}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.bookmaker}</span>
          <strong>{prediction.market.bookmaker ?? "No disponible"}</strong>
        </article>
      </div>
    </section>
  );
}
