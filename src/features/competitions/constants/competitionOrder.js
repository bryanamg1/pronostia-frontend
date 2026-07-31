import { COMPETITION_DEFINITIONS } from "./competitionDefinition.js";

export const AUTHORIZED_COMPETITION_ORDER = COMPETITION_DEFINITIONS.map(
  ({ key }) => key,
);
