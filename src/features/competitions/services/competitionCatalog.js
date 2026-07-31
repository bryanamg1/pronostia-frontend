import { AUTHORIZED_COMPETITION_ORDER } from "../constants/competitionOrder.js";
import { COMPETITION_DEFINITIONS } from "../constants/competitionDefinition.js";
import { getCompetitionPresentation } from "../constants/competitionPresentation.js";
import { COMPETITION_TEXT } from "../constants/competitionText.js";

const competitionOrderIndex = new Map(
  AUTHORIZED_COMPETITION_ORDER.map((key, index) => [key, index]),
);

const orderedGroupKeys = ["domesticLeagues", "domesticCups", "continentalCups"];
const countryValues = new Set(
  COMPETITION_DEFINITIONS.map((competition) => competition.countryValue).filter(
    Boolean,
  ),
);
const regionValues = new Set(
  COMPETITION_DEFINITIONS.map((competition) => competition.regionValue).filter(
    Boolean,
  ),
);

function sanitizeText(value) {
  return typeof value === "string" ? value : null;
}

function sanitizeNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function getCompetitionKey(competition) {
  return competition?.targetKey ?? competition?.key ?? "";
}

function getCompetitionMetadata(competition) {
  return getCompetitionPresentation(getCompetitionKey(competition));
}

function getCompetitionDisplayName(competition) {
  const metadata = getCompetitionMetadata(competition);

  return (
    metadata?.displayName ??
    sanitizeText(competition?.name) ??
    COMPETITION_TEXT.unavailableValue
  );
}

function getCompetitionType(competition) {
  const metadata = getCompetitionMetadata(competition);

  return sanitizeText(competition?.type) ?? metadata?.type ?? "CONTINENTAL_CUP";
}

function getCompetitionAvailabilityStatus(competition) {
  return sanitizeText(competition?.availabilityStatus) ?? "INCONCLUSIVE";
}

function getCompetitionCountryValue(competition) {
  const metadata = getCompetitionMetadata(competition);

  return (
    sanitizeText(competition?.countryValue) ??
    sanitizeText(competition?.country) ??
    metadata?.countryValue ??
    null
  );
}

function getCompetitionRegionValue(competition) {
  const metadata = getCompetitionMetadata(competition);

  return (
    sanitizeText(competition?.regionValue) ??
    sanitizeText(competition?.region) ??
    metadata?.regionValue ??
    null
  );
}

function getCompetitionGeographyLabel(competition) {
  const metadata = getCompetitionMetadata(competition);

  return (
    metadata?.geographyLabel ??
    getCompetitionCountryValue(competition) ??
    getCompetitionRegionValue(competition) ??
    COMPETITION_TEXT.unavailableValue
  );
}

function getCompetitionDisplayOrder(competition) {
  return (
    competition?.displayOrder ??
    getCompetitionMetadata(competition)?.displayOrder ??
    competitionOrderIndex.get(getCompetitionKey(competition)) ??
    Number.MAX_SAFE_INTEGER
  );
}

function getSeasonValue(competition) {
  return Number.isInteger(competition?.season) ? competition.season : -1;
}

function pickPreferredCompetition(current, candidate) {
  if (!current) {
    return candidate;
  }

  if (getSeasonValue(candidate) > getSeasonValue(current)) {
    return candidate;
  }

  return current;
}

function buildCompetitionViewModel(competition) {
  const metadata = getCompetitionMetadata(competition);
  const competitionType = getCompetitionType(competition);
  const availabilityStatus = getCompetitionAvailabilityStatus(competition);

  return {
    ...competition,
    key: getCompetitionKey(competition),
    targetKey: getCompetitionKey(competition),
    name: getCompetitionDisplayName(competition),
    country: getCompetitionGeographyLabel(competition),
    countryValue: getCompetitionCountryValue(competition),
    region: getCompetitionGeographyLabel(competition),
    regionValue: getCompetitionRegionValue(competition),
    type: competitionType,
    typeLabel:
      metadata?.typeLabel ??
      COMPETITION_TEXT.typeLabels[competitionType] ??
      competitionType,
    groupKey: metadata?.groupKey ?? "continentalCups",
    groupLabel:
      COMPETITION_TEXT.groupLabels[metadata?.groupKey] ??
      COMPETITION_TEXT.groupLabels.continentalCups,
    availabilityStatus,
    availabilityLabel:
      COMPETITION_TEXT.availabilityLabels[availabilityStatus] ??
      COMPETITION_TEXT.unavailableValue,
    displayOrder: getCompetitionDisplayOrder(competition),
    isEnabled: competition?.isEnabled !== false,
  };
}

function createEmptyCompetitionStats() {
  return {
    fixtureCount: 0,
    predictionCount: 0,
    historicalFixtureCount: 0,
    hasHistoricalDataOnly: false,
    season: null,
  };
}

