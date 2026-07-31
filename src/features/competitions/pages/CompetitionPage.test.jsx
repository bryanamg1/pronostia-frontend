import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { backendApi } from "../../../services/backendApi.js";
import {
  competitionsDto,
  fixtureDtos,
  latestRunDto,
} from "../../../test/fixtures/predictions.js";
import { renderWithRoute } from "../../../test/renderWithRouter.jsx";
import { CompetitionPage } from "./CompetitionPage.jsx";

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

describe("CompetitionPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    backendApi.getCompetitions.mockResolvedValue(competitionsDto);
    backendApi.getTodayFixtures.mockResolvedValue(fixtureDtos);
    backendApi.getLatestSystemRun.mockResolvedValue(latestRunDto);
  });

  it("renders a valid competition with fixtures, prediction links, and localized badges", async () => {
    renderWithRoute(<CompetitionPage />, {
      path: "/competitions/:competitionKey",
      route: "/competitions/premier-league",
    });

    await screen.findByRole("heading", { name: "Premier League" });
    expect(backendApi.getTodayFixtures).toHaveBeenCalledWith(
      {
        competition: "premier-league",
      },
      expect.any(Object),
    );
    expect(
      screen.getByRole("link", { name: "Ver pronóstico" }),
    ).toHaveAttribute("href", "/predictions/17");
    expect(screen.getByText("Inglaterra | Temporada 2026")).toBeInTheDocument();
    expect(screen.getByText("Liga nacional")).toBeInTheDocument();
    expect(screen.getByText("Disponibilidad parcial")).toBeInTheDocument();
    expect(
      screen.getAllByText("Pronóstico no disponible").length,
    ).toBeGreaterThan(0);
  });

  it("filters fixtures by team and clears incompatible query params", async () => {
    const user = userEvent.setup();

    renderWithRoute(<CompetitionPage />, {
      path: "/competitions/:competitionKey",
      route: "/competitions/premier-league?team=999",
    });

    const teamSelect = await screen.findByLabelText("Equipo");

    await waitFor(() => {
      expect(teamSelect).toHaveValue("");
    });

    await user.selectOptions(teamSelect, "500");

    await waitFor(() => {
      expect(
        screen.getAllByRole("heading", { name: "Liverpool vs Tottenham" })
          .length,
      ).toBeGreaterThan(0);
    });
    expect(screen.getByText("Partidos encontrados: 1")).toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", { name: "Limpiar filtros" })[0],
    );

    await waitFor(() => {
      expect(teamSelect).toHaveValue("");
    });
    expect(
      screen.getAllByRole("heading", { name: "Arsenal vs Chelsea" }).length,
    ).toBeGreaterThan(0);
  });

  it("shows a controlled empty state for a domestic cup without fixtures and exposes provider availability", async () => {
    backendApi.getTodayFixtures.mockResolvedValueOnce([]);

    const view = renderWithRoute(<CompetitionPage />, {
      path: "/competitions/:competitionKey",
      route: "/competitions/copa-del-rey",
    });

    expect(
      await within(view.container).findByText(
        "No hay partidos para esta competición",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Copa nacional")).toBeInTheDocument();
    expect(
      screen.getAllByText("Disponibilidad parcial").length,
    ).toBeGreaterThan(0);
  });

  it("shows historical data for a cup when the persisted window only contains past fixtures", async () => {
    backendApi.getTodayFixtures.mockResolvedValueOnce([
      {
        id: 990,
        competition: {
          id: 45,
          key: "fa-cup",
          name: "FA Cup",
          country: "England",
          season: 2025,
        },
        homeTeam: {
          id: 401,
          key: "401",
          name: "Manchester City",
        },
        awayTeam: {
          id: 402,
          key: "402",
          name: "Arsenal",
        },
        kickoffAt: "2026-07-30T18:00:00.000Z",
        status: "FT",
        isHistorical: true,
        prediction: null,
      },
    ]);

    renderWithRoute(<CompetitionPage />, {
      path: "/competitions/:competitionKey",
      route: "/competitions/fa-cup",
    });

    await screen.findByRole("heading", { name: "FA Cup" });
    expect(screen.getAllByText("Datos históricos").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: "Manchester City vs Arsenal",
      }),
    ).toBeInTheDocument();
  });

  it("shows a controlled unavailable state for unknown competitions", async () => {
    renderWithRoute(<CompetitionPage />, {
      path: "/competitions/:competitionKey",
      route: "/competitions/not-authorized",
    });

    await screen.findByText("Competición no disponible");
    expect(
      screen.getByText(
        "La competición solicitada no está habilitada o no existe en la disponibilidad pública actual.",
      ),
    ).toBeInTheDocument();
  });

  it("preserves the selected competition from the route and loads only that public filter", async () => {
    const view = renderWithRoute(<CompetitionPage />, {
      path: "/competitions/:competitionKey",
      route: "/competitions/fa-cup?team=200",
    });

    expect(
      await within(view.container).findAllByText("FA Cup"),
    ).not.toHaveLength(0);
    expect(backendApi.getTodayFixtures).toHaveBeenCalledWith(
      {
        competition: "fa-cup",
      },
      expect.any(Object),
    );
  });
});
