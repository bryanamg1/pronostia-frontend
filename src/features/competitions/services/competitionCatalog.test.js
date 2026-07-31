import { describe, expect, it } from "vitest";

import {
  buildCompetitionCards,
  buildCompetitionGeographyOptions,
  buildCompetitionTypeOptions,
  buildTeamOptions,
  countUniqueCompetitionKeys,
  filterCompetitionCards,
  filterFixtures,
  groupCompetitionCards,
  orderAuthorizedCompetitions,
} from "./competitionCatalog.js";

const competitions = [
  {
    id: null,
    key: "premier-league",
    targetKey: "premier-league",
    name: "Premier League",
    country: "England",
    region: null,
    type: "DOMESTIC_LEAGUE",
    availabilityStatus: "PARTIAL",
    season: 2025,
    displayOrder: 1,
  },
  {
    id: null,
    key: "premier-league",
    targetKey: "premier-league",
    name: "Premier League",
    country: "England",
    region: null,
    type: "DOMESTIC_LEAGUE",
    availabilityStatus: "PARTIAL",
    season: 2026,
    displayOrder: 1,
  },
  {
    id: null,
    key: "laliga",
    targetKey: "laliga",
    name: "LaLiga",
    country: "Spain",
    region: null,
    type: "DOMESTIC_LEAGUE",
    availabilityStatus: "PARTIAL",
    season: 2026,
    displayOrder: 0,
  },
  {
    id: null,
    key: "copa-del-rey",
    targetKey: "copa-del-rey",
    name: "Copa del Rey",
    country: "Spain",
    region: null,
    type: "DOMESTIC_CUP",
    availabilityStatus: "PARTIAL",
    season: 2025,
    displayOrder: 7,
  },
  {
    id: null,
    key: "uefa-europa-league",
    targetKey: "uefa-europa-league",
    name: "UEFA Europa League",
    country: null,
    region: "Europe",
    type: "CONTINENTAL_CUP",
    availabilityStatus: "PARTIAL",
    season: 2026,
    displayOrder: 15,
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
    isHistorical: false,
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
    isHistorical: true,
  },
  {
    id: 3,
    competition: {
      key: "copa-del-rey",
      season: 2025,
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
    isHistorical: true,
  },
];

describe("competitionCatalog", () => {
  it("deduplicates authorized competitions by key, localizes geography, and preserves public order", () => {
    expect(orderAuthorizedCompetitions(competitions)).toEqual([
      expect.objectContaining({
        targetKey: "laliga",
        name: "LaLiga",
        country: "España",
        type: "DOMESTIC_LEAGUE",
      }),
      expect.objectContaining({
        targetKey: "premier-league",
        name: "Premier League",
        country: "Inglaterra",
        type: "DOMESTIC_LEAGUE",
      }),
      expect.objectContaining({
        targetKey: "copa-del-rey",
        name: "Copa del Rey",
        country: "España",
        type: "DOMESTIC_CUP",
      }),
      expect.objectContaining({
        targetKey: "uefa-europa-league",
        name: "UEFA Europa League",
        country: "Europa",
        type: "CONTINENTAL_CUP",
      }),
    ]);
  });

  it("builds one card per competition key and flags historical-only competitions", () => {
    const cards = buildCompetitionCards(competitions, fixtures);

    expect(cards).toEqual([
      expect.objectContaining({
        targetKey: "laliga",
        fixtureCount: 0,
        predictionCount: 0,
      }),
      expect.objectContaining({
        targetKey: "premier-league",
        season: 2025,
        fixtureCount: 2,
        predictionCount: 1,
        historicalFixtureCount: 1,
        hasHistoricalDataOnly: false,
      }),
      expect.objectContaining({
        targetKey: "copa-del-rey",
        season: 2025,
        fixtureCount: 1,
        predictionCount: 0,
        historicalFixtureCount: 1,
        hasHistoricalDataOnly: true,
      }),
      expect.objectContaining({
        targetKey: "uefa-europa-league",
        fixtureCount: 0,
      }),
    ]);
    expect(countUniqueCompetitionKeys(cards)).toBe(cards.length);
  });

  it("groups competition cards into the three public sections", () => {
    const groups = groupCompetitionCards(
      buildCompetitionCards(competitions, fixtures),
    );

    expect(groups).toEqual([
      expect.objectContaining({
        key: "domesticLeagues",
        title: "Ligas nacionales",
      }),
      expect.objectContaining({
        key: "domesticCups",
        title: "Copas nacionales",
      }),
      expect.objectContaining({
        key: "continentalCups",
        title: "Competiciones internacionales",
      }),
    ]);
  });

  it("filters competition cards by type and country or region", () => {
    const cards = buildCompetitionCards(competitions, fixtures);

    expect(
      filterCompetitionCards(cards, {
        competitionType: "DOMESTIC_CUP",
        countryRegion: "Spain",
      }),
    ).toEqual([
      expect.objectContaining({
        targetKey: "copa-del-rey",
      }),
    ]);
    expect(
      filterCompetitionCards(cards, {
        competitionType: "CONTINENTAL_CUP",
        countryRegion: "Europe",
      }),
    ).toEqual([
      expect.objectContaining({
        targetKey: "uefa-europa-league",
      }),
    ]);
  });

  it("builds deterministic type and geography options", () => {
    const cards = buildCompetitionCards(competitions, fixtures);

    expect(buildCompetitionTypeOptions()).toEqual([
      {
        value: "",
        label: "Todas las categorías",
      },
      {
        value: "DOMESTIC_LEAGUE",
        label: "Liga nacional",
      },
      {
        value: "DOMESTIC_CUP",
        label: "Copa nacional",
      },
      {
        value: "CONTINENTAL_CUP",
        label: "Competición internacional",
      },
    ]);
    expect(buildCompetitionGeographyOptions(cards)).toEqual([
      {
        value: "",
        label: "Todos los países y regiones",
      },
      {
        value: "Spain",
        label: "España",
      },
      {
        value: "England",
        label: "Inglaterra",
      },
      {
        value: "Europe",
        label: "Europa",
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

  it("counts unique competition keys deterministically even with repeated seasons", () => {
    expect(countUniqueCompetitionKeys(competitions)).toBe(4);
  });
});
