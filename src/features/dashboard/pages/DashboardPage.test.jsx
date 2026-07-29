import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DashboardPage } from "./DashboardPage.jsx";
import { backendApi } from "../../../services/backendApi.js";
import {
  competitionsDto,
  filterPredictionsByCompetition,
  latestRunDto,
  topPredictionDtos,
} from "../../../test/fixtures/predictions.js";
import { renderWithRoute } from "../../../test/renderWithRouter.jsx";
import { HttpClientError } from "../../../services/httpClient.js";

vi.mock("../../../services/backendApi.js", () => ({
  backendApi: {
    getCompetitions: vi.fn(),
    getLatestSystemRun: vi.fn(),
    getTodayPredictions: vi.fn(),
    getTopPredictions: vi.fn(),
    getPredictionById: vi.fn(),
  },
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    backendApi.getCompetitions.mockResolvedValue(competitionsDto);
    backendApi.getLatestSystemRun.mockResolvedValue(latestRunDto);
    backendApi.getTopPredictions.mockResolvedValue(topPredictionDtos);
    backendApi.getTodayPredictions.mockImplementation(async (filters = {}) =>
      filterPredictionsByCompetition(filters.competition),
    );
  });

  it("renders loading first and then shows dashboard data", async () => {
    renderWithRoute(<DashboardPage />, {
      path: "/dashboard",
      route: "/dashboard",
    });

    expect(screen.getByText("Cargando dashboard")).toBeInTheDocument();

    await screen.findByText("Radiografia diaria de predicciones");

    expect(
      screen.getAllByRole("heading", { name: "Arsenal vs Chelsea" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "Se muestran solo las predicciones elegibles persistidas. No hubo suficientes analisis para completar cinco posiciones.",
      ),
    ).toBeInTheDocument();
  });

  it("re-queries backend filters and clears them from the UI", async () => {
    const user = userEvent.setup();

    renderWithRoute(<DashboardPage />, {
      path: "/dashboard",
      route: "/dashboard",
    });

    await screen.findByText("Radiografia diaria de predicciones");
    const competitionSelect = screen.getAllByLabelText("Competicion")[0];

    await user.selectOptions(competitionSelect, "premier-league");

    await waitFor(() => {
      expect(backendApi.getTodayPredictions).toHaveBeenLastCalledWith(
        expect.objectContaining({
          competition: "premier-league",
        }),
        expect.any(Object),
      );
    });

    await user.click(
      screen.getAllByRole("button", { name: "Limpiar filtros" })[0],
    );

    await waitFor(() => {
      expect(backendApi.getTodayPredictions).toHaveBeenLastCalledWith(
        expect.objectContaining({
          competition: "",
        }),
        expect.any(Object),
      );
    });
  });

  it("shows empty and error states without leaking technical details", async () => {
    backendApi.getTodayPredictions.mockResolvedValueOnce([]);
    backendApi.getTopPredictions.mockResolvedValueOnce([]);

    renderWithRoute(<DashboardPage />, {
      path: "/dashboard",
      route: "/dashboard",
    });

    await screen.findByText("Sin predicciones cargadas");
    expect(
      screen.getByText(/No hay predicciones disponibles/),
    ).toBeInTheDocument();

    backendApi.getCompetitions.mockRejectedValueOnce(
      new HttpClientError("Network failed", {
        code: "NETWORK_ERROR",
      }),
    );

    renderWithRoute(<DashboardPage />, {
      path: "/dashboard",
      route: "/dashboard",
    });

    await screen.findByText("No pudimos cargar el dashboard");
    expect(
      screen.getByText("No pudimos conectar con el backend local."),
    ).toBeInTheDocument();
  });
});
