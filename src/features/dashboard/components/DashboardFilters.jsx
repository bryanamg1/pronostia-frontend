import { DASHBOARD_TEXT } from "../constants/dashboardText.js";

function renderOptions(options) {
  return options.map((option) => (
    <option key={option.value || "all"} value={option.value}>
      {option.label}
    </option>
  ));
}

export function DashboardFilters({ filters, options, onChange, onClear }) {
  return (
    <section className="filters-panel" aria-labelledby="filters-title">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">
            {DASHBOARD_TEXT.filtersEyebrow}
          </p>
          <h2 id="filters-title">{DASHBOARD_TEXT.filtersTitle}</h2>
          <p>{DASHBOARD_TEXT.filtersDescription}</p>
        </div>
        <button
          className="button button--ghost"
          onClick={onClear}
          type="button"
        >
          {DASHBOARD_TEXT.clearFilters}
        </button>
      </div>
      <div className="filters-grid">
        <label>
          <span>{DASHBOARD_TEXT.filterLabels.date}</span>
          <select
            value={filters.date}
            onChange={(event) => onChange("date", event.target.value)}
          >
            {renderOptions(options.date)}
          </select>
        </label>
        <label>
          <span>{DASHBOARD_TEXT.filterLabels.competition}</span>
          <select
            value={filters.competition}
            onChange={(event) => onChange("competition", event.target.value)}
          >
            {renderOptions(options.competition)}
          </select>
        </label>
        <label>
          <span>{DASHBOARD_TEXT.filterLabels.market}</span>
          <select
            value={filters.market}
            onChange={(event) => onChange("market", event.target.value)}
          >
            {renderOptions(options.market)}
          </select>
        </label>
        <label>
          <span>{DASHBOARD_TEXT.filterLabels.recommendation}</span>
          <select
            value={filters.recommendation}
            onChange={(event) => onChange("recommendation", event.target.value)}
          >
            {renderOptions(options.recommendation)}
          </select>
        </label>
        <label>
          <span>{DASHBOARD_TEXT.filterLabels.dataQuality}</span>
          <select
            value={filters.dataQuality}
            onChange={(event) => onChange("dataQuality", event.target.value)}
          >
            {renderOptions(options.dataQuality)}
          </select>
        </label>
        <label>
          <span>{DASHBOARD_TEXT.filterLabels.explanationSource}</span>
          <select
            value={filters.explanationSource}
            onChange={(event) =>
              onChange("explanationSource", event.target.value)
            }
          >
            {renderOptions(options.explanationSource)}
          </select>
        </label>
      </div>
    </section>
  );
}
