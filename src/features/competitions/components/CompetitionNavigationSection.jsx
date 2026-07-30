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

function getAvailabilityTone(card) {
  if (card.predictionCount > 0) {
    return "success";
  }

  if (card.fixtureCount > 0) {
    return "accent";
  }

  return "neutral";
}

export function CompetitionNavigationSection({
  competitionCards,
  activeCompetitionKey = "",
  activeMode = "page",
  hideInactiveWhenActive = false,
}) {
  const visibleCards =
    hideInactiveWhenActive && activeCompetitionKey
      ? competitionCards.filter(
          (competition) => competition.targetKey === activeCompetitionKey,
        )
      : competitionCards;

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
        {visibleCards.map((competition) => {
          const isActive = competition.targetKey === activeCompetitionKey;
          const activeLabel =
            activeMode === "selection"
              ? COMPETITION_TEXT.selectedBadge
              : COMPETITION_TEXT.currentBadge;

          return (
            <article
              key={competition.targetKey}
              className={`competition-link-card${
                isActive ? " competition-link-card--active" : ""
              }`}
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
                    isActive ? activeLabel : getAvailabilityLabel(competition)
                  }
                  tone={isActive ? "success" : getAvailabilityTone(competition)}
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
                <div>
                  <dt>{COMPETITION_TEXT.seasonLabel}</dt>
                  <dd>
                    {competition.season ?? COMPETITION_TEXT.unavailableValue}
                  </dd>
                </div>
              </dl>
              <div className="competition-link-card__footer">
                <Link
                  to={`/competitions/${competition.targetKey}`}
                  className="button competition-link-card__action"
                  aria-current={
                    isActive && activeMode === "page" ? "page" : undefined
                  }
                >
                  {COMPETITION_TEXT.viewCompetition}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
