import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { PREDICTION_TEXT } from "../constants/predictionText.js";

export function PredictionDetailHero({ prediction }) {
  return (
    <section className="detail-hero">
      <div>
        <p className="section-heading__eyebrow">
          {prediction.fixture.competition.name} | {prediction.fixture.status}
        </p>
        <h1>
          {prediction.fixture.homeTeam} vs {prediction.fixture.awayTeam}
        </h1>
        <p>{prediction.fixture.kickoffLabel}</p>
      </div>
      <div className="detail-hero__badges">
        <StatusBadge
          label={prediction.selection.recommendationLabel}
          tone={
            prediction.selection.recommendation === "CONSIDER"
              ? "success"
              : "neutral"
          }
        />
        <StatusBadge
          label={
            prediction.explanation?.statusLabel ??
            PREDICTION_TEXT.heroFallbackExplanation
          }
          tone={prediction.explanation ? "accent" : "warning"}
        />
      </div>
    </section>
  );
}
