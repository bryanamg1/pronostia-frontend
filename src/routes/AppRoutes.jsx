import { Link, Navigate, Route, Routes } from "react-router-dom";

import { InfoState } from "../components/InfoState.jsx";
import { UI_TEXT } from "../constants/uiText.js";
import { CompetitionPage } from "../features/competitions/pages/CompetitionPage.jsx";
import { CompetitionsPage } from "../features/competitions/pages/CompetitionsPage.jsx";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage.jsx";
import { PredictionDetailPage } from "../features/predictions/pages/PredictionDetailPage.jsx";
import { AppShell } from "../layouts/AppShell.jsx";

function NotFoundPage() {
  return (
    <InfoState
      title="404"
      description={UI_TEXT.states.notFound}
      actions={<Link to="/dashboard">{UI_TEXT.actions.backToDashboard}</Link>}
      tone="warning"
    />
  );
}

export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route
          path="/competitions/:competitionKey"
          element={<CompetitionPage />}
        />
        <Route
          path="/predictions/:predictionId"
          element={<PredictionDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
