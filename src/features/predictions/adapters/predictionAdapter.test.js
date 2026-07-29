import { describe, expect, it } from "vitest";

import {
  adaptPrediction,
  PredictionAdapterError,
} from "./predictionAdapter.js";
import {
  predictionDtos,
  predictionWithoutExplanationDto,
} from "../../../test/fixtures/predictions.js";

describe("predictionAdapter", () => {
  it("maps persisted prediction dto into a safe view model", () => {
    const prediction = adaptPrediction(predictionDtos[0], {
      timezone: "America/Argentina/Buenos_Aires",
    });

    expect(prediction.selection.modelProbabilityLabel).toBe("58.0%");
    expect(prediction.selection.edgeLabel).toBe("7.0 pp");
    expect(prediction.selection.confidenceLabel).toBe("78/100");
    expect(prediction.explanation.summary).toContain(
      "<strong>Arsenal</strong>",
    );
  });

  it("normalizes missing optional values without inventing numbers", () => {
    const prediction = adaptPrediction(predictionDtos[1], {
      timezone: "America/Argentina/Buenos_Aires",
    });

    expect(prediction.selection.marketProbability).toBeNull();
    expect(prediction.selection.marketProbabilityLabel).toBe("No disponible");
    expect(prediction.selection.edgeLabel).toBe("No disponible");
  });

  it("supports predictions without persisted explanation", () => {
    const prediction = adaptPrediction(predictionWithoutExplanationDto, {
      timezone: "America/Argentina/Buenos_Aires",
    });

    expect(prediction.explanation).toBeNull();
  });

  it("throws a controlled error when the dto contract is invalid", () => {
    expect(() =>
      adaptPrediction(
        {
          id: 99,
          selection: {},
        },
        {
          timezone: "America/Argentina/Buenos_Aires",
        },
      ),
    ).toThrow(PredictionAdapterError);
  });
});
