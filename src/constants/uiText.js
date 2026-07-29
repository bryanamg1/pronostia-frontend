export const UI_TEXT = {
  appName: "PronostIA",
  appTagline: "Dashboard diario de análisis prepartido auditables",
  navigation: {
    dashboard: "Dashboard diario",
  },
  shell: {
    eyebrow: "PANEL TÉCNICO",
    footer:
      "PronostIA expone estimaciones estadísticas auditables. No garantiza resultados ni ejecuta apuestas.",
  },
  actions: {
    retry: "Reintentar",
    refreshDashboard: "Actualizar dashboard",
    backToDashboard: "Volver al dashboard",
  },
  responsibleUse: {
    eyebrow: "Uso responsable",
    title: "Uso responsable",
    points: [
      "PronostIA ofrece estimaciones estadísticas prepartido.",
      "No existen apuestas seguras ni resultados garantizados.",
      "El rendimiento histórico no garantiza resultados futuros.",
      "La decisión final siempre pertenece al usuario.",
      "La información de cuotas es solo para adultos y debe leerse con prudencia.",
    ],
  },
  states: {
    loading: "Cargando información del dashboard.",
    emptyDashboard: "No hay predicciones disponibles en esta vista.",
    emptyFilters: "Los filtros activos no devolvieron resultados.",
    emptyTop:
      "No hubo suficientes predicciones elegibles para completar el Top 5.",
    notFound: "No encontramos la vista solicitada.",
    invalidPrediction:
      "El identificador de predicción no es válido para consultar un detalle.",
    noExplanation: "No hay explicación persistida para esta predicción.",
    noAnalysis: "No hay análisis adicional disponible para esta predicción.",
  },
  errors: {
    network: "No pudimos conectar con el backend local.",
    invalidResponse: "El backend devolvió una respuesta inválida.",
    unavailable: "El servicio no está disponible temporalmente.",
    generic: "Ocurrió un error al cargar la información.",
  },
};
