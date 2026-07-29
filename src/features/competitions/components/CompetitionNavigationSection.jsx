import { Link } from "react-router-dom";

import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { SectionHeading } from "../../../components/SectionHeading.jsx";
import { COMPETITION_TEXT } from "../constants/competitionText.js";

function getAvailabilityLabel(card) {
  if (card.predictionCount > 0) {
    return COMPETITION_TEXT.statusPredictions;
  }

  if (card.fixtureCount > 0) {
    return COMPETITION_TEXT.statusAvailable;
  }

  return COMPETITION_TEXT.statusEmpty;
}

export function CompetitionNavigationSection({
  competitionCards,
  currentCompetitionKey = "",
}) {
  return (
    <section
      className="competition-panel"
      aria-labelledby="competition-navigation-title"
    >
      <SectionHeading
        eyebrow={COMPETITION_TEXT.overviewEyebrow}
        title={COMPETITION_TEXT.overviewTitle}
        description={COMPETITION_TEXT.overviewDescription}
      />
      <div className="competition-grid">
        {competitionCards.map((competition) => {
          const isCurrent = competition.targetKey === currentCompetitionKey;

          return (
            <Link
              key={competition.targetKey}
              to={`/competitions/${competition.targetKey}`}
              className="competition-link-card"
              aria-current={isCurrent ? "page" : undefined}
            >
              <div className="competition-link-card__header">
                <div>
                  <p className="section-heading__eyebrow">
                    {competition.country}
                  </p>
                  <h3>{competition.name}</h3>
                </div>
                <StatusBadge
                  label={
                    isCurrent
                      ? COMPETITION_TEXT.currentView
                      : COMPETITION_TEXT.viewCompetition
                  }
                />
              </div>
              <dl className="competition-link-card__meta">
                <div>
                  <dt>{COMPETITION_TEXT.fixturesCount}</dt>
                  <dd>{competition.fixtureCount}</dd>
                </div>
                <div>
                  <dt>{COMPETITION_TEXT.predictionsCount}</dt>
                  <dd>{competition.predictionCount}</dd>
                </div>
                <div>
                  <dt>{COMPETITION_TEXT.fixtureMeta.status}</dt>
                  <dd>{getAvailabilityLabel(competition)}</dd>
                </div>
                {competition.season ? (
                  <div>
                    <dt>{COMPETITION_TEXT.seasonLabel}</dt>
                    <dd>{competition.season}</dd>
                  </div>
                ) : null}
              </dl>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
