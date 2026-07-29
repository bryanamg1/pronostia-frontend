import { useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";

import { EmptyDashboardState } from "../components/EmptyDashboardState.jsx";
import { InfoState } from "../../../components/InfoState.jsx";
import { ResponsibleUsePanel } from "../../../components/ResponsibleUsePanel.jsx";
import { SectionHeading } from "../../../components/SectionHeading.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import { formatDateTime, formatRunStatus } from "../../../utils/formatters.js";
import { DashboardFilters } from "../components/DashboardFilters.jsx";
import { PredictionsSection } from "../components/PredictionsSection.jsx";
import { SummaryCards } from "../components/SummaryCards.jsx";
import { TopPredictionsPanel } from "../components/TopPredictionsPanel.jsx";
import { DASHBOARD_TEXT } from "../constants/dashboardText.js";
import { useDashboardData } from "../hooks/useDashboardData.js";

function readFilters(searchParams) {
  return {
    date: searchParams.get("date") ?? "",
    competition: searchParams.get("competition") ?? "",
    market: searchParams.get("market") ?? "",
    recommendation: searchParams.get("recommendation") ?? "",
    dataQuality: searchParams.get("dataQuality") ?? "",
    explanationSource: searchParams.get("explanationSource") ?? "",
  };
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshToken, setRefreshToken] = useState(0);
  const [isPending, startTransition] = useTransition();
  const filters = readFilters(searchParams);
  const state = useDashboardData(filters, refreshToken);

  function updateFilter(key, value) {
    startTransition(() => {
      const next = new URLSearchParams(searchParams);

      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }

      setSearchParams(next, { replace: true });
    });
  }

  function clearFilters() {
    startTransition(() => {
      setSearchParams({}, { replace: true });
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

  if (data.predictions.length === 0) {
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

    return (
      <div className="page-stack page-stack--empty">
        <EmptyDashboardState
          consultedWindow={consultedWindow}
          latestRunStatus={latestRunStatus}
          lastUpdated={lastUpdated}
          onRefresh={refreshDashboard}
        />
        <ResponsibleUsePanel compact />
      </div>
    );
  }

  return (
    <div className="page-stack">
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

      <TopPredictionsPanel predictions={data.topPredictions} />
      <PredictionsSection predictions={data.visiblePredictions} />
      <ResponsibleUsePanel />
    </div>
  );
}