function readEmbeddedCompetitionStats(competition) {
  const fixtureCount = sanitizeNumber(competition?.fixtureCount);
  const predictionCount = sanitizeNumber(competition?.predictionCount);
  const historicalFixtureCount = sanitizeNumber(
    competition?.historicalFixtureCount,
  );

  if (
    fixtureCount === null &&
    predictionCount === null &&
    historicalFixtureCount === null
  ) {
    return null;
  }

  return {
    fixtureCount: fixtureCount ?? 0,
    predictionCount: predictionCount ?? 0,
    historicalFixtureCount: historicalFixtureCount ?? 0,
    season: Number.isInteger(competition?.season) ? competition.season : null,
    hasHistoricalDataOnly:
      typeof competition?.hasHistoricalDataOnly === "boolean"
        ? competition.hasHistoricalDataOnly
        : fixtureCount !== null &&
          historicalFixtureCount !== null &&
          fixtureCount > 0 &&
          fixtureCount === historicalFixtureCount,
  };
}

function getPreferredFixtureSeason(fixtures) {
  return fixtures.reduce((latestSeason, fixture) => {
    if (!Number.isInteger(fixture.competition?.season)) {
      return latestSeason;
    }

    if (latestSeason === null) {
      return fixture.competition.season;
    }

    return Math.max(latestSeason, fixture.competition.season);
  }, null);
}

function buildCompetitionStats(fixtures) {
  const statsByCompetition = new Map();
  const fixturesByCompetition = new Map();

  for (const fixture of fixtures) {
    const competitionKey = fixture.competition?.key;

    if (!competitionKey) {
      continue;
    }

    const currentFixtures = fixturesByCompetition.get(competitionKey) ?? [];
    currentFixtures.push(fixture);
    fixturesByCompetition.set(competitionKey, currentFixtures);
  }

  for (const [competitionKey, competitionFixtures] of fixturesByCompetition) {
    const preferredSeason = getPreferredFixtureSeason(competitionFixtures);
    const stats = createEmptyCompetitionStats();

    stats.season = preferredSeason;

    for (const fixture of competitionFixtures) {
      if (
        preferredSeason !== null &&
        fixture.competition?.season !== preferredSeason
      ) {
        continue;
      }

      stats.fixtureCount += 1;
      stats.predictionCount += fixture.prediction ? 1 : 0;
      stats.historicalFixtureCount += fixture.isHistorical ? 1 : 0;
    }

    stats.hasHistoricalDataOnly =
      stats.fixtureCount > 0 &&
      stats.fixtureCount === stats.historicalFixtureCount;

    statsByCompetition.set(competitionKey, stats);
  }

  return statsByCompetition;
}

function matchesCompetitionCardFilters(
  competition,
  { competitionType = "", countryRegion = "" } = {},
) {
  if (competitionType && competition.type !== competitionType) {
    return false;
  }

  if (!countryRegion) {
    return true;
  }

  return (
    competition.countryValue === countryRegion ||
    competition.regionValue === countryRegion
  );
}

export function countUniqueCompetitionKeys(competitions) {
  return new Set(
    competitions.map((competition) => getCompetitionKey(competition)),
  ).size;
}

export function orderAuthorizedCompetitions(competitions) {
  const competitionsByKey = new Map();

  for (const competition of competitions) {
    const competitionKey = getCompetitionKey(competition);

    if (!competitionOrderIndex.has(competitionKey)) {
      continue;
    }

    competitionsByKey.set(
      competitionKey,
      pickPreferredCompetition(
        competitionsByKey.get(competitionKey),
        competition,
      ),
    );
  }

  return [...competitionsByKey.values()]
    .sort(
      (left, right) =>
        competitionOrderIndex.get(getCompetitionKey(left)) -
        competitionOrderIndex.get(getCompetitionKey(right)),
    )
    .map(buildCompetitionViewModel);
}

export function buildCompetitionCards(competitions, fixtures) {
  const statsByCompetition = buildCompetitionStats(fixtures);

  return orderAuthorizedCompetitions(competitions).map((competition) => {
    const competitionKey = getCompetitionKey(competition);
    const embeddedStats = readEmbeddedCompetitionStats(competition);
    const stats =
      embeddedStats ??
      statsByCompetition.get(competitionKey) ??
      createEmptyCompetitionStats();

    return {
      ...competition,
      season: stats.season ?? competition.season ?? null,
      fixtureCount: stats.fixtureCount,
      predictionCount: stats.predictionCount,
      historicalFixtureCount: stats.historicalFixtureCount,
      hasHistoricalDataOnly: stats.hasHistoricalDataOnly ?? false,
    };
  });
}

