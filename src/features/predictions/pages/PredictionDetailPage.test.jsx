import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { backendApi } from "../../../services/backendApi.js";
import { HttpClientError } from "../../../services/httpClient.js";
import {
  predictionDtos,
  predictionWithoutExplanationDto,
} from "../../../test/fixtures/predictions.js";
import { renderWithRoute } from "../../../test/renderWithRouter.jsx";
import { PredictionDetailPage } from "./PredictionDetailPage.jsx";

vi.mock("../../../services/backendApi.js", () => ({
  backendApi: {
    getCompetitions: vi.fn(),
    getLatestSystemRun: vi.fn(),
    getTodayPredictions: vi.fn(),
    getTopPredictions: vi.fn(),
    getPredictionById: vi.fn(),
  },
}));

describe("PredictionDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders persisted detail data and treats explanation html as plain text", async () => {
    backendApi.getPredictionById.mockResolvedValue(predictionDtos[0]);

    renderWithRoute(<PredictionDetailPage />, {
      path: "/predictions/:predictionId",
      route: "/predictions/17",
    });

    await screen.findByRole("heading", { name: "Arsenal vs Chelsea" });

    expect(screen.getByText("Seleccion persistida")).toBeInTheDocument();
    expect(
      screen.getByText("<strong>Arsenal</strong> llega mejor perfilado."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("strong")).not.toBeInTheDocument();
  });

  it("shows invalid ids before calling the backend", () => {
    renderWithRoute(<PredictionDetailPage />, {
      path: "/predictions/:predictionId",
      route: "/predictions/not-a-number",
    });

    expect(screen.getByText("ID invalido")).toBeInTheDocument();
    expect(backendApi.getPredictionById).not.toHaveBeenCalled();
  });

  it("shows a not found state for missing predictions", async () => {
    backendApi.getPredictionById.mockRejectedValue(
      new HttpClientError("Missing", {
        status: 404,
        code: "NOT_FOUND",
      }),
    );

    renderWithRoute(<PredictionDetailPage />, {
      path: "/predictions/:predictionId",
      route: "/predictions/404",
    });

    await screen.findByText("Prediccion no encontrada");
    expect(
      screen.getByText(/No existe una prediccion persistida/),
    ).toBeInTheDocument();
  });

  it("shows absence of explanation without inventing data", async () => {
    backendApi.getPredictionById.mockResolvedValue(
      predictionWithoutExplanationDto,
    );

    renderWithRoute(<PredictionDetailPage />, {
      path: "/predictions/:predictionId",
      route: "/predictions/19",
    });

    await screen.findByText("Sin explicacion persistida");
    expect(
      screen.getByText(/No hay explicación persistida/),
    ).toBeInTheDocument();
  });
});
