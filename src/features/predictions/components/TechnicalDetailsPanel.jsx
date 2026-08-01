import { PREDICTION_TEXT } from "../constants/predictionText.js";

function renderRawNumber(value) {
  return typeof value === "number" ? String(value) : "No disponible";
}

export function TechnicalDetailsPanel({ prediction }) {
  return (
    <details className="detail-panel detail-panel--technical">
      <summary className="detail-panel__summary">
        {PREDICTION_TEXT.technicalDetailsSummary}
      </summary>
      <dl className="detail-grid">
        <div>
          <dt>{PREDICTION_TEXT.labels.fixtureId}</dt>
          <dd>{prediction.fixture.id}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.predictionId}</dt>
          <dd>{prediction.id}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.rawMarket}</dt>
          <dd>{prediction.selection.market}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.rawSelection}</dt>
          <dd>{prediction.selection.value}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.modelVersion}</dt>
          <dd>{prediction.modelVersion}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.historicalCutoff}</dt>
          <dd>
            {prediction.analysis?.historicalCutoffLabel ?? "No disponible"}
          </dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.source}</dt>
          <dd>{prediction.explanation.presentationLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.explanationStatus}</dt>
          <dd>{prediction.explanation.statusLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.bookmaker}</dt>
          <dd>{prediction.market.bookmaker ?? "No disponible"}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.capturedAt}</dt>
          <dd>{prediction.market.capturedAtLabel}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.normalizationMethod}</dt>
          <dd>{prediction.market.normalizationMethod ?? "No disponible"}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.derivedFromMarket}</dt>
          <dd>{prediction.market.derivedFromMarket ?? "No disponible"}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.dataFlags}</dt>
          <dd>
            {prediction.analysis?.dataQuality.flags.length > 0
              ? prediction.analysis.dataQuality.flags.join(", ")
              : "No disponible"}
          </dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.rawProbabilities}</dt>
          <dd>
            modelo {renderRawNumber(prediction.selection.modelProbability)} ·
            mercado {renderRawNumber(prediction.selection.marketProbability)} ·
            edge {renderRawNumber(prediction.selection.edgePp)}
          </dd>
        </div>
      </dl>
    </details>
  );
}
