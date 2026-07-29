export const UI_TEXT = {
  appName: "PronostIA",
  appTagline: "Dashboard diario de analisis prepartido auditables",
  navigation: {
    dashboard: "Dashboard diario",
  },
  shell: {
    eyebrow: "Panel tecnico",
    footer:
      "PronostIA expone estimaciones estadisticas auditables. No garantiza resultados ni ejecuta apuestas.",
  },
  actions: {
    retry: "Reintentar",
    backToDashboard: "Volver al dashboard",
  },
  responsibleUse: {
    title: "Uso responsable",
    points: [
      "PronostIA ofrece estimaciones estadisticas prepartido.",
      "No existen apuestas seguras ni resultados garantizados.",
      "El rendimiento historico no garantiza resultados futuros.",
      "La decision final siempre pertenece al usuario.",
      "La informacion de cuotas es solo para adultos y debe leerse con prudencia.",
    ],
  },
  states: {
    loading: "Cargando informacion del dashboard.",
    emptyDashboard:
      "No hay predicciones disponibles en la ventana diaria cargada.",
    emptyFilters: "Los filtros activos no devolvieron resultados.",
    emptyTop:
      "No hubo suficientes predicciones elegibles para completar el Top 5.",
    notFound: "No encontramos la vista solicitada.",
    invalidPrediction:
      "El identificador de prediccion no es valido para consultar un detalle.",
    noExplanation: "No hay explicacion persistida para esta prediccion.",
    noAnalysis: "No hay analisis adicional disponible para esta prediccion.",
  },
  errors: {
    network: "No pudimos conectar con el backend local.",
    invalidResponse: "El backend devolvio una respuesta invalida.",
    unavailable: "El servicio no esta disponible temporalmente.",
    generic: "Ocurrio un error al cargar la informacion.",
  },
};
