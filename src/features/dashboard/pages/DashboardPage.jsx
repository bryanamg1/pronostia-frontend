import { useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";

import { EmptyDashboardState } from "../components/EmptyDashboardState.jsx";
import { InfoState } from "../../../components/InfoState.jsx";
import { ResponsibleUsePanel } from "../../../components/ResponsibleUsePanel.jsx";
import { SectionHeading } from "../../../components/SectionHeading.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import {
  buildUpdatedSearchParams,
  clearDashboardFilters,
  readDashboardFilters,
} from "../../../utils/dashboardFilters.js";
import { formatDateTime, formatRunStatus } from "../../../utils/formatters.js";
import { CompetitionNavigationSection } from "../../competitions/components/CompetitionNavigationSection.jsx";
import { DashboardFilters } from "../components/DashboardFilters.jsx";
import { PredictionsSection } from "../components/PredictionsSection.jsx";
import { SummaryCards } from "../components/SummaryCards.jsx";
import { TopPredictionsPanel } from "../components/TopPredictionsPanel.jsx";
import { DASHBOARD_TEXT } from "../constants/dashboardText.js";
import { useDashboardData } from "../hooks/useDashboardData.js";

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshToken, setRefreshToken] = useState(0);
  const [isPending, startTransition] = useTransition();
  const filters = readDashboardFilters(searchParams);
  const state = useDashboardData(filters, refreshToken);

  function updateFilter(key, value) {
    startTransition(() => {
      setSearchParams(
        buildUpdatedSearchParams(searchParams, {
          [key]: value,
        }),
        { replace: true },
      );
    });
  }

  function clearFilters() {
    startTransition(() => {
      setSearchParams(clearDashboardFilters(searchParams), { replace: true });
    });
  }

  function refreshDashboard() {
    setRefreshToken((current) => current + 1);
  }

  if (state.status === "loading") {
    return (
      <InfoState
        title={DASHBOARD_TEXT.loadingTitle}
        description={UI_TEXT.states.loading}
        tone="neutral"
      />
    );
  }

  if (state.status === "error") {
    return (
      <InfoState
        title={DASHBOARD_TEXT.errorTitle}
        description={state.error}
        tone="danger"
        actions={
          <button className="button" onClick={refreshDashboard} type="button">
            {UI_TEXT.actions.retry}
          </button>
        }
      />
    );
  }

  const { data } = state;
  const consultedWindow = filters.date || null;
  const latestRunStatus = data.latestRun?.status
    ? formatRunStatus(data.latestRun.status)
    : null;
  const lastUpdated =
    data.summary.lastUpdatedLabel !== "No disponible"
      ? data.summary.lastUpdatedLabel
      : data.latestRun?.finishedAt
        ? formatDateTime(data.latestRun.finishedAt, data.timezone)
        : null;
  const isDailyEmpty = data.predictions.length === 0;

  return (
    <div className={`page-stack${isDailyEmpty ? " page-stack--empty" : ""}`}>
      <section className="hero-panel">
        <SectionHeading
          eyebrow={DASHBOARD_TEXT.eyebrow}
          title={DASHBOARD_TEXT.title}
          description={DASHBOARD_TEXT.description}
          actions={
            <div className="hero-panel__meta">
              <span>
                {DASHBOARD_TEXT.timezoneLabel}: {data.timezone}
              </span>
              {isPending ? (
                <span>{DASHBOARD_TEXT.pendingFiltersLabel}</span>
              ) : null}
            </div>
          }
        />
        <SummaryCards summary={data.summary} />
      </section>

      <DashboardFilters
        filters={filters}
        options={data.filterOptions}
        onChange={updateFilter}
        onClear={clearFilters}
      />

      <CompetitionNavigationSection
        competitionCards={data.competitionCards}
        currentCompetitionKey={filters.competition}
      />

      <TopPredictionsPanel predictions={data.topPredictions} />
      {isDailyEmpty ? (
        <EmptyDashboardState
          consultedWindow={consultedWindow}
          latestRunStatus={latestRunStatus}
          lastUpdated={lastUpdated}
          onRefresh={refreshDashboard}
        />
      ) : (
        <PredictionsSection predictions={data.visiblePredictions} />
      )}
      <ResponsibleUsePanel compact={isDailyEmpty} />
    </div>
  );
}
