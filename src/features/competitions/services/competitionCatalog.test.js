import { describe, expect, it } from "vitest";

import {
  buildCompetitionCards,
  buildTeamOptions,
  countUniqueCompetitionKeys,
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
  {
    id: 141,
    targetKey: "laliga",
    name: "La Liga",
    country: "Spain",
    season: 2024,
  },
  {
    id: 3,
    targetKey: "uefa-europa-league",
    name: "UEFA Europa League",
    country: "World",
    season: 2025,
  },
  {
    id: 30,
    targetKey: "uefa-europa-league",
    name: "UEFA Europa League",
    country: "World",
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
        country: "España",
        season: 2026,
      },
      {
        id: 40,
        targetKey: "premier-league",
        name: "Premier League",
        country: "Inglaterra",
        season: 2026,
      },
      {
        id: 30,
        targetKey: "uefa-europa-league",
        name: "UEFA Europa League",
        country: "Europa",
        season: 2026,
      },
    ]);
  });

  it("builds one card per competition key, localizes regions, and prefers the fixture season in the current window", () => {
    const cards = buildCompetitionCards(competitions, fixtures);

    expect(cards).toEqual([
      {
        id: 140,
        targetKey: "laliga",
        name: "La Liga",
        country: "España",
        season: 2026,
        fixtureCount: 1,
        predictionCount: 0,
      },
      {
        id: 40,
        targetKey: "premier-league",
        name: "Premier League",
        country: "Inglaterra",
        season: 2025,
        fixtureCount: 2,
        predictionCount: 1,
      },
      {
        id: 30,
        targetKey: "uefa-europa-league",
        name: "UEFA Europa League",
        country: "Europa",
        season: 2026,
        fixtureCount: 0,
        predictionCount: 0,
      },
    ]);
    expect(countUniqueCompetitionKeys(cards)).toBe(cards.length);
  });

  it("counts only fixtures from the preferred season when a competition appears in multiple seasons", () => {
    const cards = buildCompetitionCards(competitions, [
      ...fixtures,
      {
        id: 4,
        competition: {
          key: "premier-league",
          season: 2026,
        },
        homeTeam: {
          key: "700",
          name: "Brighton",
        },
        awayTeam: {
          key: "800",
          name: "Everton",
        },
        prediction: {
          id: 21,
        },
      },
    ]);

    expect(cards.find((card) => card.targetKey === "premier-league")).toEqual(
      expect.objectContaining({
        season: 2026,
        fixtureCount: 1,
        predictionCount: 1,
      }),
    );
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

  it("counts unique competition keys deterministically even with repeated seasons", () => {
    expect(countUniqueCompetitionKeys(competitions)).toBe(3);
  });
});
