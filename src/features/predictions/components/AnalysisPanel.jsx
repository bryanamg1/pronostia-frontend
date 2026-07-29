import { InfoState } from "../../../components/InfoState.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import { formatPercentage } from "../../../utils/formatters.js";
import { PREDICTION_TEXT } from "../constants/predictionText.js";

export function AnalysisPanel({ prediction }) {
  if (!prediction.analysis) {
    return (
      <InfoState
        title={PREDICTION_TEXT.analysisUnavailableTitle}
        description={UI_TEXT.states.noAnalysis}
        tone="warning"
      />
    );
  }

  const probabilities = prediction.analysis.probabilities;

  return (
    <section className="detail-panel">
      <h2>{PREDICTION_TEXT.analysisTitle}</h2>
      <dl className="detail-grid">
        <div>
          <dt>{PREDICTION_TEXT.labels.xgHome}</dt>
          <dd>{prediction.analysis.expectedGoals.home ?? "No disponible"}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.xgAway}</dt>
          <dd>{prediction.analysis.expectedGoals.away ?? "No disponible"}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.homeWin}</dt>
          <dd>{formatPercentage(probabilities.homeWin)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.draw}</dt>
          <dd>{formatPercentage(probabilities.draw)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.awayWin}</dt>
          <dd>{formatPercentage(probabilities.awayWin)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.over25}</dt>
          <dd>{formatPercentage(probabilities.over25)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.under25}</dt>
          <dd>{formatPercentage(probabilities.under25)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.bttsYes}</dt>
          <dd>{formatPercentage(probabilities.bttsYes)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.bttsNo}</dt>
          <dd>{formatPercentage(probabilities.bttsNo)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.doubleChance1X}</dt>
          <dd>{formatPercentage(probabilities.doubleChance1X)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.doubleChanceX2}</dt>
          <dd>{formatPercentage(probabilities.doubleChanceX2)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.doubleChance12}</dt>
          <dd>{formatPercentage(probabilities.doubleChance12)}</dd>
        </div>
        <div>
          <dt>{PREDICTION_TEXT.labels.dataQuality}</dt>
          <dd>{prediction.analysis.dataQuality.status ?? "No disponible"}</dd>
        </div>
      </dl>
      <div className="flags-list">
        {(prediction.analysis.dataQuality.flags.length > 0
          ? prediction.analysis.dataQuality.flags
          : [PREDICTION_TEXT.noAdditionalFlags]
        ).map((flag) => (
          <span key={flag} className="token-chip">
            {flag}
          </span>
        ))}
      </div>
    </section>
  );
}
