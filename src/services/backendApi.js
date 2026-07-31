import { appEnv } from "../app/config/env.js";
import { createHttpClient } from "./httpClient.js";

const httpClient = createHttpClient({
  baseUrl: appEnv.apiBaseUrl,
});

function isRequestOptions(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    ("signal" in value || "headers" in value || "query" in value),
  );
}

export const backendApi = {
  async getCompetitions(filtersOrOptions = {}, options = {}) {
    const filters = isRequestOptions(filtersOrOptions) ? {} : filtersOrOptions;
    const requestOptions = isRequestOptions(filtersOrOptions)
      ? filtersOrOptions
      : options;
    const response = await httpClient.get("/api/competitions", {
      ...requestOptions,
      query: filters,
    });
    return response.data;
  },
  async getTodayFixtures(filters = {}, options = {}) {
    const response = await httpClient.get("/api/fixtures/today", {
      ...options,
      query: filters,
    });
    return response.data;
  },
  async getLatestSystemRun(options = {}) {
    const response = await httpClient.get("/api/system/runs/latest", options);
    return response.data;
  },
  async getTodayPredictions(filters, options = {}) {
    const response = await httpClient.get("/api/predictions/today", {
      ...options,
      query: filters,
    });
    return response.data;
  },
  async getTopPredictions(options = {}) {
    const response = await httpClient.get("/api/predictions/top", options);
    return response.data;
  },
  async getPredictionById(predictionId, options = {}) {
    const response = await httpClient.get(
      `/api/predictions/${predictionId}`,
      options,
    );
    return response.data;
  },
};
