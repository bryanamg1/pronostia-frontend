import { PREDICTION_TEXT } from "../constants/predictionText.js";

function renderPercentage(value) {
  return typeof value === "number"
    ? `${(value * 100).toFixed(1)}%`
    : "No disponible";
}

export function AnalysisPanel({ prediction }) {
  const probabilities = prediction.analysis?.probabilities;

  return (
    <section className="detail-panel">
      <h2>{PREDICTION_TEXT.matchProbabilitiesTitle}</h2>
      <p>{prediction.explanation.outcomeAnalysis}</p>
      <div className="detail-metric-grid">
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.homeWin}</span>
          <strong>{renderPercentage(probabilities?.homeWin)}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.draw}</span>
          <strong>{renderPercentage(probabilities?.draw)}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.awayWin}</span>
          <strong>{renderPercentage(probabilities?.awayWin)}</strong>
        </article>
      </div>
    </section>
  );
}
