export const DASHBOARD_TEXT = {
  eyebrow: "Fase 6",
  title: "Radiografía diaria de predicciones",
  description:
    "Consulta el Top 5 del backend, el listado completo de la ventana cargada y el estado operativo más reciente.",
  timezoneLabel: "Zona horaria",
  pendingFiltersLabel: "Actualizando filtros...",
  loadingTitle: "Cargando dashboard",
  errorTitle: "No pudimos cargar el dashboard",
  emptyEyebrow: "Estado diario",
  emptyDashboardTitle: "No encontramos predicciones para la ventana actual",
  emptyDashboardDescription:
    "PronostIA solo muestra análisis cuando existen partidos disponibles y se cumplen los criterios mínimos de calidad.",
  emptyStateMeta: {
    window: "Ventana consultada",
    latestRun: "Última ejecución",
    lastUpdated: "Última actualización",
  },
  topEyebrow: "Orden del backend",
  topTitle: "Top 5 del día",
  topDescription:
    "Orden definido por backend. El frontend no recalcula ranking ni edge.",
  topEmptyTitle: "Top 5 no disponible",
  topPartialNote:
    "Se muestran solo las predicciones elegibles persistidas. No hubo suficientes análisis para completar cinco posiciones.",
  listEyebrow: "Listado completo",
  listTitle: "Todas las predicciones cargadas",
  listDescription:
    "Los filtros operan sobre los contratos reales disponibles. El filtro de fecha se aplica localmente sobre la ventana diaria cargada.",
  listEmptyTitle: "Sin resultados",
  filtersEyebrow: "Filtros",
  filtersTitle: "Filtros de lectura",
  filtersDescription:
    "Competición, mercado, recomendación, calidad y origen de explicación vienen del backend. La fecha filtra solo la ventana ya cargada.",
  clearFilters: "Limpiar filtros",
  filterLabels: {
    date: "Fecha",
    competition: "Competición",
    market: "Mercado",
    recommendation: "Recomendación",
    dataQuality: "Calidad de datos",
    explanationSource: "Origen de explicación",
  },
  card: {
    market: "Mercado",
    selection: "Selección",
    model: "Modelo",
    marketProbability: "Mercado",
    edge: "Edge",
    confidence: "Confidence",
    noExplanation: "Sin explicación",
    openDetail: "Abrir detalle",
  },
  summary: {
    total: "Predicciones cargadas",
    consider: "Recomendaciones CONSIDER",
    lowQuality: "Omitidas por baja calidad",
    latestRun: "Última ejecución",
  },
};
