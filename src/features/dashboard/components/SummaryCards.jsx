import { StatusBadge } from "../../../components/StatusBadge.jsx";
import { DASHBOARD_TEXT } from "../constants/dashboardText.js";
import { formatRunStatus } from "../../../utils/formatters.js";

export function SummaryCards({ summary }) {
  return (
    <section className="summary-grid" aria-label="Resumen diario">
      <article className="summary-card">
        <p>{DASHBOARD_TEXT.summary.total}</p>
        <strong>{summary.totalPredictions}</strong>
      </article>
      <article className="summary-card">
        <p>{DASHBOARD_TEXT.summary.consider}</p>
        <strong>{summary.considerCount}</strong>
      </article>
      <article className="summary-card">
        <p>{DASHBOARD_TEXT.summary.lowQuality}</p>
        <strong>{summary.lowQualityCount}</strong>
      </article>
      <article className="summary-card">
        <p>{DASHBOARD_TEXT.summary.latestRun}</p>
        <strong>{formatRunStatus(summary.latestRun?.status)}</strong>
        <div className="summary-card__meta">
          <span>{summary.lastUpdatedLabel}</span>
          {summary.latestRun?.status ? (
            <StatusBadge
              label={formatRunStatus(summary.latestRun.status)}
              tone={
                summary.latestRun.status === "COMPLETED" ? "success" : "warning"
              }
            />
          ) : null}
        </div>
      </article>
    </section>
  );
}
