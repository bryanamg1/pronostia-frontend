import { AUTHORIZED_COMPETITION_ORDER } from "../constants/competitionOrder.js";
import { getCompetitionPresentation } from "../constants/competitionPresentation.js";
import { COMPETITION_TEXT } from "../constants/competitionText.js";

const competitionOrderIndex = new Map(
  AUTHORIZED_COMPETITION_ORDER.map((key, index) => [key, index]),
);

function getCompetitionKey(competition) {
  return competition?.targetKey ?? competition?.key ?? "";
}

function getCompetitionDisplayRegion(competition) {
  const competitionKey = getCompetitionKey(competition);
  const presentation = getCompetitionPresentation(competitionKey);

  return (
    presentation?.regionLabel ??
    competition?.country ??
    COMPETITION_TEXT.unavailableValue
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
  return {
    ...competition,
    targetKey: getCompetitionKey(competition),
    country: getCompetitionDisplayRegion(competition),
  };
}

function createEmptyCompetitionStats() {
  return {
    fixtureCount: 0,
    predictionCount: 0,
    season: null,
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
    }

    statsByCompetition.set(competitionKey, stats);
  }

  return statsByCompetition;
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
    const stats =
      statsByCompetition.get(competitionKey) ?? createEmptyCompetitionStats();

    return {
      ...buildCompetitionViewModel(competition),
      season: stats.season ?? competition.season ?? null,
      fixtureCount: stats.fixtureCount,
      predictionCount: stats.predictionCount,
    };
  });
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
