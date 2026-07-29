import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { backendApi } from "../../../services/backendApi.js";
import {
  competitionsDto,
  fixtureDtos,
  latestRunDto,
} from "../../../test/fixtures/predictions.js";
import { renderWithRoute } from "../../../test/renderWithRouter.jsx";
import { CompetitionsPage } from "./CompetitionsPage.jsx";

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

describe("CompetitionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    backendApi.getCompetitions.mockResolvedValue(competitionsDto);
    backendApi.getTodayFixtures.mockResolvedValue(fixtureDtos);
    backendApi.getLatestSystemRun.mockResolvedValue(latestRunDto);
  });

  it("renders the eleven authorized competition links in stable order", async () => {
    renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route: "/competitions",
    });

    await screen.findByRole("heading", { name: "Ligas y competiciones" });

    const competitionLinks = screen.getAllByRole("link", {
      name: /.+/,
    });
    const competitionNames = competitionLinks
      .map((link) => link.textContent)
      .filter((text) =>
        competitionsDto.some((competition) => text?.includes(competition.name)),
      );

    expect(competitionNames).toEqual(
      competitionsDto.map((competition) =>
        expect.stringContaining(competition.name),
      ),
    );
    expect(
      screen.getAllByText("Pronósticos disponibles").length,
    ).toBeGreaterThan(0);
  });
});
