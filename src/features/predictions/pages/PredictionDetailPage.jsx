import { Link, useParams } from "react-router-dom";

import { InfoState } from "../../../components/InfoState.jsx";
import { ResponsibleUsePanel } from "../../../components/ResponsibleUsePanel.jsx";
import { UI_TEXT } from "../../../constants/uiText.js";
import { AnalysisPanel } from "../components/AnalysisPanel.jsx";
import { ExplanationPanel } from "../components/ExplanationPanel.jsx";
import { PredictionDetailHero } from "../components/PredictionDetailHero.jsx";
import { SelectionOverview } from "../components/SelectionOverview.jsx";
import { PREDICTION_TEXT } from "../constants/predictionText.js";
import { usePredictionDetail } from "../hooks/usePredictionDetail.js";

export function PredictionDetailPage() {
  const { predictionId } = useParams();
  const parsedPredictionId = Number(predictionId);
  const state = usePredictionDetail(
    Number.isInteger(parsedPredictionId) && parsedPredictionId > 0
      ? parsedPredictionId
      : null,
  );

  if (!Number.isInteger(parsedPredictionId) || parsedPredictionId <= 0) {
    return (
      <InfoState
        title={PREDICTION_TEXT.invalidTitle}
        description={UI_TEXT.states.invalidPrediction}
        tone="danger"
      />
    );
  }

  if (state.status === "loading") {
    return (
      <InfoState
        title={PREDICTION_TEXT.loadingTitle}
        description={UI_TEXT.states.loading}
        tone="neutral"
      />
    );
  }

  if (state.status === "error") {
    if (state.error === "PREDICTION_NOT_FOUND") {
      return (
        <InfoState
          title={PREDICTION_TEXT.notFoundTitle}
          description={PREDICTION_TEXT.notFoundDescription}
          tone="warning"
          actions={
            <Link to="/dashboard">{UI_TEXT.actions.backToDashboard}</Link>
          }
        />
      );
    }

    return (
      <InfoState
        title={PREDICTION_TEXT.errorTitle}
        description={state.error}
        tone="danger"
      />
    );
  }

  return (
    <div className="page-stack">
      <PredictionDetailHero prediction={state.data} />
      <SelectionOverview prediction={state.data} />
      <AnalysisPanel prediction={state.data} />
      <ExplanationPanel prediction={state.data} />
      <ResponsibleUsePanel />
    </div>
  );
}
