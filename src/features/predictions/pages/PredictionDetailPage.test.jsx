import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { backendApi } from "../../../services/backendApi.js";
import { HttpClientError } from "../../../services/httpClient.js";
import {
  predictionDtos,
  predictionWithoutExplanationDto,
} from "../../../test/fixtures/predictions.js";
import { renderWithRoute } from "../../../test/renderWithRouter.jsx";
import { PredictionDetailPage } from "./PredictionDetailPage.jsx";

vi.mock("../../../services/backendApi.js", () => ({
  backendApi: {
    getCompetitions: vi.fn(),
    getLatestSystemRun: vi.fn(),
    getTodayPredictions: vi.fn(),
    getTopPredictions: vi.fn(),
    getPredictionById: vi.fn(),
  },
}));

function cloneDto(value) {
  return JSON.parse(JSON.stringify(value));
}

function renderPredictionDetail(dto, predictionId = dto.id) {
  backendApi.getPredictionById.mockResolvedValue(dto);

  renderWithRoute(<PredictionDetailPage />, {
    path: "/predictions/:predictionId",
    route: `/predictions/${predictionId}`,
  });
}

describe("PredictionDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the new prediction hierarchy and treats explanation html as plain text", async () => {
    renderPredictionDetail(predictionDtos[0], 17);

    await screen.findByRole("heading", { name: "Arsenal vs Chelsea" });

    expect(screen.getByText("Resumen de PronostIA")).toBeInTheDocument();
    expect(screen.getByText("Pronóstico principal")).toBeInTheDocument();
    expect(screen.getByText("Probabilidades del partido")).toBeInTheDocument();
    expect(screen.getByText("Escenario de goles")).toBeInTheDocument();
    expect(screen.getByText("Comparación con el mercado")).toBeInTheDocument();
    expect(screen.getByText("Calidad y confianza")).toBeInTheDocument();
    expect(screen.getByText("Ver detalles técnicos")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Uso responsable" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Explicación asistida por IA").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("<strong>Arsenal</strong> llega mejor perfilado."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Victoria local").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Empate").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Victoria visitante").length).toBeGreaterThan(0);
    expect(screen.getByText("1.72")).toBeInTheDocument();
    expect(screen.getByText("2.80")).toBeInTheDocument();
    expect(screen.queryByText("Selección persistida")).not.toBeInTheDocument();
    expect(screen.queryByText("Sin explicación")).not.toBeInTheDocument();
  });

  it("shows invalid ids before calling the backend", () => {
    renderWithRoute(<PredictionDetailPage />, {
      path: "/predictions/:predictionId",
      route: "/predictions/not-a-number",
    });

    expect(screen.getByText("ID inválido")).toBeInTheDocument();
    expect(backendApi.getPredictionById).not.toHaveBeenCalled();
  });

  it("shows a not found state for missing predictions", async () => {
    backendApi.getPredictionById.mockRejectedValue(
      new HttpClientError("Missing", {
        status: 404,
        code: "NOT_FOUND",
      }),
    );

    renderWithRoute(<PredictionDetailPage />, {
      path: "/predictions/:predictionId",
      route: "/predictions/404",
    });

    await screen.findByText("Predicción no encontrada");
    expect(
      screen.getByText(/No existe una predicción persistida/),
    ).toBeInTheDocument();
  });

  it("shows a deterministic fallback immediately when the backend dto has no explanation", async () => {
    renderPredictionDetail(predictionWithoutExplanationDto, 19);

    await screen.findByRole("heading", { name: "Liverpool vs Tottenham" });

    expect(
      screen.getAllByText("Resumen estadístico automático").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(
        /PronostIA estima que victoria local es la lectura principal/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Recomendación oficial disponible").length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByText(/Sin explicación persistida/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/^Sin explicación$/i)).not.toBeInTheDocument();
  });

  it("keeps the fallback content visible while the explanation is pending", async () => {
    const pendingDto = cloneDto(predictionWithoutExplanationDto);
    pendingDto.explanation = {
      status: "EXPLANATION_PENDING",
      generatedAt: "2026-07-29T09:13:00.000Z",
    };

    renderPredictionDetail(pendingDto, 19);

    await screen.findByRole("heading", { name: "Liverpool vs Tottenham" });

    expect(
      screen.getAllByText("Preparando explicación").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(
        /PronostIA estima que victoria local es la lectura principal/,
      ),
    ).toBeInTheDocument();
  });

  it("shows an unavailable state only when the dto lacks minimum deterministic data", async () => {
    const unavailableDto = cloneDto(predictionWithoutExplanationDto);
    unavailableDto.analysis = null;
    unavailableDto.explanation = null;

    renderPredictionDetail(unavailableDto, 19);

    await screen.findByRole("heading", { name: "Liverpool vs Tottenham" });

    expect(
      screen.getAllByText("Explicación no disponible por falta de datos")
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "Explicación no disponible por falta de datos deterministas mínimos.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("No disponible").length).toBeGreaterThan(0);
  });
});
