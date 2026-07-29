import { screen, waitFor } from "@testing-library/react";
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

  it("renders a valid competition with fixtures and prediction links", async () => {
    renderWithRoute(<CompetitionPage />, {
      path: "/competitions/:competitionKey",
      route: "/competitions/premier-league",
    });

    await screen.findByRole("heading", { name: "Premier League" });
    expect(
      screen.getByRole("link", { name: "Ver pronóstico" }),
    ).toHaveAttribute("href", "/predictions/17");
    expect(screen.getByText("Datos históricos")).toBeInTheDocument();
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
});
