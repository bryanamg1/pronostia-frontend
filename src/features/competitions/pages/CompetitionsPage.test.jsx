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

  it("renders the eighteen authorized competition links grouped into the three public sections", async () => {
    const view = renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route: "/competitions",
    });

    await within(view.container).findAllByText("Ligas y competiciones");

    expect(
      within(view.container).getByRole("heading", {
        name: "Ligas nacionales",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(
      within(view.container).getByRole("heading", {
        name: "Copas nacionales",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(
      within(view.container).getByRole("heading", {
        name: "Competiciones internacionales",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(
      within(view.container).getAllByRole("link", {
        name: "Ver competición",
      }),
    ).toHaveLength(18);
  });

  it("renders seven domestic cup cards exactly once even when duplicate seasons arrive", async () => {
    backendApi.getCompetitions.mockResolvedValueOnce([
      ...competitionsDto,
      {
        ...competitionsDto[7],
        season: 2024,
      },
      {
        ...competitionsDto[8],
        season: 2024,
      },
      {
        ...competitionsDto[9],
        season: 2024,
      },
    ]);

    const view = renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route: "/competitions",
    });

    await within(view.container).findAllByText("Ligas y competiciones");
    const cupsGrid = view.container.querySelector(
      ".competition-group:nth-of-type(2) .competition-grid",
    );
    const cupsQueries = within(cupsGrid);

    expect(
      cupsQueries.getAllByRole("heading", {
        level: 3,
      }),
    ).toHaveLength(7);
    expect(
      cupsQueries.getAllByRole("heading", {
        name: "Copa del Rey",
        level: 3,
      }),
    ).toHaveLength(1);
    expect(
      cupsQueries.getAllByRole("heading", {
        name: "FA Cup",
        level: 3,
      }),
    ).toHaveLength(1);
    expect(
      cupsQueries.getAllByRole("heading", {
        name: "Copa Argentina",
        level: 3,
      }),
    ).toHaveLength(1);
  });

  it("filters competition cards by type and geography and preserves those query params", async () => {
    const user = userEvent.setup();

    const view = renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route:
        "/competitions?competitionType=DOMESTIC_CUP&competitionRegion=Spain",
    });

    await screen.findByDisplayValue("Copa nacional");
    expect(
      screen.getByRole("option", { name: "España", selected: true }),
    ).toBeInTheDocument();

    await within(view.container).findAllByText("Ligas y competiciones");

    expect(
      within(view.container.querySelector(".competition-panel")).getAllByRole(
        "heading",
        {
          name: "Copa del Rey",
          level: 3,
        },
      ),
    ).toHaveLength(1);
    expect(
      within(view.container.querySelector(".competition-panel")).queryByRole(
        "heading",
        {
          name: "FA Cup",
          level: 3,
        },
      ),
    ).not.toBeInTheDocument();

    const filtersPanel = view.container.querySelector(".filters-panel");

    await user.selectOptions(
      within(filtersPanel).getByLabelText("Tipo de competición"),
      "DOMESTIC_LEAGUE",
    );

    await screen.findByDisplayValue("Liga nacional");
    await waitFor(() => {
      expect(
        within(view.container.querySelector(".competition-panel")).queryByRole(
          "heading",
          {
            name: "Copa del Rey",
            level: 3,
          },
        ),
      ).not.toBeInTheDocument();
    });
    expect(
      within(view.container.querySelector(".competition-panel")).getAllByRole(
        "heading",
        {
          name: "LaLiga",
          level: 3,
        },
      ).length,
    ).toBeGreaterThan(0);
  });

  it("clears incompatible competition and team query params when the selected geography changes the visible catalog", async () => {
    const view = renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route:
        "/competitions?competitionType=DOMESTIC_CUP&competitionRegion=Argentina&competition=fa-cup&team=200",
    });

    await screen.findByDisplayValue("Copa nacional");
    expect(
      screen.getByRole("option", { name: "Argentina", selected: true }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        within(view.container.querySelector(".filters-panel")).getByLabelText(
          "Competición",
        ),
      ).toHaveValue("");
    });
    expect(
      within(view.container.querySelector(".filters-panel")).getByLabelText(
        "Equipo",
      ),
    ).toBeDisabled();
    expect(
      within(view.container.querySelector(".competition-panel")).getAllByRole(
        "heading",
        {
          name: "Copa Argentina",
          level: 3,
        },
      ),
    ).toHaveLength(1);
    expect(
      within(view.container.querySelector(".competition-panel")).queryByRole(
        "heading",
        {
          name: "FA Cup",
          level: 3,
        },
      ),
    ).not.toBeInTheDocument();
  });

  it("exposes stable cup navigation links", async () => {
    const view = renderWithRoute(<CompetitionsPage />, {
      path: "/competitions",
      route: "/competitions",
    });

    await within(view.container).findAllByText("Ligas y competiciones");
    const cupContainer = view.container.querySelector(
      ".competition-panel .competition-group:nth-of-type(2)",
    );
    const cupQueries = within(cupContainer);
    const copaDelReyCard = cupQueries
      .getByRole("heading", { name: "Copa del Rey", level: 3 })
      .closest("article");
    const faCupCard = cupQueries
      .getByRole("heading", { name: "FA Cup", level: 3 })
      .closest("article");
    const copaArgentinaCard = cupQueries
      .getByRole("heading", { name: "Copa Argentina", level: 3 })
      .closest("article");

    expect(
      within(copaDelReyCard).getByRole("link", { name: "Ver competición" }),
    ).toHaveAttribute("href", "/competitions/copa-del-rey");
    expect(
      within(faCupCard).getByRole("link", { name: "Ver competición" }),
    ).toHaveAttribute("href", "/competitions/fa-cup");
    expect(
      within(copaArgentinaCard).getByRole("link", {
        name: "Ver competición",
      }),
    ).toHaveAttribute("href", "/competitions/copa-argentina");
  });
});
