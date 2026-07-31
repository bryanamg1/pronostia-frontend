export const DASHBOARD_FILTER_PARAMS = {
  date: "date",
  competitionType: "competitionType",
  competitionRegion: "competitionRegion",
  competition: "competition",
  team: "team",
  market: "market",
  recommendation: "recommendation",
  dataQuality: "dataQuality",
  explanationSource: "explanationSource",
};

export const DASHBOARD_FILTER_DEFAULTS = {
  date: "",
  competitionType: "",
  competitionRegion: "",
  competition: "",
  team: "",
  market: "",
  recommendation: "",
  dataQuality: "",
  explanationSource: "",
};

export function readDashboardFilters(searchParams) {
  return Object.fromEntries(
    Object.entries(DASHBOARD_FILTER_PARAMS).map(([key, param]) => [
      key,
      searchParams.get(param) ?? DASHBOARD_FILTER_DEFAULTS[key],
    ]),
  );
}

export function buildUpdatedSearchParams(searchParams, updates) {
  const next = new URLSearchParams(searchParams);

  for (const [key, value] of Object.entries(updates)) {
    const param = DASHBOARD_FILTER_PARAMS[key];

    if (!param) {
      continue;
    }

    if (!value) {
      next.delete(param);
      continue;
    }

    next.set(param, value);
  }

  return next;
}

export function clearDashboardFilters(searchParams, keys) {
  const next = new URLSearchParams(searchParams);
  const targetKeys = keys ?? Object.keys(DASHBOARD_FILTER_PARAMS);

  for (const key of targetKeys) {
    const param = DASHBOARD_FILTER_PARAMS[key];

    if (param) {
      next.delete(param);
    }
  }

  return next;
}
