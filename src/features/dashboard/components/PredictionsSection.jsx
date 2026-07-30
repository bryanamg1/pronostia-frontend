import { InfoState } from "../../../components/InfoState.jsx";
import { SectionHeading } from "../../../components/SectionHeading.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import { PredictionCard } from "./PredictionCard.jsx";
import { DASHBOARD_TEXT } from "../constants/dashboardText.js";

export function PredictionsSection({ predictions }) {
  return (
    <section>
      <SectionHeading
        eyebrow={DASHBOARD_TEXT.listEyebrow}
        title={DASHBOARD_TEXT.listTitle}
        description={DASHBOARD_TEXT.listDescription}
      />
      {predictions.length === 0 ? (
        <InfoState
          title={DASHBOARD_TEXT.listEmptyTitle}
          description={UI_TEXT.states.emptyFilters}
          tone="warning"
        />
      ) : (
        <div className="prediction-grid">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      )}
    </section>
  );
}
