import { Link, useLocation } from "react-router-dom";

import { UI_TEXT } from "../constants/uiText.js";

export function AppShell({ children }) {
  const location = useLocation();
  const isDashboardRoute = location.pathname === "/dashboard";
  const isCompetitionsRoute = location.pathname.startsWith("/competitions");

  function renderNavItem({ active, href, label }) {
    if (active) {
      return (
        <span
          aria-current="page"
          className="app-shell__nav-link app-shell__nav-link--active"
        >
          {label}
        </span>
      );
    }

    return (
      <Link className="app-shell__nav-link" to={href}>
        {label}
      </Link>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-shell__background" aria-hidden="true" />
      <header className="app-shell__header">
        <div>
          <p className="app-shell__eyebrow">{UI_TEXT.shell.eyebrow}</p>
          <Link className="app-shell__brand" to="/dashboard">
            {UI_TEXT.appName}
          </Link>
          <p className="app-shell__tagline">{UI_TEXT.appTagline}</p>
        </div>
        <nav aria-label="Navegación principal">
          <div className="app-shell__nav-list">
            {renderNavItem({
              active: isDashboardRoute,
              href: "/dashboard",
              label: UI_TEXT.navigation.dashboard,
            })}
            {renderNavItem({
              active: isCompetitionsRoute,
              href: "/competitions",
              label: UI_TEXT.navigation.competitions,
            })}
          </div>
        </nav>
      </header>
      <main className="app-shell__main">{children}</main>
      <footer className="app-shell__footer">
        <p>{UI_TEXT.shell.footer}</p>
      </footer>
    </div>
  );
}
