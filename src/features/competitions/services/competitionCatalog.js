import { AUTHORIZED_COMPETITION_ORDER } from "../constants/competitionOrder.js";

const competitionOrderIndex = new Map(
  AUTHORIZED_COMPETITION_ORDER.map((key, index) => [key, index]),
);

function getCompetitionKey(competition) {
  return competition?.targetKey ?? competition?.key ?? "";
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

  return [...competitionsByKey.values()].sort(
    (left, right) =>
      competitionOrderIndex.get(getCompetitionKey(left)) -
      competitionOrderIndex.get(getCompetitionKey(right)),
  );
}

export function buildCompetitionCards(competitions, fixtures) {
  const statsByCompetition = new Map();
  const seasonByCompetition = new Map();

  for (const fixture of fixtures) {
    const competitionKey = fixture.competition.key;
    const current = statsByCompetition.get(competitionKey) ?? {
      fixtureCount: 0,
      predictionCount: 0,
    };

    current.fixtureCount += 1;
    current.predictionCount += fixture.prediction ? 1 : 0;

    statsByCompetition.set(competitionKey, current);

    if (Number.isInteger(fixture.competition.season)) {
      seasonByCompetition.set(competitionKey, fixture.competition.season);
    }
  }

  return orderAuthorizedCompetitions(competitions).map((competition) => {
    const competitionKey = getCompetitionKey(competition);
    const stats = statsByCompetition.get(competitionKey) ?? {
      fixtureCount: 0,
      predictionCount: 0,
    };

    return {
      ...competition,
      targetKey: competitionKey,
      season: seasonByCompetition.get(competitionKey) ?? competition.season,
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
