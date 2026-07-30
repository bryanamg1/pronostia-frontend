import {
  formatConfidence,
  formatDate,
  formatDateTime,
  formatEdge,
  formatPercentage,
} from "../../../utils/formatters.js";
import {
  getExplanationSourceLabel,
  getExplanationStatusLabel,
  getMarketLabel,
  getRecommendationLabel,
  getSelectionLabel,
} from "../../../utils/predictionLabels.js";

export class PredictionAdapterError extends Error {
  constructor(message) {
    super(message);
    this.name = "PredictionAdapterError";
  }
}

function requireObject(value, message) {
  if (!value || typeof value !== "object") {
    throw new PredictionAdapterError(message);
  }

  return value;
}

function readNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function sanitizeText(value) {
  return typeof value === "string" ? value : null;
}

export function adaptPrediction(dto, { timezone }) {
  const fixture = requireObject(dto?.fixture, "Prediction fixture is required");
  const selection = requireObject(
    dto?.selection,
    "Prediction selection is required",
  );

  return {
    id: Number(dto.id),
    fixture: {
      id: Number(fixture.id),
      kickoffAt: fixture.kickoffAt,
      kickoffLabel: formatDateTime(fixture.kickoffAt, timezone),
      localDate: formatDate(fixture.kickoffAt, timezone),
      status: sanitizeText(fixture.status),
      competition: {
        name: sanitizeText(fixture.competition?.name) ?? "No disponible",
        targetKey:
          sanitizeText(fixture.competition?.targetKey) ?? "No disponible",
        season: fixture.competition?.season ?? null,
        country: sanitizeText(fixture.competition?.country) ?? "No disponible",
      },
      homeTeam: sanitizeText(fixture.homeTeam?.name) ?? "No disponible",
      awayTeam: sanitizeText(fixture.awayTeam?.name) ?? "No disponible",
    },
    modelVersion: sanitizeText(dto.model?.version) ?? "No disponible",
    selection: {
      market: sanitizeText(selection.market),
      marketLabel: getMarketLabel(selection.market),
      value: sanitizeText(selection.value),
      valueLabel: getSelectionLabel(selection.value),
      recommendation: sanitizeText(selection.recommendation),
      recommendationLabel: getRecommendationLabel(selection.recommendation),
      modelProbability: readNumber(selection.modelProbability),
      modelProbabilityLabel: formatPercentage(selection.modelProbability),
      marketProbability: readNumber(selection.marketProbability),
      marketProbabilityLabel: formatPercentage(selection.marketProbability),
      edgePp: readNumber(selection.edgePp),
      edgeLabel: formatEdge(selection.edgePp),
      confidenceScore: readNumber(selection.confidenceScore),
      confidenceLabel: formatConfidence(selection.confidenceScore),
      riskLevel: sanitizeText(selection.riskLevel) ?? "No disponible",
    },
    analysis: dto.analysis
      ? {
          expectedGoals: {
            home: readNumber(dto.analysis.expectedGoals?.home),
            away: readNumber(dto.analysis.expectedGoals?.away),
          },
          probabilities: dto.analysis.probabilities ?? {},
          dataQuality: {
            status: sanitizeText(dto.analysis.dataQuality?.status),
            flags: Array.isArray(dto.analysis.dataQuality?.flags)
              ? dto.analysis.dataQuality.flags
              : [],
          },
        }
      : null,
    explanation: dto.explanation
      ? {
          status: sanitizeText(dto.explanation.status),
          statusLabel: getExplanationStatusLabel(dto.explanation.status),
          source: sanitizeText(dto.explanation.source),
          sourceLabel: getExplanationSourceLabel(dto.explanation.source),
          generatedAt: dto.explanation.generatedAt,
          generatedAtLabel: formatDateTime(
            dto.explanation.generatedAt,
            timezone,
          ),
          summary: sanitizeText(dto.explanation.summary),
          supportingFactors: Array.isArray(dto.explanation.supportingFactors)
            ? dto.explanation.supportingFactors
            : [],
          counterFactors: Array.isArray(dto.explanation.counterFactors)
            ? dto.explanation.counterFactors
            : [],
          warnings: Array.isArray(dto.explanation.warnings)
            ? dto.explanation.warnings
            : [],
          responsibleUseNotice:
            sanitizeText(dto.explanation.responsibleUseNotice) ??
            "No disponible",
        }
      : null,
    isDailyTop: Boolean(dto.isDailyTop),
    updatedAt: dto.updatedAt,
    updatedAtLabel: formatDateTime(dto.updatedAt, timezone),
  };
}
