import {
  formatConfidence,
  formatDate,
  formatDateTime,
  formatDecimal,
  formatEdge,
  formatPercentage,
} from "../../../utils/formatters.js";
import {
  getConfidenceBandLabel,
  getDataQualityFlagLabel,
  getDataQualityLabel,
  getExplanationPresentationLabel,
  getExplanationSourceLabel,
  getExplanationStatusLabel,
  getMarketLabel,
  getRecommendationLabel,
  getRiskLabel,
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

function buildUnavailableExplanation({
  generatedAt,
  timezone,
  status,
  source,
}) {
  return {
    status,
    statusLabel: getExplanationStatusLabel(status),
    source,
    sourceLabel: source ? getExplanationSourceLabel(source) : null,
    presentationLabel: getExplanationPresentationLabel(status, source),
    generatedAt,
    generatedAtLabel: generatedAt
      ? formatDateTime(generatedAt, timezone)
      : "No disponible",
    summary:
      "Explicación no disponible por falta de datos deterministas mínimos.",
    outcomeAnalysis: null,
    goalsAnalysis: null,
    marketAnalysis: null,
    qualityWarning:
      "No hay datos suficientes para construir una explicación segura.",
    responsibleUse:
      "PronostIA ofrece estimaciones estadísticas prepartido. No garantiza resultados ni constituye una apuesta segura.",
    supportingFactors: [],
    counterFactors: [],
    warnings: [],
    responsibleUseNotice:
      "PronostIA ofrece estimaciones estadísticas prepartido. No garantiza resultados ni constituye una apuesta segura.",
  };
}

function canBuildLocalExplanation(dto) {
  return Boolean(
    dto?.fixture?.homeTeam?.name &&
    dto?.fixture?.awayTeam?.name &&
    typeof dto?.selection?.confidenceScore === "number" &&
    typeof dto?.selection?.modelProbability === "number" &&
    typeof dto?.analysis?.expectedGoals?.home === "number" &&
    typeof dto?.analysis?.expectedGoals?.away === "number" &&
    dto?.analysis?.dataQuality?.status,
  );
}

function buildLocalExplanation(dto, { timezone, status, source, generatedAt }) {
  const selectionLabel = getSelectionLabel(
    dto.selection?.value,
    dto.selection?.market,
  );
  const confidenceBand = getConfidenceBandLabel(dto.selection?.confidenceScore);
  const dataQuality = getDataQualityLabel(dto.analysis?.dataQuality?.status);
  const recommendationLabel = getRecommendationLabel(
    dto.selection?.recommendation,
  );
  const summary =
    dto.selection?.recommendation === "CONSIDER"
      ? `PronostIA estima que ${selectionLabel.toLowerCase()} es la lectura principal del partido y alcanza el umbral interno para una recomendación oficial.`
      : `PronostIA estima que ${selectionLabel.toLowerCase()} es la lectura principal del partido, pero no emite una recomendación oficial.`;

  const totalExpectedGoals =
    Number(dto.analysis.expectedGoals.home) +
    Number(dto.analysis.expectedGoals.away);
  const probabilities = dto.analysis?.probabilities ?? {};
  const bookmaker = sanitizeText(dto.market?.bookmaker);
  const capturedAt = sanitizeText(dto.market?.capturedAt);
  const edgeLabel = formatEdge(dto.selection?.edgePp);
  const marketClause =
    typeof dto.selection?.marketProbability === "number"
      ? `PronostIA estima ${formatPercentage(dto.selection.modelProbability)} y el mercado refleja ${formatPercentage(dto.selection.marketProbability)}.`
      : `PronostIA estima ${formatPercentage(dto.selection.modelProbability)} para la selección principal.`;

  return {
    status,
    statusLabel: getExplanationStatusLabel(status),
    source,
    sourceLabel: source ? getExplanationSourceLabel(source) : null,
    presentationLabel: getExplanationPresentationLabel(status, source),
    generatedAt: generatedAt ?? null,
    generatedAtLabel: generatedAt
      ? formatDateTime(generatedAt, timezone)
      : "No disponible",
    summary,
    outcomeAnalysis:
      typeof probabilities.homeWin === "number" &&
      typeof probabilities.draw === "number" &&
      typeof probabilities.awayWin === "number"
        ? `La lectura estadística reparte el partido entre ${formatPercentage(probabilities.homeWin)} para la victoria local, ${formatPercentage(probabilities.draw)} para el empate y ${formatPercentage(probabilities.awayWin)} para la victoria visitante.`
        : "No hay suficientes probabilidades de resultado para ampliar esta lectura.",
    goalsAnalysis: `PronostIA proyecta ${formatDecimal(dto.analysis.expectedGoals.home)} goles esperados para el local y ${formatDecimal(dto.analysis.expectedGoals.away)} para el visitante, con un total esperado de ${formatDecimal(totalExpectedGoals)}.`,
    marketAnalysis: `${marketClause} Diferencia estimada: ${edgeLabel}.${bookmaker ? ` Referencia observada: ${bookmaker}.` : ""}${capturedAt ? ` Capturada el ${formatDateTime(capturedAt, timezone)}.` : ""} Esta diferencia no garantiza rentabilidad y puede cambiar antes del partido.`,
    qualityWarning: `La calidad de los datos es ${dataQuality} y la confianza visible es ${confidenceBand.toLowerCase()} (${formatConfidence(dto.selection?.confidenceScore)}). Estado actual: ${recommendationLabel}.`,
    responsibleUse:
      "PronostIA ofrece estimaciones estadísticas prepartido. No garantiza resultados ni constituye una apuesta segura.",
    supportingFactors: Array.isArray(dto.explanation?.supportingFactors)
      ? dto.explanation.supportingFactors
      : [],
    counterFactors: Array.isArray(dto.explanation?.counterFactors)
      ? dto.explanation.counterFactors
      : [],
    warnings: Array.isArray(dto.explanation?.warnings)
      ? dto.explanation.warnings
      : [],
    responsibleUseNotice:
      "PronostIA ofrece estimaciones estadísticas prepartido. No garantiza resultados ni constituye una apuesta segura.",
  };
}

export function adaptPrediction(dto, { timezone }) {
  const fixture = requireObject(dto?.fixture, "Prediction fixture is required");
  const selection = requireObject(
    dto?.selection,
    "Prediction selection is required",
  );

  const fallbackEligible = canBuildLocalExplanation(dto);
  const explanationStatus =
    sanitizeText(dto?.explanation?.status) ??
    (fallbackEligible ? "EXPLANATION_FALLBACK" : "EXPLANATION_UNAVAILABLE");
  const explanationSource =
    sanitizeText(dto?.explanation?.source) ??
    (fallbackEligible ? "DETERMINISTIC_FALLBACK" : null);
  const generatedAt = dto?.explanation?.generatedAt ?? dto?.updatedAt ?? null;
  const baseExplanation = fallbackEligible
    ? buildLocalExplanation(
        dto?.explanation
          ? {
              ...dto,
              explanation: {
                ...dto.explanation,
              },
            }
          : dto,
        {
          timezone,
          status: explanationStatus,
          source: explanationSource,
          generatedAt,
        },
      )
    : buildUnavailableExplanation({
        generatedAt,
        timezone,
        status: explanationStatus,
        source: explanationSource,
      });

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
      valueLabel: getSelectionLabel(selection.value, selection.market),
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
      confidenceBandLabel: getConfidenceBandLabel(selection.confidenceScore),
      riskLevel: sanitizeText(selection.riskLevel) ?? "No disponible",
      riskLabel: getRiskLabel(selection.riskLevel),
    },
    market: {
      bookmaker: sanitizeText(dto.market?.bookmaker),
      sourceType: sanitizeText(dto.market?.sourceType),
      capturedAt: sanitizeText(dto.market?.capturedAt),
      capturedAtLabel: dto.market?.capturedAt
        ? formatDateTime(dto.market.capturedAt, timezone)
        : "No disponible",
      decimalOdds: readNumber(dto.market?.decimalOdds),
      decimalOddsLabel: formatDecimal(dto.market?.decimalOdds),
      normalizationMethod: sanitizeText(dto.market?.normalizationMethod),
      derivedFromMarket: sanitizeText(dto.market?.derivedFromMarket),
    },
    analysis: dto.analysis
      ? {
          historicalCutoff: dto.analysis.historicalCutoff ?? null,
          historicalCutoffLabel: dto.analysis.historicalCutoff
            ? formatDateTime(dto.analysis.historicalCutoff, timezone)
            : "No disponible",
          expectedGoals: {
            home: readNumber(dto.analysis.expectedGoals?.home),
            homeLabel: formatDecimal(dto.analysis.expectedGoals?.home),
            away: readNumber(dto.analysis.expectedGoals?.away),
            awayLabel: formatDecimal(dto.analysis.expectedGoals?.away),
            total:
              readNumber(dto.analysis.expectedGoals?.home) !== null &&
              readNumber(dto.analysis.expectedGoals?.away) !== null
                ? Number(dto.analysis.expectedGoals.home) +
                  Number(dto.analysis.expectedGoals.away)
                : null,
            totalLabel:
              readNumber(dto.analysis.expectedGoals?.home) !== null &&
              readNumber(dto.analysis.expectedGoals?.away) !== null
                ? formatDecimal(
                    Number(dto.analysis.expectedGoals.home) +
                      Number(dto.analysis.expectedGoals.away),
                  )
                : "No disponible",
          },
          probabilities: {
            homeWin: readNumber(dto.analysis.probabilities?.homeWin),
            draw: readNumber(dto.analysis.probabilities?.draw),
            awayWin: readNumber(dto.analysis.probabilities?.awayWin),
            over25: readNumber(dto.analysis.probabilities?.over25),
            under25: readNumber(dto.analysis.probabilities?.under25),
            bttsYes: readNumber(dto.analysis.probabilities?.bttsYes),
            bttsNo: readNumber(dto.analysis.probabilities?.bttsNo),
            doubleChance1X: readNumber(
              dto.analysis.probabilities?.doubleChance1X,
            ),
            doubleChanceX2: readNumber(
              dto.analysis.probabilities?.doubleChanceX2,
            ),
            doubleChance12: readNumber(
              dto.analysis.probabilities?.doubleChance12,
            ),
          },
          dataQuality: {
            status: sanitizeText(dto.analysis.dataQuality?.status),
            statusLabel: getDataQualityLabel(dto.analysis.dataQuality?.status),
            flags: Array.isArray(dto.analysis.dataQuality?.flags)
              ? dto.analysis.dataQuality.flags
              : [],
            flagLabels: Array.isArray(dto.analysis.dataQuality?.flags)
              ? dto.analysis.dataQuality.flags.map(getDataQualityFlagLabel)
              : [],
          },
        }
      : null,
    explanation: {
      ...baseExplanation,
      statusLabel: getExplanationStatusLabel(baseExplanation.status),
      sourceLabel: baseExplanation.source
        ? getExplanationSourceLabel(baseExplanation.source)
        : null,
      presentationLabel: getExplanationPresentationLabel(
        baseExplanation.status,
        baseExplanation.source,
      ),
      summary:
        sanitizeText(dto?.explanation?.summary) ?? baseExplanation.summary,
      outcomeAnalysis:
        sanitizeText(dto?.explanation?.outcomeAnalysis) ??
        baseExplanation.outcomeAnalysis,
      goalsAnalysis:
        sanitizeText(dto?.explanation?.goalsAnalysis) ??
        baseExplanation.goalsAnalysis,
      marketAnalysis:
        sanitizeText(dto?.explanation?.marketAnalysis) ??
        baseExplanation.marketAnalysis,
      qualityWarning:
        sanitizeText(dto?.explanation?.qualityWarning) ??
        baseExplanation.qualityWarning,
      responsibleUse:
        sanitizeText(dto?.explanation?.responsibleUse) ??
        sanitizeText(dto?.explanation?.responsibleUseNotice) ??
        baseExplanation.responsibleUse,
    },
    explanationStatus:
      sanitizeText(dto.explanationStatus) ?? baseExplanation.status,
    explanationSource:
      sanitizeText(dto.explanationSource) ?? baseExplanation.source,
    isDailyTop: Boolean(dto.isDailyTop),
    updatedAt: dto.updatedAt,
    updatedAtLabel: formatDateTime(dto.updatedAt, timezone),
  };
}
