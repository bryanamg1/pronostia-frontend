export function formatPercentage(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "No disponible";
  }

  return `${(value * 100).toFixed(1)}%`;
}

export function formatEdge(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "No disponible";
  }

  return `${value.toFixed(1)} pp`;
}

export function formatConfidence(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "No disponible";
  }

  return `${Math.round(value)}/100`;
}

export function formatDateTime(value, timeZone) {
  if (!value) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}

export function formatDate(value, timeZone) {
  if (!value) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatRunStatus(status) {
  return (
    {
      COMPLETED: "Completada",
      NO_FIXTURES: "Sin fixtures",
      FAILED: "Fallida",
      PREPARED: "Preparada",
      RUNNING: "En curso",
    }[status] ??
    status ??
    "No disponible"
  );
}
