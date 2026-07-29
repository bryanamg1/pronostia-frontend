import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InfoState } from "../../../components/InfoState.jsx";
import { ResponsibleUsePanel } from "../../../components/ResponsibleUsePanel.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import { formatRunStatus } from "../../../utils/formatters.js";
import { CompetitionFiltersPanel } from "../components/CompetitionFiltersPanel.jsx";
import { CompetitionNavigationSection } from "../components/CompetitionNavigationSection.jsx";
import { COMPETITION_TEXT } from "../constants/competitionText.js";
import { useCompetitionCatalogData } from "../hooks/useCompetitionCatalogData.js";

function buildCompetitionOptions(competitionCards) {
  return [
    {
      value: "",
      label: COMPETITION_TEXT.allCompetitions,
    },
    ...competitionCards.map((competition) => ({
      value: competition.targetKey,
      label: competition.name,
    })),
  ];
}

export function CompetitionsPage() {
  const navigate = useNavigate();
  const [refreshToken, setRefreshToken] = useState(0);
  const state = useCompetitionCatalogData({}, refreshToken);

  function refreshPage() {
    setRefreshToken((current) => current + 1);
  }

  if (state.status === "loading") {
    return (
      <InfoState
        title={COMPETITION_TEXT.overviewTitle}
        description={UI_TEXT.states.loading}
      />
    );
  }

  if (state.status === "error") {
    return (
      <InfoState
        title={COMPETITION_TEXT.overviewTitle}
        description={state.error}
        tone="danger"
        actions={
          <button className="button" onClick={refreshPage} type="button">
            {UI_TEXT.actions.retry}
          </button>
        }
      />
    );
  }

  const { data } = state;
  const competitionOptions = buildCompetitionOptions(data.competitionCards);
  const latestRunStatus = data.latestRun?.status
    ? formatRunStatus(data.latestRun.status)
    : "No disponible";

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">
              {COMPETITION_TEXT.overviewEyebrow}
            </p>
            <h1>{COMPETITION_TEXT.overviewTitle}</h1>
            <p>{COMPETITION_TEXT.overviewDescription}</p>
          </div>
          <div className="hero-panel__meta hero-panel__meta--stack">
            <span>
              {COMPETITION_TEXT.latestRun}: {latestRunStatus}
            </span>
            <span>
              {COMPETITION_TEXT.lastUpdated}: {data.lastUpdatedLabel}
            </span>
          </div>
        </div>
      </section>

      <CompetitionFiltersPanel
        competitionOptions={competitionOptions}
        selectedCompetition=""
        onCompetitionChange={(competitionKey) => {
          if (!competitionKey) {
            return;
          }

          navigate(`/competitions/${competitionKey}`);
        }}
        teamOptions={[
          {
            value: "",
            label: COMPETITION_TEXT.selectCompetition,
          },
        ]}
        selectedTeam=""
        onTeamChange={() => undefined}
        onClear={() => navigate("/competitions")}
        teamDisabled
      />

      <CompetitionNavigationSection competitionCards={data.competitionCards} />
      <ResponsibleUsePanel compact />
    </div>
  );
}
