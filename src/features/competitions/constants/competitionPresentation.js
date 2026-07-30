const competitionPresentationMap = {
  laliga: {
    regionLabel: "España",
  },
  "premier-league": {
    regionLabel: "Inglaterra",
  },
  "ligue-1": {
    regionLabel: "Francia",
  },
  "serie-a-italy": {
    regionLabel: "Italia",
  },
  bundesliga: {
    regionLabel: "Alemania",
  },
  "liga-profesional-arg": {
    regionLabel: "Argentina",
  },
  "serie-a-brazil": {
    regionLabel: "Brasil",
  },
  "uefa-champions-league": {
    regionLabel: "Europa",
  },
  "uefa-europa-league": {
    regionLabel: "Europa",
  },
  "conmebol-libertadores": {
    regionLabel: "Sudamérica",
  },
  "conmebol-sudamericana": {
    regionLabel: "Sudamérica",
  },
};

export function getCompetitionPresentation(competitionKey) {
  return competitionPresentationMap[competitionKey] ?? null;
}
