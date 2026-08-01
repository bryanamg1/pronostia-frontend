const MARKET_LABELS = {
  MATCH_RESULT: "Resultado final",
  OVER_UNDER_2_5: "Goles totales",
  BOTH_TEAMS_TO_SCORE: "Ambos equipos marcan",
  DOUBLE_CHANCE: "Doble oportunidad",
};

const SELECTION_LABELS = {
  MATCH_RESULT: {
    HOME: "Victoria local",
    DRAW: "Empate",
    AWAY: "Victoria visitante",
  },
  OVER_UNDER_2_5: {
    OVER_2_5: "Más de 2,5 goles",
    UNDER_2_5: "Menos de 2,5 goles",
  },
  BOTH_TEAMS_TO_SCORE: {
    YES: "Ambos equipos marcan",
    NO: "Ambos equipos no marcan",
  },
  DOUBLE_CHANCE: {
    HOME_OR_DRAW: "Local o empate (1X)",
    DRAW_OR_AWAY: "Visitante o empate (X2)",
    HOME_OR_AWAY: "Local o visitante (12)",
  },
};

const RECOMMENDATION_LABELS = {
  CONSIDER: "Recomendación oficial disponible",
  NO_RECOMMENDATION: "Sin recomendación oficial",
};

const EXPLANATION_STATUS_LABELS = {
  EXPLANATION_PENDING: "Preparando explicación",
  EXPLANATION_READY: "Explicación lista",
  EXPLANATION_FALLBACK: "Resumen disponible",
  EXPLANATION_UNAVAILABLE: "Explicación no disponible por falta de datos",
};

const EXPLANATION_SOURCE_LABELS = {
  OPENAI: "Explicación asistida por IA",
  DETERMINISTIC_FALLBACK: "Resumen estadístico automático",
};

const DATA_QUALITY_LABELS = {
  LIMITED: "Limitada",
  SUFFICIENT: "Suficiente",
  INSUFFICIENT: "Insuficiente",
  INVALID: "No válida",
};

const DATA_QUALITY_FLAG_LABELS = {
  LOW_SAMPLE_HOME: "Muestra histórica limitada del equipo local.",
  LOW_SAMPLE_AWAY: "Muestra histórica limitada del equipo visitante.",
  MISSING_HOME_SPLIT: "Faltan datos suficientes como local.",
  MISSING_AWAY_SPLIT: "Faltan datos suficientes como visitante.",
};

const RISK_LABELS = {
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
};

export function getMarketLabel(value) {
  return MARKET_LABELS[value] ?? value ?? "No disponible";
}

export function getSelectionLabel(value, market = null) {
  if (market && SELECTION_LABELS[market]?.[value]) {
    return SELECTION_LABELS[market][value];
  }

  const entry = Object.values(SELECTION_LABELS).find((labels) => labels[value]);
  return entry?.[value] ?? value ?? "No disponible";
}

export function getRecommendationLabel(value) {
  return RECOMMENDATION_LABELS[value] ?? value ?? "No disponible";
}

export function getExplanationStatusLabel(value) {
  return EXPLANATION_STATUS_LABELS[value] ?? value ?? "No disponible";
}

export function getExplanationSourceLabel(value) {
  return EXPLANATION_SOURCE_LABELS[value] ?? value ?? "No disponible";
}

export function getExplanationPresentationLabel(status, source) {
  if (status === "EXPLANATION_PENDING") {
    return getExplanationStatusLabel(status);
  }

  if (status === "EXPLANATION_UNAVAILABLE") {
    return getExplanationStatusLabel(status);
  }

  if (source) {
    return getExplanationSourceLabel(source);
  }

  return getExplanationStatusLabel(status);
}

export function getDataQualityLabel(value) {
  return DATA_QUALITY_LABELS[value] ?? value ?? "No disponible";
}

export function getDataQualityFlagLabel(value) {
  return DATA_QUALITY_FLAG_LABELS[value] ?? value ?? "No disponible";
}

export function getRiskLabel(value) {
  return RISK_LABELS[value] ?? value ?? "No disponible";
}

export function getConfidenceBandLabel(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "No disponible";
  }

  if (value <= 49) {
    return "Baja";
  }

  if (value <= 69) {
    return "Media";
  }

  if (value <= 84) {
    return "Alta";
  }

  return "Muy alta";
}
