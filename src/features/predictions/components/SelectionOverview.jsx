import { PREDICTION_TEXT } from "../constants/predictionText.js";

export function SelectionOverview({ prediction }) {
  return (
    <section className="detail-panel">
      <h2>{PREDICTION_TEXT.mainPredictionTitle}</h2>
      <p className="detail-highlight">{prediction.selection.valueLabel}</p>
      <dl className="detail-grid">
        <div>
          <dt>{PREDICTION_TEXT.labels.market}</dt>
          <dd>{prediction.selection.marketLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.estimatedProbability}</dt>
          <dd>{prediction.selection.modelProbabilityLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.confidence}</dt>
          <dd>{prediction.selection.confidenceLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.riskLevel}</dt>
          <dd>{prediction.selection.riskLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.recommendation}</dt>
          <dd>{prediction.selection.recommendationLabel}</dd>
        </div>
      </dl>
      {prediction.selection.recommendation !== "CONSIDER" ? (
        <p className="detail-panel__note">
          {PREDICTION_TEXT.recommendationExplanation}
        </p>
      ) : null}
    </section>
  );
}
