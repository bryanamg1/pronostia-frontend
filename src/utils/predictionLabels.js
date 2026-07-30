const MARKET_LABELS = {
  MATCH_RESULT: "1X2",
  OVER_UNDER_2_5: "Over/Under 2.5",
  BOTH_TEAMS_TO_SCORE: "BTTS",
  DOUBLE_CHANCE: "Doble oportunidad",
};

const SELECTION_LABELS = {
  HOME: "Local",
  DRAW: "Empate",
  AWAY: "Visitante",
  OVER_2_5: "Mas de 2.5",
  UNDER_2_5: "Menos de 2.5",
  YES: "Si",
  NO: "No",
  HOME_OR_DRAW: "Local o empate",
  DRAW_OR_AWAY: "Empate o visitante",
  HOME_OR_AWAY: "Local o visitante",
};

const RECOMMENDATION_LABELS = {
  CONSIDER: "Considerar",
  NO_RECOMMENDATION: "Sin recomendacion",
};

const EXPLANATION_STATUS_LABELS = {
  EXPLANATION_PENDING: "Pendiente",
  EXPLANATION_READY: "Disponible",
  EXPLANATION_FALLBACK: "Fallback",
};

const EXPLANATION_SOURCE_LABELS = {
  OPENAI: "OpenAI",
  DETERMINISTIC_FALLBACK: "Fallback determinista",
};

export function getMarketLabel(value) {
  return MARKET_LABELS[value] ?? value ?? "No disponible";
}

export function getSelectionLabel(value) {
  return SELECTION_LABELS[value] ?? value ?? "No disponible";
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
