function readRequiredString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function readBaseUrl() {
  const candidate = readRequiredString(
    import.meta.env.VITE_API_BASE_URL,
    "http://localhost:3000",
  );

  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    throw new Error("VITE_API_BASE_URL must be a valid absolute URL");
  }
}

export const appEnv = {
  appName: readRequiredString(import.meta.env.VITE_APP_NAME, "PronostIA"),
  apiBaseUrl: readBaseUrl(),
  timezone: readRequiredString(
    import.meta.env.VITE_APP_TIMEZONE,
    "America/Argentina/Buenos_Aires",
  ),
};
