import {
  formatConfidence,
  formatDate,
  formatDateTime,
} from "../../../utils/formatters.js";
import {
  getMarketLabel,
  getRecommendationLabel,
  getSelectionLabel,
} from "../../../utils/predictionLabels.js";
import { COMPETITION_TEXT } from "../constants/competitionText.js";

function sanitizeText(value) {
  return typeof value === "string" ? value : null;
}

function readNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function getStatusLabel(status) {
  if (!status) {
    return "No disponible";
  }

  return COMPETITION_TEXT.statusLabels[status] ?? status;
}

export function adaptCompetitionFixture(dto, { timezone }) {
  return {
    id: Number(dto.id),
    kickoffAt: dto.kickoffAt ?? null,
    kickoffLabel: dto.kickoffAt
      ? formatDateTime(dto.kickoffAt, timezone)
      : COMPETITION_TEXT.unavailableDate,
    localDate: dto.kickoffAt ? formatDate(dto.kickoffAt, timezone) : null,
    status: sanitizeText(dto.status) ?? "No disponible",
    statusLabel: getStatusLabel(dto.status),
    isHistorical: Boolean(dto.isHistorical),
    competition: {
      id: Number(dto.competition?.id),
      key: sanitizeText(dto.competition?.key) ?? "",
      name: sanitizeText(dto.competition?.name) ?? "No disponible",
      country: sanitizeText(dto.competition?.country) ?? "No disponible",
      season: dto.competition?.season ?? null,
    },
    homeTeam: {
      id: Number(dto.homeTeam?.id),
      key: sanitizeText(dto.homeTeam?.key) ?? "",
      name: sanitizeText(dto.homeTeam?.name) ?? "No disponible",
    },
    awayTeam: {
      id: Number(dto.awayTeam?.id),
      key: sanitizeText(dto.awayTeam?.key) ?? "",
      name: sanitizeText(dto.awayTeam?.name) ?? "No disponible",
    },
    prediction: dto.prediction
      ? {
          id: Number(dto.prediction.id),
          market: sanitizeText(dto.prediction.market),
          marketLabel: getMarketLabel(dto.prediction.market),
          selection: sanitizeText(dto.prediction.selection),
          selectionLabel: getSelectionLabel(
            dto.prediction.selection,
            dto.prediction.market,
          ),
          recommendation: sanitizeText(dto.prediction.recommendation),
          recommendationLabel: getRecommendationLabel(
            dto.prediction.recommendation,
          ),
          confidenceScore: readNumber(dto.prediction.confidenceScore),
          confidenceLabel: formatConfidence(dto.prediction.confidenceScore),
        }
      : null,
  };
}
