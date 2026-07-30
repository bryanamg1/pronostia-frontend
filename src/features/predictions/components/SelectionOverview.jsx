import { PREDICTION_TEXT } from "../constants/predictionText.js";

export function SelectionOverview({ prediction }) {
  return (
    <section className="detail-panel">
      <h2>{PREDICTION_TEXT.selectionTitle}</h2>
      <dl className="detail-grid">
        <div>
          <dt>{PREDICTION_TEXT.labels.market}</dt>
          <dd>{prediction.selection.marketLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.selection}</dt>
          <dd>{prediction.selection.valueLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.modelProbability}</dt>
          <dd>{prediction.selection.modelProbabilityLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.marketProbability}</dt>
          <dd>{prediction.selection.marketProbabilityLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.edge}</dt>
          <dd>{prediction.selection.edgeLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.confidence}</dt>
          <dd>{prediction.selection.confidenceLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.riskLevel}</dt>
          <dd>{prediction.selection.riskLevel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.modelVersion}</dt>
          <dd>{prediction.modelVersion}</dd>
        </div>
      </dl>
    </section>
  );
}
