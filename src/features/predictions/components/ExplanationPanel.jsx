import { InfoState } from "../../../components/InfoState.jsx";
import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import { PREDICTION_TEXT } from "../constants/predictionText.js";

export function ExplanationPanel({ prediction }) {
  if (!prediction.explanation) {
    return (
      <InfoState
        title={PREDICTION_TEXT.explanationUnavailableTitle}
        description={UI_TEXT.states.noExplanation}
        tone="warning"
      />
    );
  }

  return (
    <section className="detail-panel">
      <div className="detail-panel__header">
        <div>
          <h2>{PREDICTION_TEXT.explanationTitle}</h2>
          <p>{prediction.explanation.generatedAtLabel}</p>
        </div>
        <div className="detail-hero__badges">
          <StatusBadge
            label={prediction.explanation.statusLabel}
            tone="neutral"
          />
          <StatusBadge
            label={prediction.explanation.sourceLabel}
            tone={
              prediction.explanation.source === "OPENAI" ? "accent" : "warning"
            }
          />
        </div>
      </div>
      <p className="explanation-summary">{prediction.explanation.summary}</p>
      <div className="detail-columns">
        <div>
          <h3>{PREDICTION_TEXT.factorsTitle}</h3>
          <ul>
            {prediction.explanation.supportingFactors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{PREDICTION_TEXT.counterFactorsTitle}</h3>
          <ul>
            {prediction.explanation.counterFactors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="detail-columns">
        <div>
          <h3>{PREDICTION_TEXT.warningsTitle}</h3>
          <ul>
            {prediction.explanation.warnings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{PREDICTION_TEXT.responsibleUseTitle}</h3>
          <p>{prediction.explanation.responsibleUseNotice}</p>
        </div>
      </div>
    </section>
  );
}
