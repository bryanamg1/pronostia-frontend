import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClientError } from "../../../services/httpClient.js";
import { backendApi } from "../../../services/backendApi.js";
import {
  competitionsDto,
  filterPredictionsByCompetition,
  latestRunDto,
  topPredictionDtos,
} from "../../../test/fixtures/predictions.js";
import { renderWithRoute } from "../../../test/renderWithRouter.jsx";
import { DashboardPage } from "./DashboardPage.jsx";

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

    await screen.findByText("Radiografía diaria de predicciones");

    expect(
      screen.getAllByRole("heading", { name: "Arsenal vs Chelsea" }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Competición")[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        "Se muestran solo las predicciones elegibles persistidas. No hubo suficientes análisis para completar cinco posiciones.",
      ),
    ).toBeInTheDocument();
  });

  it("re-queries backend filters and clears them from the UI", async () => {
    const user = userEvent.setup();

    renderWithRoute(<DashboardPage />, {
      path: "/dashboard",
      route: "/dashboard",
    });

    await screen.findByText("Radiografía diaria de predicciones");
    const competitionSelect = screen.getAllByLabelText("Competición")[0];

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

  it("shows an enriched empty state and supports dashboard refresh", async () => {
    backendApi.getTodayPredictions.mockResolvedValueOnce([]);
    backendApi.getTopPredictions.mockResolvedValueOnce([]);
    const user = userEvent.setup();

    renderWithRoute(<DashboardPage />, {
      path: "/dashboard",
      route: "/dashboard?date=2026-07-29",
    });

    const emptyTitle = await screen.findByText(
      "No encontramos predicciones para la ventana actual",
    );
    const emptyState = emptyTitle.closest("section");

    expect(emptyState).not.toBeNull();
    expect(
      within(emptyState).getByText(
        /PronostIA solo muestra análisis cuando existen partidos disponibles/,
      ),
    ).toBeInTheDocument();
    expect(
      within(emptyState).getByText("Ventana consultada"),
    ).toBeInTheDocument();
    expect(within(emptyState).getByText("2026-07-29")).toBeInTheDocument();
    expect(
      within(emptyState).getByText("Última ejecución"),
    ).toBeInTheDocument();
    expect(within(emptyState).getByText("Completada")).toBeInTheDocument();
    expect(
      within(emptyState).getByText("Última actualización"),
    ).toBeInTheDocument();
    expect(
      within(emptyState).getByRole("button", { name: "Actualizar dashboard" }),
    ).toBeInTheDocument();
    const responsiblePanel = emptyState.parentElement?.querySelector(
      ".responsible-panel--compact",
    );

    expect(responsiblePanel).not.toBeNull();
    expect(
      within(responsiblePanel).getByRole("heading", {
        name: "Uso responsable",
      }),
    ).toBeInTheDocument();
    expect(
      within(responsiblePanel).getByText(
        "La decisión final siempre pertenece al usuario.",
      ),
    ).toBeInTheDocument();

    await user.click(
      within(emptyState).getByRole("button", { name: "Actualizar dashboard" }),
    );

    await waitFor(() => {
      expect(backendApi.getTodayPredictions).toHaveBeenCalledTimes(2);
    });
  });

  it("shows error states without leaking technical details", async () => {
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