export function groupCompetitionCards(competitionCards) {
  const cardsByGroup = new Map(
    orderedGroupKeys.map((groupKey) => [
      groupKey,
      {
        key: groupKey,
        title: COMPETITION_TEXT.groupLabels[groupKey],
        items: [],
      },
    ]),
  );

  for (const card of competitionCards) {
    const group = cardsByGroup.get(card.groupKey);

    if (group) {
      group.items.push(card);
    }
  }

  return orderedGroupKeys
    .map((groupKey) => cardsByGroup.get(groupKey))
    .filter((group) => group.items.length > 0);
}

export function filterCompetitionCards(competitionCards, filters = {}) {
  return competitionCards.filter((competition) =>
    matchesCompetitionCardFilters(competition, filters),
  );
}

export function buildCompetitionTypeOptions() {
  return [
    {
      value: "",
      label: COMPETITION_TEXT.allTypes,
    },
    {
      value: "DOMESTIC_LEAGUE",
      label: COMPETITION_TEXT.typeLabels.DOMESTIC_LEAGUE,
    },
    {
      value: "DOMESTIC_CUP",
      label: COMPETITION_TEXT.typeLabels.DOMESTIC_CUP,
    },
    {
      value: "CONTINENTAL_CUP",
      label: COMPETITION_TEXT.typeLabels.CONTINENTAL_CUP,
    },
  ];
}

export function buildCompetitionGeographyOptions(competitionCards) {
  const orderedValues = [];
  const labelsByValue = new Map();

  for (const competition of competitionCards) {
    const value = competition.countryValue ?? competition.regionValue;

    if (!value || labelsByValue.has(value)) {
      continue;
    }

    orderedValues.push(value);
    labelsByValue.set(value, competition.country);
  }

  return [
    {
      value: "",
      label: COMPETITION_TEXT.allGeographies,
    },
    ...orderedValues.map((value) => ({
      value,
      label: labelsByValue.get(value) ?? value,
    })),
  ];
}

export function buildCompatibleCompetitionGeographyOptions(
  competitionType = "",
) {
  const orderedValues = [];
  const labelsByValue = new Map();

  for (const competition of COMPETITION_DEFINITIONS) {
    if (competitionType && competition.type !== competitionType) {
      continue;
    }

    const value = competition.countryValue ?? competition.regionValue;

    if (!value || labelsByValue.has(value)) {
      continue;
    }

    orderedValues.push(value);
    labelsByValue.set(value, competition.geographyLabel);
  }

  return [
    {
      value: "",
      label: COMPETITION_TEXT.allGeographies,
    },
    ...orderedValues.map((value) => ({
      value,
      label: labelsByValue.get(value) ?? value,
    })),
  ];
}

export function splitCompetitionGeographyFilter(countryRegion = "") {
  if (!countryRegion) {
    return {
      country: "",
      region: "",
    };
  }

  if (countryValues.has(countryRegion)) {
    return {
      country: countryRegion,
      region: "",
    };
  }

  if (regionValues.has(countryRegion)) {
    return {
      country: "",
      region: countryRegion,
    };
  }

  return {
    country: "",
    region: "",
  };
}

export function buildCompetitionRequestFilters({
  competitionType = "",
  countryRegion = "",
} = {}) {
  const geographyFilters = splitCompetitionGeographyFilter(countryRegion);

  return {
    type: competitionType,
    country: geographyFilters.country,
    region: geographyFilters.region,
  };
}

export function isCompetitionGeographyCompatible({
  competitionType = "",
  countryRegion = "",
} = {}) {
  if (!countryRegion) {
    return true;
  }

  return buildCompatibleCompetitionGeographyOptions(competitionType).some(
    (option) => option.value === countryRegion,
  );
}

export function findCompetitionByKey(competitions, competitionKey) {
  return (
    competitions.find(
      (competition) => getCompetitionKey(competition) === competitionKey,
    ) ?? null
  );
}

export function filterFixtures(
  fixtures,
  { competitionKey = "", teamKey = "" },
) {
  return fixtures.filter((fixture) => {
    if (competitionKey && fixture.competition.key !== competitionKey) {
      return false;
    }

    if (!teamKey) {
      return true;
    }

    return fixture.homeTeam.key === teamKey || fixture.awayTeam.key === teamKey;
  });
}

export function buildTeamOptions(fixtures, competitionKey) {
  if (!competitionKey) {
    return [];
  }

  const teamsByKey = new Map();

  for (const fixture of fixtures) {
    if (fixture.competition.key !== competitionKey) {
      continue;
    }

    teamsByKey.set(fixture.homeTeam.key, fixture.homeTeam);
    teamsByKey.set(fixture.awayTeam.key, fixture.awayTeam);
  }

  return [...teamsByKey.values()]
    .sort((left, right) => left.name.localeCompare(right.name, "es"))
    .map((team) => ({
      value: team.key,
      label: team.name,
    }));
}
