import { COMPETITION_TEXT } from "../constants/competitionText.js";

function renderOptions(options) {
  return options.map((option) => (
    <option key={option.value || "all"} value={option.value}>
      {option.label}
    </option>
  ));
}

export function CompetitionFiltersPanel({
  typeOptions = [],
  selectedType = "",
  onTypeChange = () => undefined,
  showTypeSelect = false,
  geographyOptions = [],
  selectedGeography = "",
  onGeographyChange = () => undefined,
  showGeographySelect = false,
  competitionOptions,
  selectedCompetition,
  onCompetitionChange,
  teamOptions,
  selectedTeam,
  onTeamChange,
  onClear,
  teamDisabled = false,
  showCompetitionSelect = true,
}) {
  return (
    <section
      className="filters-panel"
      aria-labelledby="competition-filters-title"
    >
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">
            {COMPETITION_TEXT.filtersTitle}
          </p>
          <h2 id="competition-filters-title">
            {COMPETITION_TEXT.filtersTitle}
          </h2>
          <p>{COMPETITION_TEXT.filtersDescription}</p>
        </div>
        <button
          className="button button--ghost"
          onClick={onClear}
          type="button"
        >
          {COMPETITION_TEXT.clearFilters}
        </button>
      </div>
      <div className="filters-grid filters-grid--competition">
        {showTypeSelect ? (
          <label>
            <span>{COMPETITION_TEXT.typeLabel}</span>
            <select
              value={selectedType}
              onChange={(event) => onTypeChange(event.target.value)}
            >
              {renderOptions(typeOptions)}
            </select>
          </label>
        ) : null}
        {showGeographySelect ? (
          <label>
            <span>{COMPETITION_TEXT.geographyLabel}</span>
            <select
              value={selectedGeography}
              onChange={(event) => onGeographyChange(event.target.value)}
            >
              {renderOptions(geographyOptions)}
            </select>
          </label>
        ) : null}
        {showCompetitionSelect ? (
          <label>
            <span>{COMPETITION_TEXT.competitionLabel}</span>
            <select
              value={selectedCompetition}
              onChange={(event) => onCompetitionChange(event.target.value)}
            >
              {renderOptions(competitionOptions)}
            </select>
          </label>
        ) : null}
        <label>
          <span>{COMPETITION_TEXT.teamLabel}</span>
          <select
            value={selectedTeam}
            onChange={(event) => onTeamChange(event.target.value)}
            disabled={teamDisabled}
          >
            {renderOptions(teamOptions)}
          </select>
        </label>
      </div>
    </section>
  );
}
