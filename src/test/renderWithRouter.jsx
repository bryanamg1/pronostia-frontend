import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";

export function renderWithRoute(element, { path = "/", route = path } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>,
  );
}
