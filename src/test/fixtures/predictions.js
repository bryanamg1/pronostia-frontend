export const competitionsDto = [
  {
    id: 140,
    targetKey: "laliga",
    name: "La Liga",
    country: "Spain",
    season: 2026,
  },
  {
    id: 39,
    targetKey: "premier-league",
    name: "Premier League",
    country: "England",
    season: 2026,
  },
  {
    id: 61,
    targetKey: "ligue-1",
    name: "Ligue 1",
    country: "France",
    season: 2026,
  },
  {
    id: 135,
    targetKey: "serie-a-italy",
    name: "Serie A",
    country: "Italy",
    season: 2026,
  },
  {
    id: 78,
    targetKey: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    season: 2026,
  },
  {
    id: 128,
    targetKey: "liga-profesional-arg",
    name: "Liga Profesional Argentina",
    country: "Argentina",
    season: 2026,
  },
  {
    id: 71,
    targetKey: "serie-a-brazil",
    name: "Brasileirao Serie A",
    country: "Brazil",
    season: 2026,
  },
  {
    id: 2,
    targetKey: "uefa-champions-league",
    name: "UEFA Champions League",
    country: "World",
    season: 2026,
  },
  {
    id: 3,
    targetKey: "uefa-europa-league",
    name: "UEFA Europa League",
    country: "World",
    season: 2026,
  },
  {
    id: 13,
    targetKey: "conmebol-libertadores",
    name: "CONMEBOL Libertadores",
    country: "World",
    season: 2026,
  },
  {
    id: 11,
    targetKey: "conmebol-sudamericana",
    name: "CONMEBOL Sudamericana",
    country: "World",
    season: 2026,
  },
];

export const latestRunDto = {
  runId: "daily-2026-07-29",
  runType: "DAILY_SYNC",
  status: "COMPLETED",
  startedAt: "2026-07-29T09:00:00.000Z",
  finishedAt: "2026-07-29T09:10:00.000Z",
  errorCode: null,
};

function mergePrediction(base, overrides = {}) {
  return {
    ...base,
    ...overrides,
    fixture: {
      ...base.fixture,
      ...overrides.fixture,
      competition: {
        ...base.fixture.competition,
        ...overrides.fixture?.competition,
      },
      homeTeam: {
        ...base.fixture.homeTeam,
        ...overrides.fixture?.homeTeam,
      },
      awayTeam: {
        ...base.fixture.awayTeam,
        ...overrides.fixture?.awayTeam,
      },
    },
    model: {
      ...base.model,
      ...overrides.model,
    },
    selection: {
      ...base.selection,
      ...overrides.selection,
    },
    analysis:
      overrides.analysis === null
        ? null
        : {
            ...base.analysis,
            ...overrides.analysis,
            expectedGoals: {
              ...base.analysis.expectedGoals,
              ...overrides.analysis?.expectedGoals,
            },
            probabilities: {
              ...base.analysis.probabilities,
              ...overrides.analysis?.probabilities,
            },
            dataQuality: {
              ...base.analysis.dataQuality,
              ...overrides.analysis?.dataQuality,
            },
          },
    explanation:
      overrides.explanation === null
        ? null
        : {
            ...base.explanation,
            ...overrides.explanation,
          },
  };
}

const basePredictionDto = {
  id: 17,
  fixture: {
    id: 501,
    kickoffAt: "2026-07-29T18:00:00.000Z",
    status: "NS",
    competition: {
      id: 39,
      targetKey: "premier-league",
      name: "Premier League",
      country: "England",
      season: 2026,
    },
    homeTeam: {
      id: 100,
      name: "Arsenal",
    },
    awayTeam: {
      id: 200,
      name: "Chelsea",
    },
  },
  model: {
    version: "v1.4.0",
  },
  selection: {
    market: "MATCH_RESULT",
    value: "HOME",
    modelProbability: 0.58,
    marketProbability: 0.51,
    edgePp: 7.0,
    confidenceScore: 78,
    riskLevel: "MEDIUM",
    recommendation: "CONSIDER",
  },
  analysis: {
    expectedGoals: {
      home: 1.72,
      away: 1.08,
    },
    probabilities: {
      homeWin: 0.58,
      draw: 0.24,
      awayWin: 0.18,
      over25: 0.56,
      under25: 0.44,
      bttsYes: 0.53,
      bttsNo: 0.47,
      doubleChance1X: 0.82,
      doubleChanceX2: 0.42,
      doubleChance12: 0.76,
    },
    dataQuality: {
      status: "SUFFICIENT",
      flags: [],
    },
  },
  explanation: {
    status: "EXPLANATION_READY",
    source: "OPENAI",
    generatedAt: "2026-07-29T09:11:00.000Z",
    summary: "<strong>Arsenal</strong> llega mejor perfilado.",
    supportingFactors: ["xG reciente superior"],
    counterFactors: ["Chelsea puede ajustar presión alta"],
    warnings: ["Confirmar alineaciones oficiales"],
    responsibleUseNotice: "No garantiza resultados.",
  },
  isDailyTop: true,
  createdAt: "2026-07-29T09:10:00.000Z",
  updatedAt: "2026-07-29T09:12:00.000Z",
};

