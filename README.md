# PronostIA Frontend

Frontend publico de PronostIA para visualizar predicciones persistidas, explicaciones almacenadas y estados operativos sin recalcular metricas ni llamar a OpenAI desde el navegador.

## Estado

Fase 6 en implementacion sobre React + Vite.

## Stack

- React 19
- Vite 7
- React Router
- Vitest + Testing Library
- ESLint + Prettier
- Arquitectura por features

## Variables de entorno

Copiar `.env.example` y completar segun el backend local:

- `VITE_API_BASE_URL`
- `VITE_APP_NAME`
- `VITE_APP_TIMEZONE`

No se usan API keys ni secretos en el frontend.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm test`
- `npm run test:watch`
- `npm run test:coverage`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`
- `npm run check`

## Rutas

- `/` redirige a `/dashboard`
- `/dashboard` muestra resumen diario, Top 5, listado completo, filtros y ultima ejecucion
- `/competitions` muestra el catalogo publico agrupado en ligas nacionales, copas nacionales y competiciones internacionales
- `/competitions/:competitionKey` muestra el detalle persistido de una competicion autorizada
- `/predictions/:predictionId` muestra detalle persistido de la prediccion
- `*` muestra una vista 404

## Arquitectura

La aplicacion sigue arquitectura por features:

- `src/app`: bootstrap y configuracion
- `src/features/dashboard`: dashboard diario
- `src/features/predictions`: detalle y adapters
- `src/components`, `src/layouts`, `src/routes`, `src/services`, `src/utils`: piezas compartidas

El frontend consume contratos publicos del backend y transforma DTOs con adapters de solo lectura.

## Contratos consumidos

- `GET /api/competitions`
- `GET /api/fixtures/today`
- `GET /api/system/runs/latest`
- `GET /api/predictions/today`
- `GET /api/predictions/top`
- `GET /api/predictions/:id`

Filtros enviados al backend en `/api/predictions/today`:

- `competition`
- `market`
- `recommendation`
- `dataQuality`
- `explanationSource`

El filtro `date` se aplica localmente sobre la ventana ya cargada.
Los filtros `competitionType` y `competitionRegion` se mantienen como query params de la navegacion publica y se resuelven localmente sobre el catalogo ya cargado.

El catalogo visible se consolida en una sola tarjeta por `competitionKey`, aunque existan varias temporadas persistidas. Las siete copas nacionales agregadas en esta fase usan el mismo flujo de navegacion que las ligas y muestran su disponibilidad publica sin inventar partidos ni pronosticos.

## Estados UI

La interfaz implementa:

- loading
- empty
- error
- success
- explicacion OpenAI
- fallback determinista
- ausencia de explicacion

## Uso responsable

PronostIA ofrece estimaciones estadisticas. No garantiza resultados, no ejecuta apuestas y no muestra lenguaje de certeza o urgencia artificial.
