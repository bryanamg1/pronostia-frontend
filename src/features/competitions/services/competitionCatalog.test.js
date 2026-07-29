import { describe, expect, it } from "vitest";

import {
  buildCompetitionCards,
  buildTeamOptions,
  filterFixtures,
  orderAuthorizedCompetitions,
} from "./competitionCatalog.js";

const competitions = [
  {
    id: 39,
    targetKey: "premier-league",
    name: "Premier League",
    country: "England",
    season: 2025,
  },
  {
    id: 40,
    targetKey: "premier-league",
    name: "Premier League",
    country: "England",
    season: 2026,
  },
  {
    id: 140,
    targetKey: "laliga",
    name: "La Liga",
    country: "Spain",
    season: 2026,
  },
];

const fixtures = [
  {
    id: 1,
    competition: {
      key: "premier-league",
      season: 2025,
    },
    homeTeam: {
      key: "100",
      name: "Arsenal",
    },
    awayTeam: {
      key: "200",
      name: "Chelsea",
    },
    prediction: {
      id: 17,
    },
  },
  {
    id: 2,
    competition: {
      key: "premier-league",
      season: 2025,
    },
    homeTeam: {
      key: "300",
      name: "Liverpool",
    },
    awayTeam: {
      key: "200",
      name: "Chelsea",
    },
    prediction: null,
  },
  {
    id: 3,
    competition: {
      key: "laliga",
      season: 2026,
    },
    homeTeam: {
      key: "400",
      name: "Valencia",
    },
    awayTeam: {
      key: "500",
      name: "Sevilla",
    },
    prediction: null,
  },
];

describe("competitionCatalog", () => {
  it("deduplicates authorized competitions by key and prefers the latest season", () => {
    expect(orderAuthorizedCompetitions(competitions)).toEqual([
      {
        id: 140,
        targetKey: "laliga",
        name: "La Liga",
        country: "Spain",
        season: 2026,
      },
      {
        id: 40,
        targetKey: "premier-league",
        name: "Premier League",
        country: "England",
        season: 2026,
      },
    ]);
  });

  it("builds one card per competition key and prefers the fixture season in the current window", () => {
    expect(buildCompetitionCards(competitions, fixtures)).toEqual([
      {
        id: 140,
        targetKey: "laliga",
        name: "La Liga",
        country: "Spain",
        season: 2026,
        fixtureCount: 1,
        predictionCount: 0,
      },
      {
        id: 40,
        targetKey: "premier-league",
        name: "Premier League",
        country: "England",
        season: 2025,
        fixtureCount: 2,
        predictionCount: 1,
      },
    ]);
  });

  it("filters fixtures by team key for both home and away clubs", () => {
    expect(
      filterFixtures(fixtures, {
        competitionKey: "premier-league",
        teamKey: "200",
      }),
    ).toHaveLength(2);
  });

  it("builds unique alphabetic team options inside the selected competition", () => {
    expect(buildTeamOptions(fixtures, "premier-league")).toEqual([
      {
        value: "100",
        label: "Arsenal",
      },
      {
        value: "200",
        label: "Chelsea",
      },
      {
        value: "300",
        label: "Liverpool",
      },
    ]);
  });
});
