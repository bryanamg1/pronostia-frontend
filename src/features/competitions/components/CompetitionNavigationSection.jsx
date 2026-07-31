import { Link } from "react-router-dom";

import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { SectionHeading } from "../../../components/SectionHeading.jsx";
import { COMPETITION_TEXT } from "../constants/competitionText.js";
import { groupCompetitionCards } from "../services/competitionCatalog.js";

function getAvailabilityLabel(card) {
  if (card.predictionCount > 0) {
    return COMPETITION_TEXT.statusPredictions;
  }

  if (card.hasHistoricalDataOnly) {
    return COMPETITION_TEXT.statusHistoricalOnly;
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

function getProviderAvailabilityTone(card) {
  if (card.availabilityStatus === "PLAN_RESTRICTED") {
    return "warning";
  }

  if (card.availabilityStatus === "NOT_AVAILABLE") {
    return "danger";
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
  const groupedCards = groupCompetitionCards(visibleCards);

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
      <div className="competition-groups">
        {groupedCards.map((group) => (
          <section
            key={group.key}
            className="competition-group"
            aria-labelledby={`competition-group-${group.key}`}
          >
            <div className="competition-group__header">
              <h3 id={`competition-group-${group.key}`}>{group.title}</h3>
              <span>{group.items.length}</span>
            </div>
            <div className="competition-grid">
              {group.items.map((competition) => {
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
                      <div className="competition-link-card__badges">
                        <StatusBadge
                          label={competition.typeLabel}
                          tone="accent"
                        />
                        <StatusBadge
                          label={
                            isActive
                              ? activeLabel
                              : getAvailabilityLabel(competition)
                          }
                          tone={
                            isActive
                              ? "success"
                              : getAvailabilityTone(competition)
                          }
                        />
                        {competition.fixtureCount === 0 ? (
                          <StatusBadge
                            label={competition.availabilityLabel}
                            tone={getProviderAvailabilityTone(competition)}
                          />
                        ) : null}
                      </div>
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
                        <dt>{COMPETITION_TEXT.availabilityLabel}</dt>
                        <dd>{competition.availabilityLabel}</dd>
                      </div>
                      <div>
                        <dt>{COMPETITION_TEXT.seasonLabel}</dt>
                        <dd>
                          {competition.season ??
                            COMPETITION_TEXT.unavailableValue}
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
        ))}
      </div>
    </section>
  );
}
