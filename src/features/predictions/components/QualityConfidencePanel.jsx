import { PREDICTION_TEXT } from "../constants/predictionText.js";

export function QualityConfidencePanel({ prediction }) {
  const flags =
    prediction.analysis?.dataQuality.flagLabels.length > 0
      ? prediction.analysis.dataQuality.flagLabels
      : [];

  return (
    <section className="detail-panel">
      <h2>{PREDICTION_TEXT.qualityTitle}</h2>
      <p>{prediction.explanation.qualityWarning}</p>
      <dl className="detail-grid">
        <div>
          <dt>{PREDICTION_TEXT.labels.dataQuality}</dt>
          <dd>
            {prediction.analysis?.dataQuality.statusLabel ?? "No disponible"}
          </dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.confidenceLevel}</dt>
          <dd>{prediction.selection.confidenceBandLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.confidence}</dt>
          <dd>{prediction.selection.confidenceLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.riskLevel}</dt>
          <dd>{prediction.selection.riskLabel}</dd>
        </div>
      </dl>
      {flags.length > 0 ? (
        <div className="flags-list">
          {flags.map((flag) => (
            <span key={flag} className="token-chip">
              {flag}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
