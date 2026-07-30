import { Link } from "react-router-dom";

import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { DASHBOARD_TEXT } from "../constants/dashboardText.js";

export function PredictionCard({ prediction, featured = false }) {
  return (
    <article
      className={`prediction-card${featured ? " prediction-card--featured" : ""}`}
    >
      <div className="prediction-card__header">
        <div>
          <p className="prediction-card__competition">
            {prediction.fixture.competition.name}
          </p>
          <h3>
            {prediction.fixture.homeTeam} vs {prediction.fixture.awayTeam}
          </h3>
          <p>{prediction.fixture.kickoffLabel}</p>
        </div>
        <StatusBadge
          label={prediction.selection.recommendationLabel}
          tone={
            prediction.selection.recommendation === "CONSIDER"
              ? "success"
              : "neutral"
          }
        />
      </div>
      <dl className="prediction-card__metrics">
        <div>
          <dt>{DASHBOARD_TEXT.card.market}</dt>
          <dd>{prediction.selection.marketLabel}</dd>
        </div>
        <div>
          <dt>{DASHBOARD_TEXT.card.selection}</dt>
          <dd>{prediction.selection.valueLabel}</dd>
        </div>
        <div>
          <dt>{DASHBOARD_TEXT.card.model}</dt>
          <dd>{prediction.selection.modelProbabilityLabel}</dd>
        </div>
        <div>
          <dt>{DASHBOARD_TEXT.card.marketProbability}</dt>
          <dd>{prediction.selection.marketProbabilityLabel}</dd>
        </div>
        <div>
          <dt>{DASHBOARD_TEXT.card.edge}</dt>
          <dd>{prediction.selection.edgeLabel}</dd>
        </div>
        <div>
          <dt>{DASHBOARD_TEXT.card.confidence}</dt>
          <dd>{prediction.selection.confidenceLabel}</dd>
        </div>
      </dl>
      <div className="prediction-card__footer">
        <div className="prediction-card__badges">
          <StatusBadge
            label={prediction.analysis?.dataQuality?.status ?? "No disponible"}
            tone={
              prediction.analysis?.dataQuality?.status === "SUFFICIENT"
                ? "success"
                : "warning"
            }
          />
          <StatusBadge
            label={
              prediction.explanation?.statusLabel ??
              DASHBOARD_TEXT.card.noExplanation
            }
            tone={prediction.explanation ? "neutral" : "warning"}
          />
          {prediction.explanation?.sourceLabel ? (
            <StatusBadge
              label={prediction.explanation.sourceLabel}
              tone={
                prediction.explanation.source === "OPENAI"
                  ? "accent"
                  : "neutral"
              }
            />
          ) : null}
        </div>
        <Link
          className="button button--ghost"
          to={`/predictions/${prediction.id}`}
        >
          {DASHBOARD_TEXT.card.openDetail}
        </Link>
      </div>
    </article>
  );
}
