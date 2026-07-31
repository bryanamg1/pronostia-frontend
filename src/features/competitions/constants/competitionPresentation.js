import { COMPETITION_DEFINITIONS } from "./competitionDefinition.js";

const competitionPresentationMap = Object.fromEntries(
  COMPETITION_DEFINITIONS.map((competition, displayOrder) => [
    competition.key,
    {
      ...competition,
      displayOrder,
    },
  ]),
);

export function getCompetitionPresentation(competitionKey) {
  return competitionPresentationMap[competitionKey] ?? null;
}
