import { Link, NavLink } from "react-router-dom";

import { UI_TEXT } from "../constants/uiText.js";

export function AppShell({ children }) {
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
        <nav aria-label="Navegacion principal">
          <NavLink
            className={({ isActive }) =>
              `app-shell__nav-link${isActive ? " app-shell__nav-link--active" : ""}`
            }
            to="/dashboard"
          >
            {UI_TEXT.navigation.dashboard}
          </NavLink>
        </nav>
      </header>
      <main className="app-shell__main">{children}</main>
      <footer className="app-shell__footer">
        <p>{UI_TEXT.shell.footer}</p>
      </footer>
    </div>
  );
}
