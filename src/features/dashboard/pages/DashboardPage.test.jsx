import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClientError } from "../../../services/httpClient.js";
import { backendApi } from "../../../services/backendApi.js";
import {
  competitionsDto,
  filterFixturesByCompetitionAndTeam,
  filterPredictionsByCompetition,
  latestRunDto,
  topPredictionDtos,
} from "../../../test/fixtures/predictions.js";
import { renderWithRoute } from "../../../test/renderWithRouter.jsx";
import { DashboardPage } from "./DashboardPage.jsx";

vi.mock("../../../services/backendApi.js", () => ({
  backendApi: {
    getCompetitions: vi.fn(),
    getTodayFixtures: vi.fn(),
    getLatestSystemRun: vi.fn(),
    getTodayPredictions: vi.fn(),
    getTopPredictions: vi.fn(),
    getPredictionById: vi.fn(),
  },
}));

const dashboardHeadingMatcher = /Radiograf.a diaria de predicciones/u;
const competitionLabelMatcher = /Competici.n/u;
const viewCompetitionMatcher = /Ver competici.n/u;
const latestRunMatcher = /.ltima ejecuci.n/u;
const latestUpdatedMatcher = /.ltima actualizaci.n/u;
const emptyDescriptionMatcher =
  /PronostIA solo muestra an.lisis cuando existen partidos disponibles/u;
const finalDecisionMatcher =
  /La decisi.n final siempre pertenece al usuario\./u;

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    backendApi.getCompetitions.mockResolvedValue(competitionsDto);
    backendApi.getTodayFixtures.mockImplementation(async (filters = {}) =>
      filterFixturesByCompetitionAndTeam({
        competitionKey: filters.competition,
      }),
    );
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

    await screen.findByRole("heading", {
      name: dashboardHeadingMatcher,
    });

    expect(
      screen.getAllByRole("heading", { name: "Arsenal vs Chelsea" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByLabelText(competitionLabelMatcher)[0],
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ligas y competiciones" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Se muestran solo las predicciones elegibles persistidas\./u,
      ),
    ).toBeInTheDocument();
  });

  it("re-queries backend filters and clears them from the UI", async () => {
    const user = userEvent.setup();

    const view = renderWithRoute(<DashboardPage />, {
      path: "/dashboard",
      route: "/dashboard",
    });

    await within(view.container).findByRole("heading", {
      name: dashboardHeadingMatcher,
    });
    const competitionSelect = within(view.container).getAllByLabelText(
      competitionLabelMatcher,
    )[0];

    await user.selectOptions(competitionSelect, "premier-league");

    await waitFor(() => {
      expect(backendApi.getTodayPredictions).toHaveBeenLastCalledWith(
        expect.objectContaining({
          competition: "premier-league",
        }),
        expect.any(Object),
      );
    });
    await waitFor(() => {
      expect(backendApi.getTodayFixtures).toHaveBeenLastCalledWith(
        {
          competition: "premier-league",
        },
        expect.any(Object),
      );
    });
    await waitFor(() => {
      expect(
        within(view.container).queryByRole("heading", { name: "LaLiga" }),
      ).not.toBeInTheDocument();
    });

    await user.click(
      within(view.container).getByRole("button", { name: "Limpiar filtros" }),
    );

    await waitFor(() => {
      expect(backendApi.getTodayPredictions).toHaveBeenLastCalledWith(
        expect.objectContaining({
          competition: "",
        }),
        expect.any(Object),
      );
    });
    await waitFor(() => {
      expect(backendApi.getTodayFixtures).toHaveBeenLastCalledWith(
        {
          competition: "",
        },
        expect.any(Object),
      );
    });
    await waitFor(() => {
      expect(
        within(view.container).getAllByLabelText(competitionLabelMatcher)[0],
      ).toHaveValue("");
    });
    await waitFor(() => {
      expect(
        within(view.container).getAllByRole("link", {
          name: viewCompetitionMatcher,
        }),
      ).toHaveLength(18);
    });
  });

  it("restores the selected competition from the query parameter", async () => {
    const view = renderWithRoute(<DashboardPage />, {
      path: "/dashboard",
      route: "/dashboard?competition=premier-league",
    });

    await within(view.container).findByRole("heading", {
      name: dashboardHeadingMatcher,
    });

    expect(
      within(view.container).getAllByLabelText(competitionLabelMatcher)[0],
    ).toHaveValue("premier-league");
    expect(backendApi.getTodayFixtures).toHaveBeenCalledWith(
      {
        competition: "premier-league",
      },
      expect.any(Object),
    );
    expect(
      within(view.container).queryByRole("heading", { name: "LaLiga" }),
    ).not.toBeInTheDocument();
  });

  it("shows an enriched empty state and keeps competition navigation visible", async () => {
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
      within(emptyState).getByText(emptyDescriptionMatcher),
    ).toBeInTheDocument();
    expect(
      within(emptyState).getByText("Ventana consultada"),
    ).toBeInTheDocument();
    expect(within(emptyState).getByText("2026-07-29")).toBeInTheDocument();
    expect(within(emptyState).getByText(latestRunMatcher)).toBeInTheDocument();
    expect(within(emptyState).getByText("Completada")).toBeInTheDocument();
    expect(
      within(emptyState).getByText(latestUpdatedMatcher),
    ).toBeInTheDocument();
    expect(
      within(emptyState).getByRole("button", { name: "Actualizar dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: viewCompetitionMatcher }).length,
    ).toBeGreaterThan(0);
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
      within(responsiblePanel).getByText(finalDecisionMatcher),
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
