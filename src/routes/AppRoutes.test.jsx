import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { AppRoutes } from "./AppRoutes.jsx";
import { backendApi } from "../services/backendApi.js";
import { competitionsDto, latestRunDto } from "../test/fixtures/predictions.js";

vi.mock("../services/backendApi.js", () => ({
  backendApi: {
    getCompetitions: vi.fn(),
    getLatestSystemRun: vi.fn(),
    getTodayPredictions: vi.fn(),
    getTopPredictions: vi.fn(),
    getPredictionById: vi.fn(),
  },
}));

describe("AppRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    backendApi.getCompetitions.mockResolvedValue(competitionsDto);
    backendApi.getLatestSystemRun.mockResolvedValue(latestRunDto);
    backendApi.getTodayPredictions.mockResolvedValue([]);
    backendApi.getTopPredictions.mockResolvedValue([]);
  });

  it("redirects root traffic to the dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await screen.findByText("Sin predicciones cargadas");
  });

  it("renders a useful 404 state for unknown routes", async () => {
    render(
      <MemoryRouter initialEntries={["/missing"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Volver al dashboard")).toBeInTheDocument();
  });
});
