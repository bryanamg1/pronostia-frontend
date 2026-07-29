import { useEffect, useState } from "react";

import { appEnv } from "../../../app/config/env.js";
import { UI_TEXT } from "../../../constants/uiText.js";
import { backendApi } from "../../../services/backendApi.js";
import { HttpClientError } from "../../../services/httpClient.js";
import {
  buildCompetitionCards,
  orderAuthorizedCompetitions,
} from "../../competitions/services/competitionCatalog.js";
import { adaptCompetitionFixture } from "../../competitions/adapters/competitionFixtureAdapter.js";
import { adaptPrediction } from "../../predictions/adapters/predictionAdapter.js";

function buildFilterOptions(predictions, competitions) {
  const orderedCompetitions = orderAuthorizedCompetitions(competitions);
  const allOption = {
    value: "",
    label: "Todos",
  };

  const unique = (items) =>
    [...new Set(items.filter(Boolean))].sort().map((value) => ({
      value,
      label: value,
    }));

  return {
    date: [
      {
        value: "",
        label: "Todas las fechas cargadas",
      },
      ...unique(predictions.map((prediction) => prediction.fixture.localDate)),
    ],
    competition: [
      allOption,
      ...orderedCompetitions.map((competition) => ({
        value: competition.targetKey,
        label: competition.name,
      })),
    ],
    market: [
      allOption,
      ...unique(predictions.map((prediction) => prediction.selection.market)),
    ],
    recommendation: [
      allOption,
      ...unique(
        predictions.map((prediction) => prediction.selection.recommendation),
      ),
    ],
    dataQuality: [
      allOption,
      ...unique(
        predictions.map(
          (prediction) => prediction.analysis?.dataQuality?.status,
        ),
      ),
    ],
    explanationSource: [
      allOption,
      ...unique(
        predictions.map((prediction) => prediction.explanation?.source),
      ),
    ],
  };
}

function buildSummary(predictions, latestRun) {
  const lastUpdated = [...predictions]
    .map((prediction) => prediction.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  const fallbackUpdatedAt =
    latestRun?.finishedAt ?? latestRun?.startedAt ?? null;

  return {
    totalPredictions: predictions.length,
    considerCount: predictions.filter(
      (prediction) => prediction.selection.recommendation === "CONSIDER",
    ).length,
    lowQualityCount: predictions.filter(
      (prediction) =>
        prediction.selection.recommendation !== "CONSIDER" &&
        prediction.analysis?.dataQuality?.status &&
        prediction.analysis.dataQuality.status !== "SUFFICIENT",
    ).length,
    latestRun,
    lastUpdatedLabel:
      lastUpdated || fallbackUpdatedAt
        ? new Intl.DateTimeFormat("es-AR", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: appEnv.timezone,
          }).format(new Date(lastUpdated ?? fallbackUpdatedAt))
        : "No disponible",
  };
}

function filterByLocalDate(predictions, date) {
  if (!date) {
    return predictions;
  }

  return predictions.filter(
    (prediction) => prediction.fixture.localDate === date,
  );
}

function normalizeError(error) {
  if (error instanceof HttpClientError) {
    if (error.code === "NETWORK_ERROR") {
      return UI_TEXT.errors.network;
    }

    if (error.code === "INVALID_RESPONSE") {
      return UI_TEXT.errors.invalidResponse;
    }

    if (error.status === 503) {
      return UI_TEXT.errors.unavailable;
    }
  }

  return UI_TEXT.errors.generic;
}

export function useDashboardData(filters, refreshToken = 0) {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      setState((current) => ({
        ...current,
        status: "loading",
        error: null,
      }));

      try {
        const [competitions, latestRun, predictionDtos, topDtos, fixtureDtos] =
          await Promise.all([
            backendApi.getCompetitions({ signal: controller.signal }),
            backendApi.getLatestSystemRun({ signal: controller.signal }),
            backendApi.getTodayPredictions(
              {
                competition: filters.competition,
                market: filters.market,
                recommendation: filters.recommendation,
                dataQuality: filters.dataQuality,
                explanationSource: filters.explanationSource,
              },
              { signal: controller.signal },
            ),
            backendApi.getTopPredictions({ signal: controller.signal }),
            backendApi.getTodayFixtures({ signal: controller.signal }),
          ]);

        const predictions = predictionDtos.map((dto) =>
          adaptPrediction(dto, { timezone: appEnv.timezone }),
        );
        const topPredictions = topDtos.map((dto) =>
          adaptPrediction(dto, { timezone: appEnv.timezone }),
        );
        const fixtures = fixtureDtos.map((dto) =>
          adaptCompetitionFixture(dto, { timezone: appEnv.timezone }),
        );
        const orderedCompetitions = orderAuthorizedCompetitions(competitions);
        const visiblePredictions = filterByLocalDate(predictions, filters.date);

        setState({
          status: "success",
          error: null,
          data: {
            timezone: appEnv.timezone,
            predictions,
            visiblePredictions,
            topPredictions,
            competitions: orderedCompetitions,
            fixtures,
            competitionCards: buildCompetitionCards(
              orderedCompetitions,
              fixtures,
            ),
            latestRun,
            summary: buildSummary(predictions, latestRun),
            filterOptions: buildFilterOptions(predictions, orderedCompetitions),
          },
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          status: "error",
          data: null,
          error: normalizeError(error),
        });
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, [
    filters.competition,
    filters.market,
    filters.recommendation,
    filters.dataQuality,
    filters.explanationSource,
    filters.date,
    refreshToken,
  ]);

  return state;
}
