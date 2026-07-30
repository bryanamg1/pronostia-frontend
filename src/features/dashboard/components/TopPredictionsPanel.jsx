import { InfoState } from "../../../components/InfoState.jsx";
import { SectionHeading } from "../../../components/SectionHeading.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import { PredictionCard } from "./PredictionCard.jsx";
import { DASHBOARD_TEXT } from "../constants/dashboardText.js";

export function TopPredictionsPanel({ predictions }) {
  return (
    <section>
      <SectionHeading
        eyebrow={DASHBOARD_TEXT.topEyebrow}
        title={DASHBOARD_TEXT.topTitle}
        description={DASHBOARD_TEXT.topDescription}
      />
      {predictions.length === 0 ? (
        <InfoState
          title={DASHBOARD_TEXT.topEmptyTitle}
          description={UI_TEXT.states.emptyTop}
          tone="warning"
        />
      ) : (
        <>
          {predictions.length < 5 ? (
            <p>{DASHBOARD_TEXT.topPartialNote}</p>
          ) : null}
          <div className="prediction-grid prediction-grid--top">
            {predictions.map((prediction, index) => (
              <div key={prediction.id} className="top-slot">
                <p className="top-slot__rank">#{index + 1}</p>
                <PredictionCard prediction={prediction} featured />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
