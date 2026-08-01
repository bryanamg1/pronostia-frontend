import { PREDICTION_TEXT } from "../constants/predictionText.js";

function renderPercentage(value) {
  return typeof value === "number"
    ? `${(value * 100).toFixed(1)}%`
    : "No disponible";
}

export function GoalsScenarioPanel({ prediction }) {
  const probabilities = prediction.analysis?.probabilities;

  return (
    <section className="detail-panel">
      <h2>{PREDICTION_TEXT.goalsScenarioTitle}</h2>
      <p>{prediction.explanation.goalsAnalysis}</p>
      <div className="detail-metric-grid">
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.expectedGoalsHome}</span>
          <strong>{prediction.analysis?.expectedGoals.homeLabel}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.expectedGoalsAway}</span>
          <strong>{prediction.analysis?.expectedGoals.awayLabel}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.expectedGoalsTotal}</span>
          <strong>{prediction.analysis?.expectedGoals.totalLabel}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.over25}</span>
          <strong>{renderPercentage(probabilities?.over25)}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.under25}</span>
          <strong>{renderPercentage(probabilities?.under25)}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.bttsYes}</span>
          <strong>{renderPercentage(probabilities?.bttsYes)}</strong>
        </article>
        <article className="detail-metric-card">
          <span>{PREDICTION_TEXT.labels.bttsNo}</span>
          <strong>{renderPercentage(probabilities?.bttsNo)}</strong>
        </article>
      </div>
    </section>
  );
}
