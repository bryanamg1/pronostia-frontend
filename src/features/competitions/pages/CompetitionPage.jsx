import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { InfoState } from "../../../components/InfoState.jsx";
import { ResponsibleUsePanel } from "../../../components/ResponsibleUsePanel.jsx";
import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import {
  buildUpdatedSearchParams,
  clearDashboardFilters,
  readDashboardFilters,
} from "../../../utils/dashboardFilters.js";
import { formatRunStatus } from "../../../utils/formatters.js";
import { CompetitionFiltersPanel } from "../components/CompetitionFiltersPanel.jsx";
import { CompetitionFixtureList } from "../components/CompetitionFixtureList.jsx";
import { COMPETITION_TEXT } from "../constants/competitionText.js";
import { useCompetitionCatalogData } from "../hooks/useCompetitionCatalogData.js";
import {
  buildTeamOptions,
  filterFixtures,
  findCompetitionByKey,
} from "../services/competitionCatalog.js";

function getAvailabilityTone(competition) {
  if (competition.availabilityStatus === "PLAN_RESTRICTED") {
    return "warning";
  }

  if (competition.availabilityStatus === "NOT_AVAILABLE") {
    return "danger";
  }

  return "neutral";
}

export function CompetitionPage() {
  const { competitionKey = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshToken, setRefreshToken] = useState(0);
  const filters = readDashboardFilters(searchParams);
  const state = useCompetitionCatalogData({ competitionKey }, refreshToken);

  const teamKey = filters.team;

  const selectedCompetition = useMemo(
    () =>
      state.data
        ? findCompetitionByKey(state.data.competitions, competitionKey)
        : null,
    [competitionKey, state.data],
  );
  const teamOptions = useMemo(() => {
    if (!state.data || !competitionKey) {
      return [
        {
          value: "",
          label: COMPETITION_TEXT.selectCompetition,
        },
      ];
    }

    return [
      {
        value: "",
        label: COMPETITION_TEXT.allTeams,
      },
      ...buildTeamOptions(state.data.fixtures, competitionKey),
    ];
  }, [competitionKey, state.data]);

  useEffect(() => {
    if (!teamKey || teamOptions.length === 0) {
      return;
    }

    const isValidTeam = teamOptions.some((option) => option.value === teamKey);

    if (isValidTeam) {
      return;
    }

    setSearchParams(clearDashboardFilters(searchParams, ["team"]), {
      replace: true,
    });
  }, [searchParams, setSearchParams, teamKey, teamOptions]);

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

  if (!selectedCompetition) {
    return (
      <InfoState
        title={COMPETITION_TEXT.competitionUnavailableTitle}
        description={COMPETITION_TEXT.competitionUnavailableDescription}
        tone="warning"
        actions={
          <Link className="button button--ghost" to="/competitions">
            {COMPETITION_TEXT.backToCompetitions}
          </Link>
        }
      />
    );
  }

  const { data } = state;
  const latestRunStatus = data.latestRun?.status
    ? formatRunStatus(data.latestRun.status)
    : "No disponible";
  const filteredFixtures = filterFixtures(data.fixtures, {
    competitionKey,
    teamKey,
  });
  const emptyTitle = teamKey
    ? COMPETITION_TEXT.emptyTeamTitle
    : COMPETITION_TEXT.emptyCompetitionTitle;
  const availabilityDescription =
    COMPETITION_TEXT.availabilityDescriptions[
      selectedCompetition.availabilityStatus
    ] ?? COMPETITION_TEXT.emptyCompetitionDescription;
  const emptyDescription = teamKey
    ? COMPETITION_TEXT.emptyTeamDescription
    : `${COMPETITION_TEXT.emptyCompetitionDescription} ${availabilityDescription}`;

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">
              {COMPETITION_TEXT.overviewTitle}
            </p>
            <h1>{selectedCompetition.name}</h1>
            <p>
              {selectedCompetition.country}
              {` | ${COMPETITION_TEXT.seasonLabel} ${
                selectedCompetition.season ?? COMPETITION_TEXT.unavailableValue
              }`}
            </p>
          </div>
          <div className="hero-panel__meta hero-panel__meta--stack">
            <span>
              {COMPETITION_TEXT.currentWindow}: {data.windowLabel}
            </span>
            <span>
              {COMPETITION_TEXT.latestRun}: {latestRunStatus}
            </span>
            <span>
              {COMPETITION_TEXT.lastUpdated}: {data.lastUpdatedLabel}
            </span>
          </div>
        </div>
        <div className="hero-panel__actions">
          <StatusBadge label={selectedCompetition.typeLabel} tone="accent" />
          <StatusBadge
            label={selectedCompetition.availabilityLabel}
            tone={getAvailabilityTone(selectedCompetition)}
          />
          <Link className="button button--ghost" to="/competitions">
            {COMPETITION_TEXT.backToCompetitions}
          </Link>
          <Link className="button button--ghost" to="/dashboard">
            {COMPETITION_TEXT.backToDashboard}
          </Link>
        </div>
      </section>

      <CompetitionFiltersPanel
        competitionOptions={[
          {
            value: selectedCompetition.targetKey,
            label: selectedCompetition.name,
          },
        ]}
        selectedCompetition={selectedCompetition.targetKey}
        onCompetitionChange={() => undefined}
        teamOptions={teamOptions}
        selectedTeam={teamKey}
        onTeamChange={(value) => {
          setSearchParams(
            buildUpdatedSearchParams(searchParams, {
              team: value,
            }),
            { replace: true },
          );
        }}
        onClear={() =>
          setSearchParams(clearDashboardFilters(searchParams, ["team"]), {
            replace: true,
          })
        }
        showCompetitionSelect={false}
        teamDisabled={teamOptions.length <= 1}
      />

      <CompetitionFixtureList
        fixtures={filteredFixtures}
        title={`${COMPETITION_TEXT.resultsLabel}: ${filteredFixtures.length}`}
        description={`${COMPETITION_TEXT.latestRun}: ${latestRunStatus}`}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />

      <ResponsibleUsePanel compact />
    </div>
  );
}