export const predictionDtos = [
  basePredictionDto,
  mergePrediction(basePredictionDto, {
    id: 18,
    fixture: {
      id: 502,
      kickoffAt: "2026-07-30T19:30:00.000Z",
      competition: {
        id: 140,
        targetKey: "laliga",
        name: "La Liga",
        country: "Spain",
      },
      homeTeam: {
        id: 300,
        name: "Real Sociedad",
      },
      awayTeam: {
        id: 400,
        name: "Sevilla",
      },
    },
    selection: {
      value: "UNDER_2_5",
      market: "OVER_UNDER_2_5",
      modelProbability: 0.54,
      marketProbability: null,
      edgePp: null,
      confidenceScore: 63,
      riskLevel: "LOW",
      recommendation: "NO_RECOMMENDATION",
    },
    analysis: {
      dataQuality: {
        status: "LIMITED",
        flags: ["SMALL_SAMPLE"],
      },
    },
    explanation: {
      status: "EXPLANATION_FALLBACK",
      source: "DETERMINISTIC_FALLBACK",
      summary: "La muestra histórica es corta pero consistente.",
      supportingFactors: ["Bloques defensivos compactos"],
      counterFactors: ["Gol temprano puede romper el plan"],
      warnings: ["Mercado sin referencia pública"],
    },
    isDailyTop: false,
  }),
  mergePrediction(basePredictionDto, {
    id: 19,
    fixture: {
      id: 503,
      kickoffAt: "2026-07-29T22:00:00.000Z",
      homeTeam: {
        id: 500,
        name: "Liverpool",
      },
      awayTeam: {
        id: 600,
        name: "Tottenham",
      },
    },
    explanation: null,
  }),
];

export const topPredictionDtos = predictionDtos.slice(0, 2);

export const predictionWithoutExplanationDto = predictionDtos[2];

export const fixtureDtos = [
  {
    id: 501,
    competition: {
      id: 39,
      key: "premier-league",
      name: "Premier League",
      country: "England",
      season: 2026,
    },
    homeTeam: {
      id: 100,
      key: "100",
      name: "Arsenal",
    },
    awayTeam: {
      id: 200,
      key: "200",
      name: "Chelsea",
    },
    kickoffAt: "2026-07-29T18:00:00.000Z",
    status: "NS",
    isHistorical: false,
    prediction: {
      id: 17,
      market: "MATCH_RESULT",
      selection: "HOME",
      recommendation: "CONSIDER",
      confidenceScore: 78,
    },
  },
  {
    id: 502,
    competition: {
      id: 140,
      key: "laliga",
      name: "La Liga",
      country: "Spain",
      season: 2026,
    },
    homeTeam: {
      id: 300,
      key: "300",
      name: "Real Sociedad",
    },
    awayTeam: {
      id: 400,
      key: "400",
      name: "Sevilla",
    },
    kickoffAt: "2026-07-30T19:30:00.000Z",
    status: "NS",
    isHistorical: false,
    prediction: {
      id: 18,
      market: "OVER_UNDER_2_5",
      selection: "UNDER_2_5",
      recommendation: "NO_RECOMMENDATION",
      confidenceScore: 63,
    },
  },
  {
    id: 503,
    competition: {
      id: 39,
      key: "premier-league",
      name: "Premier League",
      country: "England",
      season: 2026,
    },
    homeTeam: {
      id: 500,
      key: "500",
      name: "Liverpool",
    },
    awayTeam: {
      id: 600,
      key: "600",
      name: "Tottenham",
    },
    kickoffAt: "2026-07-29T22:00:00.000Z",
    status: "FT",
    isHistorical: true,
    prediction: null,
  },
  {
    id: 504,
    competition: {
      id: 2,
      key: "uefa-champions-league",
      name: "UEFA Champions League",
      country: "World",
      season: 2026,
    },
    homeTeam: {
      id: 700,
      key: "700",
      name: "FK Crvena Zvezda",
    },
    awayTeam: {
      id: 701,
      key: "701",
      name: "Larne",
    },
    kickoffAt: "2026-07-29T21:00:00.000Z",
    status: "NS",
    isHistorical: false,
    prediction: {
      id: 20,
      market: "MATCH_RESULT",
      selection: "HOME",
      recommendation: "NO_RECOMMENDATION",
      confidenceScore: 41,
    },
  },
];

export function filterPredictionsByCompetition(targetKey = "") {
  if (!targetKey) {
    return predictionDtos;
  }

  return predictionDtos.filter(
    (prediction) => prediction.fixture.competition.targetKey === targetKey,
  );
}

export function filterFixturesByCompetitionAndTeam({
  competitionKey = "",
  teamKey = "",
} = {}) {
  return fixtureDtos.filter((fixture) => {
    if (competitionKey && fixture.competition.key !== competitionKey) {
      return false;
    }

    if (!teamKey) {
      return true;
    }

    return fixture.homeTeam.key === teamKey || fixture.awayTeam.key === teamKey;
  });
}
