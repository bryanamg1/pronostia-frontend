import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "./AppRoutes.jsx";
import { backendApi } from "../services/backendApi.js";
import {
  competitionsDto,
  fixtureDtos,
  latestRunDto,
  predictionDtos,
} from "../test/fixtures/predictions.js";

vi.mock("../services/backendApi.js", () => ({
  backendApi: {
    getCompetitions: vi.fn(),
    getTodayFixtures: vi.fn(),
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
    backendApi.getTodayFixtures.mockResolvedValue(fixtureDtos);
    backendApi.getLatestSystemRun.mockResolvedValue(latestRunDto);
    backendApi.getTodayPredictions.mockResolvedValue([]);
    backendApi.getTopPredictions.mockResolvedValue([]);
    backendApi.getPredictionById.mockResolvedValue(predictionDtos[0]);
  });

  it("redirects root traffic to the dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await screen.findByText(
      "No encontramos predicciones para la ventana actual",
    );
    expect(screen.getByText("PANEL TÉCNICO")).toBeInTheDocument();
    expect(
      screen.getByText("Dashboard diario de análisis prepartido auditables"),
    ).toBeInTheDocument();
    expect(screen.getByText("Dashboard diario")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Ligas y competiciones" }),
    ).toBeInTheDocument();
  });

  it("keeps both navigation entries useful outside the dashboard route", async () => {
    render(
      <MemoryRouter initialEntries={["/predictions/17"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "Arsenal vs Chelsea" });
    expect(
      screen.getByRole("link", { name: "Dashboard diario" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Ligas y competiciones" }).length,
    ).toBeGreaterThan(0);
  });

  it("marks competitions navigation as active on competition routes", async () => {
    render(
      <MemoryRouter initialEntries={["/competitions"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await screen.findAllByRole("heading", { name: "Ligas y competiciones" });
    expect(
      screen
        .getAllByText("Ligas y competiciones")
        .some((element) => element.getAttribute("aria-current") === "page"),
    ).toBe(true);
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
