import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { PREDICTION_TEXT } from "../constants/predictionText.js";

export function PredictionSummaryPanel({ prediction }) {
  return (
    <section className="detail-panel" aria-live="polite">
      <div className="detail-panel__header">
        <div>
          <h2>{PREDICTION_TEXT.summaryTitle}</h2>
          <p>{prediction.explanation.generatedAtLabel}</p>
        </div>
        <div className="detail-hero__badges">
          <StatusBadge
            label={prediction.explanation.presentationLabel}
            tone={
              prediction.explanation.status === "EXPLANATION_UNAVAILABLE"
                ? "danger"
                : prediction.explanation.status === "EXPLANATION_PENDING"
                  ? "warning"
                  : "accent"
            }
          />
        </div>
      </div>

      <p className="explanation-summary">{prediction.explanation.summary}</p>

      <dl className="detail-grid">
        <div>
          <dt>{PREDICTION_TEXT.labels.confidenceLevel}</dt>
          <dd>
            {prediction.selection.confidenceBandLabel} ·{" "}
            {prediction.selection.confidenceLabel}
          </dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.dataQuality}</dt>
          <dd>
            {prediction.analysis?.dataQuality.statusLabel ?? "No disponible"}
          </dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.recommendation}</dt>
          <dd>{prediction.selection.recommendationLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.updatedAt}</dt>
          <dd>{prediction.updatedAtLabel}</dd>
        </div>
      </dl>

      {prediction.explanation.supportingFactors.length > 0 ? (
        <div className="detail-columns">
          <div>
            <h3>{PREDICTION_TEXT.supportingTitle}</h3>
            <ul>
              {prediction.explanation.supportingFactors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{PREDICTION_TEXT.cautionTitle}</h3>
            <ul>
              {(prediction.explanation.counterFactors.length > 0
                ? prediction.explanation.counterFactors
                : [prediction.explanation.qualityWarning]
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="detail-panel__note">
          {prediction.explanation.qualityWarning}
        </p>
      )}
    </section>
  );
}
