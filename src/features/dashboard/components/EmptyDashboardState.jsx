import { UI_TEXT } from "../../../constants/uiText.js";
import { DASHBOARD_TEXT } from "../constants/dashboardText.js";

function buildMetadata({ consultedWindow, latestRunStatus, lastUpdated }) {
  return [
    consultedWindow
      ? {
          label: DASHBOARD_TEXT.emptyStateMeta.window,
          value: consultedWindow,
        }
      : null,
    latestRunStatus
      ? {
          label: DASHBOARD_TEXT.emptyStateMeta.latestRun,
          value: latestRunStatus,
        }
      : null,
    lastUpdated
      ? {
          label: DASHBOARD_TEXT.emptyStateMeta.lastUpdated,
          value: lastUpdated,
        }
      : null,
  ].filter(Boolean);
}

export function EmptyDashboardState({
  consultedWindow,
  latestRunStatus,
  lastUpdated,
  onRefresh,
}) {
  const metadata = buildMetadata({
    consultedWindow,
    latestRunStatus,
    lastUpdated,
  });

  return (
    <section
      aria-labelledby="empty-dashboard-title"
      aria-live="polite"
      className="info-state info-state--warning info-state--empty-dashboard"
    >
      <div>
        <p className="section-heading__eyebrow">
          {DASHBOARD_TEXT.emptyEyebrow}
        </p>
        <h2 id="empty-dashboard-title">{DASHBOARD_TEXT.emptyDashboardTitle}</h2>
        <p>{DASHBOARD_TEXT.emptyDashboardDescription}</p>
      </div>

      {metadata.length > 0 ? (
        <dl className="info-state__meta">
          {metadata.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="info-state__actions">
        <button className="button" onClick={onRefresh} type="button">
          {UI_TEXT.actions.refreshDashboard}
        </button>
      </div>
    </section>
  );
}
