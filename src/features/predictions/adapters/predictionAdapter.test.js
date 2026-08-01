import { describe, expect, it } from "vitest";

import {
  adaptPrediction,
  PredictionAdapterError,
} from "./predictionAdapter.js";
import {
  predictionDtos,
  predictionWithoutExplanationDto,
} from "../../../test/fixtures/predictions.js";

const timezone = "America/Argentina/Buenos_Aires";

function cloneDto(value) {
  return JSON.parse(JSON.stringify(value));
}

describe("predictionAdapter", () => {
  it("maps persisted prediction dto into a safe view model", () => {
    const prediction = adaptPrediction(predictionDtos[0], { timezone });

    expect(prediction.selection.marketLabel).toBe("Resultado final");
    expect(prediction.selection.modelProbabilityLabel).toBe("58.0%");
    expect(prediction.selection.edgeLabel).toBe("7.0 pp");
    expect(prediction.selection.confidenceLabel).toBe("78/100");
    expect(prediction.explanation.presentationLabel).toBe(
      "Explicación asistida por IA",
    );
    expect(prediction.explanation.summary).toContain(
      "<strong>Arsenal</strong>",
    );
  });

  it("normalizes missing optional values without inventing numbers", () => {
    const prediction = adaptPrediction(predictionDtos[1], { timezone });

    expect(prediction.selection.marketProbability).toBeNull();
    expect(prediction.selection.marketProbabilityLabel).toBe("No disponible");
    expect(prediction.selection.edgeLabel).toBe("No disponible");
  });

  it("synthesizes a deterministic fallback when the dto has no persisted explanation", () => {
    const prediction = adaptPrediction(predictionWithoutExplanationDto, {
      timezone,
    });

    expect(prediction.explanation.status).toBe("EXPLANATION_FALLBACK");
    expect(prediction.explanation.source).toBe("DETERMINISTIC_FALLBACK");
    expect(prediction.explanation.presentationLabel).toBe(
      "Resumen estadístico automático",
    );
    expect(prediction.explanation.summary).toContain(
      "PronostIA estima que victoria local es la lectura principal del partido",
    );
    expect(prediction.explanation.marketAnalysis).toContain(
      "Diferencia estimada: 7.0 pp.",
    );
  });

  it("translates double chance, quality flags and confidence bands for the public view", () => {
    const dto = cloneDto(predictionWithoutExplanationDto);
    dto.selection.market = "DOUBLE_CHANCE";
    dto.selection.value = "HOME_OR_DRAW";
    dto.selection.confidenceScore = 68;
    dto.selection.riskLevel = "HIGH";
    dto.analysis.dataQuality.status = "LIMITED";
    dto.analysis.dataQuality.flags = ["LOW_SAMPLE_HOME", "LOW_SAMPLE_AWAY"];

    const prediction = adaptPrediction(dto, { timezone });

    expect(prediction.selection.marketLabel).toBe("Doble oportunidad");
    expect(prediction.selection.valueLabel).toBe("Local o empate (1X)");
    expect(prediction.selection.confidenceBandLabel).toBe("Media");
    expect(prediction.selection.riskLabel).toBe("Alto");
    expect(prediction.analysis.dataQuality.statusLabel).toBe("Limitada");
    expect(prediction.analysis.dataQuality.flagLabels).toEqual([
      "Muestra histórica limitada del equipo local.",
      "Muestra histórica limitada del equipo visitante.",
    ]);
  });

  it("keeps a readable fallback while an explanation is pending", () => {
    const dto = cloneDto(predictionWithoutExplanationDto);
    dto.explanation = {
      status: "EXPLANATION_PENDING",
      generatedAt: "2026-07-29T09:13:00.000Z",
    };

    const prediction = adaptPrediction(dto, { timezone });

    expect(prediction.explanation.status).toBe("EXPLANATION_PENDING");
    expect(prediction.explanation.source).toBe("DETERMINISTIC_FALLBACK");
    expect(prediction.explanation.presentationLabel).toBe(
      "Preparando explicación",
    );
    expect(prediction.explanation.summary).toContain("PronostIA estima que");
  });

  it("marks the explanation as unavailable only when minimum deterministic data is missing", () => {
    const dto = cloneDto(predictionWithoutExplanationDto);
    dto.analysis = null;

    const prediction = adaptPrediction(dto, { timezone });

    expect(prediction.analysis).toBeNull();
    expect(prediction.explanation.status).toBe("EXPLANATION_UNAVAILABLE");
    expect(prediction.explanation.presentationLabel).toBe(
      "Explicación no disponible por falta de datos",
    );
    expect(prediction.explanation.source).toBeNull();
  });

  it("throws a controlled error when the dto contract is invalid", () => {
    expect(() =>
      adaptPrediction(
        {
          id: 99,
          selection: {},
        },
        { timezone },
      ),
    ).toThrow(PredictionAdapterError);
  });
});
