import { Link } from "react-router-dom";

import { InfoState } from "../../../components/InfoState.jsx";
import { SectionHeading } from "../../../components/SectionHeading.jsx";
import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { COMPETITION_TEXT } from "../constants/competitionText.js";

function getRecommendationTone(fixture) {
  return fixture.prediction?.recommendation === "CONSIDER"
    ? "success"
    : "neutral";
}

export function CompetitionFixtureList({
  fixtures,
  title,
  description,
  emptyTitle,
  emptyDescription,
}) {
  return (
    <section aria-labelledby="competition-fixtures-title">
      <SectionHeading
        eyebrow={COMPETITION_TEXT.resultsLabel}
        title={title}
        description={description}
      />
      {fixtures.length === 0 ? (
        <InfoState
          title={emptyTitle}
          description={emptyDescription}
          tone="warning"
        />
      ) : (
        <ul className="fixture-list" aria-live="polite">
          {fixtures.map((fixture) => (
            <li key={fixture.id} className="fixture-list__item">
              <article className="fixture-card">
                <div className="fixture-card__header">
                  <div>
                    <p className="prediction-card__competition">
                      {fixture.competition.name}
                    </p>
                    <h3>
                      {fixture.homeTeam.name} vs {fixture.awayTeam.name}
                    </h3>
                    <p>{fixture.kickoffLabel}</p>
                  </div>
                  <div className="fixture-card__badges">
                    <StatusBadge label={fixture.statusLabel} />
                    <StatusBadge
                      label={
                        fixture.isHistorical
                          ? COMPETITION_TEXT.historicalBadge
                          : COMPETITION_TEXT.upcomingBadge
                      }
                      tone={fixture.isHistorical ? "warning" : "success"}
                    />
                  </div>
                </div>
                <dl className="fixture-card__meta">
                  <div>
                    <dt>{COMPETITION_TEXT.fixtureMeta.kickoff}</dt>
                    <dd>{fixture.kickoffLabel}</dd>
                  </div>
                  <div>
                    <dt>{COMPETITION_TEXT.fixtureMeta.status}</dt>
                    <dd>{fixture.statusLabel}</dd>
                  </div>
                  <div>
                    <dt>{COMPETITION_TEXT.fixtureMeta.market}</dt>
                    <dd>
                      {fixture.prediction?.marketLabel ??
                        COMPETITION_TEXT.predictionUnavailable}
                    </dd>
                  </div>
                  <div>
                    <dt>{COMPETITION_TEXT.fixtureMeta.selection}</dt>
                    <dd>
                      {fixture.prediction?.selectionLabel ??
                        COMPETITION_TEXT.predictionUnavailable}
                    </dd>
                  </div>
                  <div>
                    <dt>{COMPETITION_TEXT.fixtureMeta.confidence}</dt>
                    <dd>
                      {fixture.prediction?.confidenceLabel ?? "No disponible"}
                    </dd>
                  </div>
                  <div>
                    <dt>{COMPETITION_TEXT.fixtureMeta.recommendation}</dt>
                    <dd>
                      {fixture.prediction?.recommendationLabel ??
                        COMPETITION_TEXT.predictionUnavailable}
                    </dd>
                  </div>
                </dl>
                <div className="fixture-card__footer">
                  {fixture.prediction ? (
                    <>
                      <StatusBadge
                        label={COMPETITION_TEXT.predictionAvailable}
                        tone={getRecommendationTone(fixture)}
                      />
                      <Link
                        className="button button--ghost"
                        to={`/predictions/${fixture.prediction.id}`}
                      >
                        {COMPETITION_TEXT.openPrediction}
                      </Link>
                    </>
                  ) : (
                    <StatusBadge
                      label={COMPETITION_TEXT.predictionUnavailable}
                      tone="warning"
                    />
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
