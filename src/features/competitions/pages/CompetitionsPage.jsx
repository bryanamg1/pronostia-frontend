import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { InfoState } from "../../../components/InfoState.jsx";
import { ResponsibleUsePanel } from "../../../components/ResponsibleUsePanel.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import {
  buildUpdatedSearchParams,
  clearDashboardFilters,
  readDashboardFilters,
} from "../../../utils/dashboardFilters.js";
import { formatRunStatus } from "../../../utils/formatters.js";
import { CompetitionFiltersPanel } from "../components/CompetitionFiltersPanel.jsx";
import { CompetitionNavigationSection } from "../components/CompetitionNavigationSection.jsx";
import { COMPETITION_TEXT } from "../constants/competitionText.js";
import { useCompetitionCatalogData } from "../hooks/useCompetitionCatalogData.js";
import {
  buildCompatibleCompetitionGeographyOptions,
  buildCompetitionRequestFilters,
  buildCompetitionTypeOptions,
  isCompetitionGeographyCompatible,
} from "../services/competitionCatalog.js";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshToken, setRefreshToken] = useState(0);
  const filters = readDashboardFilters(searchParams);
  const competitionRequestFilters = useMemo(
    () =>
      buildCompetitionRequestFilters({
        competitionType: filters.competitionType,
        countryRegion: filters.competitionRegion,
      }),
    [filters.competitionRegion, filters.competitionType],
  );
  const state = useCompetitionCatalogData(
    {
      competitionFilters: competitionRequestFilters,
    },
    refreshToken,
  );
  const geographyOptions = useMemo(
    () => buildCompatibleCompetitionGeographyOptions(filters.competitionType),
    [filters.competitionType],
  );

  function refreshPage() {
    setRefreshToken((current) => current + 1);
  }

  useEffect(() => {
    if (!filters.competition) {
      return;
    }

    const visibleCompetitionCards = state.data?.competitionCards ?? [];
    const isStillVisible = visibleCompetitionCards.some(
      (competition) => competition.targetKey === filters.competition,
    );

    if (isStillVisible) {
      return;
    }

    setSearchParams(
      clearDashboardFilters(searchParams, ["competition", "team"]),
      {
        replace: true,
      },
    );
  }, [filters.competition, searchParams, setSearchParams, state.data]);

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
  const competitionCards = data.competitionCards;
  const competitionOptions = buildCompetitionOptions(competitionCards);
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
        typeOptions={buildCompetitionTypeOptions()}
        selectedType={filters.competitionType}
        onTypeChange={(value) =>
          setSearchParams(
            buildUpdatedSearchParams(searchParams, {
              competitionType: value,
              competitionRegion: isCompetitionGeographyCompatible({
                competitionType: value,
                countryRegion: filters.competitionRegion,
              })
                ? filters.competitionRegion
                : "",
              competition: "",
              team: "",
            }),
            { replace: true },
          )
        }
        showTypeSelect
        geographyOptions={geographyOptions}
        selectedGeography={filters.competitionRegion}
        onGeographyChange={(value) =>
          setSearchParams(
            buildUpdatedSearchParams(searchParams, {
              competitionRegion: value,
              competition: "",
              team: "",
            }),
            { replace: true },
          )
        }
        showGeographySelect
        competitionOptions={competitionOptions}
        selectedCompetition={filters.competition}
        onCompetitionChange={(competitionKey) => {
          if (!competitionKey) {
            setSearchParams(
              buildUpdatedSearchParams(searchParams, {
                competition: "",
                team: "",
              }),
              { replace: true },
            );
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
        onClear={() =>
          setSearchParams(
            clearDashboardFilters(searchParams, [
              "competitionType",
              "competitionRegion",
              "competition",
              "team",
            ]),
            { replace: true },
          )
        }
        teamDisabled
      />

      {competitionCards.length === 0 ? (
        <InfoState
          title={COMPETITION_TEXT.emptyCatalogTitle}
          description={COMPETITION_TEXT.emptyCatalogDescription}
          tone="warning"
        />
      ) : (
        <CompetitionNavigationSection competitionCards={competitionCards} />
      )}
      <ResponsibleUsePanel compact />
    </div>
  );
}
