import { within } from "@testing-library/react";
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
    const view = renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route: "/competitions",
    });

    await within(view.container).findAllByText("Ligas y competiciones");

    expect(
      within(view.container)
        .getAllByRole("heading", { level: 3 })
        .map((node) => node.textContent),
    ).toEqual(competitionsDto.map(({ name }) => name));
    expect(
      within(view.container).getAllByRole("link", { name: "Ver competición" }),
    ).toHaveLength(competitionsDto.length);
  });

  it("renders a single card per competition key and keeps the call to action uniform", async () => {
    backendApi.getCompetitions.mockResolvedValueOnce([
      competitionsDto[0],
      competitionsDto[1],
      {
        ...competitionsDto[1],
        id: 3900,
        season: 2025,
      },
    ]);

    const view = renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route: "/competitions",
    });

    await within(view.container).findAllByText("Ligas y competiciones");

    expect(
      within(view.container).getAllByRole("heading", {
        name: "Premier League",
        level: 3,
      }),
    ).toHaveLength(1);
    expect(
      within(view.container).queryByText("Vista actual"),
    ).not.toBeInTheDocument();
    expect(
      within(view.container).getAllByRole("link", { name: "Ver competición" }),
    ).toHaveLength(2);
  });
});
