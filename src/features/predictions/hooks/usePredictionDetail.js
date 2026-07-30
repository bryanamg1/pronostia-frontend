import { useEffect, useState } from "react";

import { appEnv } from "../../../app/config/env.js";
import { UI_TEXT } from "../../../constants/uiText.js";
import { backendApi } from "../../../services/backendApi.js";
import { HttpClientError } from "../../../services/httpClient.js";
import {
  adaptPrediction,
  PredictionAdapterError,
} from "../adapters/predictionAdapter.js";

function normalizeDetailError(error) {
  if (error instanceof HttpClientError) {
    if (error.status === 404) {
      return "PREDICTION_NOT_FOUND";
    }

    if (error.code === "NETWORK_ERROR") {
      return UI_TEXT.errors.network;
    }
  }

  if (error instanceof PredictionAdapterError) {
    return UI_TEXT.errors.invalidResponse;
  }

  return UI_TEXT.errors.generic;
}

export function usePredictionDetail(predictionId) {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!Number.isInteger(predictionId) || predictionId <= 0) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadDetail() {
      setState({
        status: "loading",
        data: null,
        error: null,
      });

      try {
        const dto = await backendApi.getPredictionById(predictionId, {
          signal: controller.signal,
        });
        const prediction = adaptPrediction(dto, {
          timezone: appEnv.timezone,
        });

        setState({
          status: "success",
          data: prediction,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          status: "error",
          data: null,
          error: normalizeDetailError(error),
        });
      }
    }

    loadDetail();

    return () => controller.abort();
  }, [predictionId]);

  return state;
}
