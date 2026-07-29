export const DASHBOARD_TEXT = {
  eyebrow: "Fase 6",
  title: "Radiografia diaria de predicciones",
  description:
    "Consulta el Top 5 del backend, el listado completo de la ventana cargada y el estado operativo mas reciente.",
  timezoneLabel: "Zona horaria",
  pendingFiltersLabel: "Actualizando filtros...",
  loadingTitle: "Cargando dashboard",
  errorTitle: "No pudimos cargar el dashboard",
  emptyDashboardTitle: "Sin predicciones cargadas",
  topEyebrow: "Orden del backend",
  topTitle: "Top 5 del dia",
  topDescription:
    "Orden definido por backend. El frontend no recalcula ranking ni edge.",
  topEmptyTitle: "Top 5 no disponible",
  topPartialNote:
    "Se muestran solo las predicciones elegibles persistidas. No hubo suficientes analisis para completar cinco posiciones.",
  listEyebrow: "Listado completo",
  listTitle: "Todas las predicciones cargadas",
  listDescription:
    "Los filtros operan sobre los contratos reales disponibles. El filtro de fecha se aplica localmente sobre la ventana diaria cargada.",
  listEmptyTitle: "Sin resultados",
  filtersEyebrow: "Filtros",
  filtersTitle: "Filtros de lectura",
  filtersDescription:
    "Competicion, mercado, recomendacion, calidad y origen de explicacion vienen del backend. La fecha filtra solo la ventana ya cargada.",
  clearFilters: "Limpiar filtros",
  filterLabels: {
    date: "Fecha",
    competition: "Competicion",
    market: "Mercado",
    recommendation: "Recomendacion",
    dataQuality: "Calidad de datos",
    explanationSource: "Origen de explicacion",
  },
  card: {
    market: "Mercado",
    selection: "Seleccion",
    model: "Modelo",
    marketProbability: "Mercado",
    edge: "Edge",
    confidence: "Confidence",
    noExplanation: "Sin explicacion",
    openDetail: "Abrir detalle",
  },
  summary: {
    total: "Predicciones cargadas",
    consider: "Recomendaciones CONSIDER",
    lowQuality: "Omitidas por baja calidad",
    latestRun: "Ultima ejecucion",
  },
};
