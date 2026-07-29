import { useEffect, useState } from "react";

import { appEnv } from "../../../app/config/env.js";
import { UI_TEXT } from "../../../constants/uiText.js";
import { backendApi } from "../../../services/backendApi.js";
import { HttpClientError } from "../../../services/httpClient.js";
import { adaptCompetitionFixture } from "../adapters/competitionFixtureAdapter.js";
import {
  buildCompetitionCards,
  orderAuthorizedCompetitions,
} from "../services/competitionCatalog.js";

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

function buildLastUpdatedLabel(latestRun, timezone) {
  const referenceDate = latestRun?.finishedAt ?? latestRun?.startedAt ?? null;

  if (!referenceDate) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(new Date(referenceDate));
}

function buildWindowLabel(fixtures) {
  const dates = [
    ...new Set(fixtures.map((fixture) => fixture.localDate).filter(Boolean)),
  ].sort();

  if (dates.length === 0) {
    return "No disponible";
  }

  if (dates.length === 1) {
    return dates[0];
  }

  return `${dates[0]} - ${dates.at(-1)}`;
}

export function useCompetitionCatalogData(
  { competitionKey = "" } = {},
  refreshToken = 0,
) {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadCompetitionCatalog() {
      setState((current) => ({
        ...current,
        status: "loading",
        error: null,
      }));

      try {
        const [competitionsDto, latestRun, fixturesDto] = await Promise.all([
          backendApi.getCompetitions({ signal: controller.signal }),
          backendApi.getLatestSystemRun({ signal: controller.signal }),
          backendApi.getTodayFixtures(
            {
              competition: competitionKey,
            },
            { signal: controller.signal },
          ),
        ]);

        const competitions = orderAuthorizedCompetitions(competitionsDto);
        const fixtures = fixturesDto.map((dto) =>
          adaptCompetitionFixture(dto, { timezone: appEnv.timezone }),
        );

        setState({
          status: "success",
          error: null,
          data: {
            timezone: appEnv.timezone,
            competitions,
            fixtures,
            latestRun,
            competitionCards: buildCompetitionCards(competitions, fixtures),
            windowLabel: buildWindowLabel(fixtures),
            lastUpdatedLabel: buildLastUpdatedLabel(latestRun, appEnv.timezone),
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

    loadCompetitionCatalog();

    return () => controller.abort();
  }, [competitionKey, refreshToken]);

  return state;
}
