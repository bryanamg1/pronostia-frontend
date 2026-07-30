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
      within(view.container).getAllByRole("link", {
        name: /Ver competici.n/u,
      }),
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
      within(view.container).getAllByRole("link", {
        name: /Ver competici.n/u,
      }),
    ).toHaveLength(2);
  });

  it("renders Spanish geographic labels and never repeats authorized cards by season", async () => {
    backendApi.getCompetitions.mockResolvedValueOnce([
      ...competitionsDto,
      {
        ...competitionsDto[0],
        id: 1400,
        season: 2025,
      },
      {
        ...competitionsDto[1],
        id: 3900,
        season: 2024,
      },
      {
        ...competitionsDto[2],
        id: 6100,
        season: 2025,
      },
      {
        ...competitionsDto[8],
        id: 3000,
        season: 2025,
      },
    ]);

    const view = renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route: "/competitions",
    });

    await within(view.container).findAllByText("Ligas y competiciones");
    const navigationSection =
      view.container.querySelector(".competition-panel");

    expect(navigationSection).not.toBeNull();
    expect(
      within(navigationSection).getAllByRole("heading", {
        name: "La Liga",
        level: 3,
      }),
    ).toHaveLength(1);
    expect(
      within(navigationSection).getAllByRole("heading", {
        name: "Premier League",
        level: 3,
      }),
    ).toHaveLength(1);
    expect(
      within(navigationSection).getAllByRole("heading", {
        name: "Ligue 1",
        level: 3,
      }),
    ).toHaveLength(1);
    expect(
      within(navigationSection).getAllByRole("heading", {
        name: "UEFA Europa League",
        level: 3,
      }),
    ).toHaveLength(1);
    expect(within(navigationSection).getAllByText(/Espa.a/u)).toHaveLength(1);
    expect(within(navigationSection).getAllByText("Inglaterra")).toHaveLength(
      1,
    );
    expect(
      within(navigationSection).getAllByText("Europa").length,
    ).toBeGreaterThan(0);
    expect(
      within(navigationSection).getAllByRole("link", {
        name: /Ver competici.n/u,
      }),
    ).toHaveLength(11);
  });
});
