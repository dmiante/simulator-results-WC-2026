import { Team } from "@/lib/types"

export const LOCALE_COOKIE_NAME = "wc2026-locale"
export const locales = ["en", "es"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

const en = {
  language: {
    label: "Language",
    selectLanguage: "Select language",
    english: "English",
    spanish: "Spanish",
    current: "English",
  },
  metadata: {
    title: "FIFA World Cup 2026 Simulator",
    titleTemplate: "%s | WC 2026 Simulator",
    description:
      "Predict match results and simulate the FIFA World Cup 2026 tournament. Enter scores for all 48 teams across group stages and knockout rounds.",
    shortDescription: "Predict match results and simulate the FIFA World Cup 2026 tournament with 48 teams.",
    siteName: "WC 2026 Simulator",
    locale: "en_US",
    keywords: [
      "FIFA",
      "World Cup",
      "2026",
      "simulator",
      "football",
      "soccer",
      "predictions",
      "bracket",
      "knockout",
      "group stage",
      "world cup predictor",
    ],
  },
  common: {
    tbd: "TBD",
    vs: "vs",
    teams: "Teams",
    groups: "Groups",
    matches: "Matches",
    simulator: "Simulator",
    team: "Team",
    group: "Group",
    qualified: "Qualified",
    eliminated: "Eliminated",
    winner: "Winner",
    penalties: "Pen",
    groupLabel: (groupName: string) => `Group ${groupName}`,
  },
  theme: {
    toggle: "Toggle theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  exportImage: {
    exportImage: "Export Image",
    preparing: "Preparing...",
    shared: "Shared",
    downloaded: "Downloaded",
    tryAgain: "Try Again",
  },
  loading: {
    simulator: "Loading simulator...",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred while loading the simulator.",
    criticalDescription: "A critical error occurred.",
    tryAgain: "Try again",
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
    back: "Back to Simulator",
  },
  header: {
    title: "FIFA World Cup 2026",
    hostCountries: "United States • Mexico • Canada",
    teamsStat: "48 Teams",
    groupsStat: "12 Groups",
    matchesStat: "104 Matches",
  },
  footer: {
    title: "FIFA World Cup 2026 Simulator",
  },
  simulator: {
    title: "Tournament Simulator",
    simulateAll: "Simulate All",
    resetAll: "Reset All",
    tabs: {
      playoffs: "PlayOffs",
      groups: "Group Stage",
      squads: "Squads",
      knockout: "Knockout",
    },
  },
  modes: {
    scores: "Scores",
    positions: "Positions",
  },
  groupStage: {
    title: "Group Stage",
    descriptionMatch: "June 11-27, 2026 • Simulate results and determine the qualifiers",
    descriptionPositions: "Drag from each handle to set finishing positions and choose the best third-place teams",
    simulateGroups: "Simulate Groups",
    resetGroups: "Reset Groups",
    resetPositions: "Reset Positions",
    qualified: "Qualified:",
    firstSecondPlace: "1st & 2nd Place",
    bestThird: "Best 3rd",
    matches: "Matches",
    screenshotGroup: (groupName: string) => `Screenshot group ${groupName}`,
    shareGroup: (groupName: string) => `Share group ${groupName}`,
    groupFilename: (groupName: string) => `Group ${groupName}.png`,
  },
  squads: {
    title: "Official Squads",
    description:
      "Browse the official FIFA squad lists for every team in the group stage. Search by country or confederation and inspect the full 26-player roster.",
    teamsBadge: "48 teams",
    listTitle: "Countries",
    listDescription: "Search and select a team to inspect its official squad.",
    searchLabel: "Search teams",
    searchPlaceholder: "Search by team or confederation...",
    clearSearch: "Clear search",
    resultsCount: (count: number) => `${count} teams found`,
    selectedLabel: "Selected squad",
    noResultsTitle: "No teams found",
    noResultsDescription: "Try another country name, confederation, or team code.",
    sourceLink: "Source",
    announcementLink: "Announcement",
    playersCount: (count: number) => `${count} players`,
    pendingOfficialSource: "Squad pending official source.",
    clubPending: "Club to be confirmed",
    tbd: "TBD",
    positions: {
      goalkeeper: "Goalkeepers",
      defender: "Defenders",
      midfielder: "Midfielders",
      forward: "Forwards",
    },
  },
  standings: {
    rank: "#",
    team: "Team",
    group: "Group",
    played: "P",
    won: "W",
    drawn: "D",
    lost: "L",
    goalsFor: "GF",
    goalsAgainst: "GA",
    goalDifference: "GD",
    points: "Pts",
    unknown: "Unknown",
  },
  positionList: {
    moveTeam: (teamName: string) => `Move ${teamName}`,
    directQualifier: "Direct qualifier",
    thirdPlacePool: "Third-place pool",
    eliminated: "Eliminated",
  },
  thirdPlaces: {
    title: "Third-Place Ranking",
    description: "The best 8 third-place teams qualify for the Round of 32",
    noData: "No data available yet. Enter group results.",
    bestTitle: "Best Third Places",
    bestDescription: "Drag from the handle to rank third-place teams. The top 8 qualify to Round of 32.",
    eliminatedThirdPlaces: "Eliminated Third Places",
    qualifiedConfirmed: "Qualified (confirmed)",
    moveGroupThird: (groupName: string) => `Move Group ${groupName} third-place team`,
  },
  knockout: {
    title: "Knockout Stage",
    descriptionMatch: "June 28-July 19, 2026 - Simulate results and determine the champion",
    descriptionPositions: "Click each winner to advance them through the bracket",
    simulateWinners: "Simulate Winners",
    simulateKnockout: "Simulate Knockout",
    resetKnockout: "Reset Knockout",
    shareBracket: "Share Bracket",
    shareBracketImage: "Share bracket image",
    round32: "Round of 32",
    round16: "Round of 16",
    quarterFinals: "Quarter-Finals",
    semiFinals: "Semi-Finals",
    final: "Final",
    finals: "Finals",
    thirdPlace: "3rd Place",
    worldChampion: "World Champion",
    showRound: (roundTitle: string) => `Show ${roundTitle}`,
  },
  playoffs: {
    title: "Qualification Playoffs",
    description: "March 26-31, 2026 • Determine the final 6 teams for the World Cup",
    uefaShort: "UEFA (4)",
    uefaLong: "UEFA Playoffs (4 spots)",
    icShort: "IC Playoffs (2)",
    icLong: "Inter-Confederation (2 spots)",
    uefaDescription: "16 teams compete in 4 paths • Winners qualify for the World Cup",
    icDescription: "6 teams compete in 2 paths in Mexico • Winners qualify for the World Cup",
    qualifiedSummary: "Qualified Teams Summary",
    pathToGroup: (groupName: string) => `→ Group ${groupName}`,
    uefaPath: (pathName: string) => `UEFA Path ${pathName}`,
    icPath: (pathName: string) => `IC Path ${pathName}`,
    semifinals: (date: string) => `Semifinals - ${date}`,
    semifinal: (date: string) => `Semifinal - ${date}`,
    final: (date: string) => `Final - ${date}`,
    winnerSf: (matchNumber: string) => `Winner SF${matchNumber}`,
    winnerMatch: (matchNumber: string) => `Winner Match ${matchNumber}`,
  },
}

export type Messages = typeof en

const es: Messages = {
  language: {
    label: "Idioma",
    selectLanguage: "Seleccionar idioma",
    english: "Inglés",
    spanish: "Español",
    current: "Español",
  },
  metadata: {
    title: "Simulador de la Copa Mundial FIFA 2026",
    titleTemplate: "%s | Simulador WC 2026",
    description:
      "Predice resultados y simula la Copa Mundial FIFA 2026. Ingresa marcadores para las 48 selecciones en fase de grupos y rondas eliminatorias.",
    shortDescription: "Predice resultados y simula la Copa Mundial FIFA 2026 con 48 selecciones.",
    siteName: "Simulador WC 2026",
    locale: "es_ES",
    keywords: [
      "FIFA",
      "Copa Mundial",
      "Mundial 2026",
      "simulador",
      "fútbol",
      "predicciones",
      "llaves",
      "eliminatorias",
      "fase de grupos",
      "pronosticador mundial",
    ],
  },
  common: {
    tbd: "Por definir",
    vs: "vs",
    teams: "Selecciones",
    groups: "Grupos",
    matches: "Partidos",
    simulator: "Simulador",
    team: "Selección",
    group: "Grupo",
    qualified: "Clasificado",
    eliminated: "Eliminado",
    winner: "Ganador",
    penalties: "Pen",
    groupLabel: (groupName: string) => `Grupo ${groupName}`,
  },
  theme: {
    toggle: "Cambiar tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
  },
  exportImage: {
    exportImage: "Exportar imagen",
    preparing: "Preparando...",
    shared: "Compartido",
    downloaded: "Descargado",
    tryAgain: "Intentar de nuevo",
  },
  loading: {
    simulator: "Cargando simulador...",
  },
  error: {
    title: "Algo salió mal",
    description: "Ocurrió un error inesperado al cargar el simulador.",
    criticalDescription: "Ocurrió un error crítico.",
    tryAgain: "Intentar de nuevo",
  },
  notFound: {
    title: "Página no encontrada",
    description: "La página que buscas no existe.",
    back: "Volver al simulador",
  },
  header: {
    title: "Copa Mundial FIFA 2026",
    hostCountries: "Estados Unidos • México • Canadá",
    teamsStat: "48 Selecciones",
    groupsStat: "12 Grupos",
    matchesStat: "104 Partidos",
  },
  footer: {
    title: "Simulador de la Copa Mundial FIFA 2026",
  },
  simulator: {
    title: "Simulador del Torneo",
    simulateAll: "Simular todo",
    resetAll: "Reiniciar todo",
    tabs: {
      playoffs: "Repechajes",
      groups: "Fase de grupos",
      squads: "Plantillas",
      knockout: "Eliminatorias",
    },
  },
  modes: {
    scores: "Marcadores",
    positions: "Posiciones",
  },
  groupStage: {
    title: "Fase de grupos",
    descriptionMatch: "11-27 de junio de 2026 • Simula resultados y determina los clasificados",
    descriptionPositions: "Arrastra desde cada control para ordenar posiciones y elegir los mejores terceros",
    simulateGroups: "Simular grupos",
    resetGroups: "Reiniciar grupos",
    resetPositions: "Reiniciar posiciones",
    qualified: "Clasificados:",
    firstSecondPlace: "1.º y 2.º lugar",
    bestThird: "Mejor 3.º",
    matches: "Partidos",
    screenshotGroup: (groupName: string) => `Capturar grupo ${groupName}`,
    shareGroup: (groupName: string) => `Compartir grupo ${groupName}`,
    groupFilename: (groupName: string) => `Grupo ${groupName}.png`,
  },
  squads: {
    title: "Plantillas oficiales",
    description:
      "Consulta las plantillas oficiales FIFA de cada selección de la fase de grupos. Busca por país o confederación y revisa los 26 jugadores.",
    teamsBadge: "48 selecciones",
    listTitle: "Países",
    listDescription: "Busca y selecciona una selección para revisar su plantilla oficial.",
    searchLabel: "Buscar selecciones",
    searchPlaceholder: "Buscar por selección o confederación...",
    clearSearch: "Limpiar búsqueda",
    resultsCount: (count: number) => `${count} selecciones encontradas`,
    selectedLabel: "Plantilla seleccionada",
    noResultsTitle: "No se encontraron selecciones",
    noResultsDescription: "Prueba con otro país, confederación o código de selección.",
    sourceLink: "Fuente",
    announcementLink: "Anuncio",
    playersCount: (count: number) => `${count} jugadores`,
    pendingOfficialSource: "Plantilla pendiente de fuente oficial.",
    clubPending: "Club por confirmar",
    tbd: "Por definir",
    positions: {
      goalkeeper: "Porteros",
      defender: "Defensas",
      midfielder: "Mediocampistas",
      forward: "Delanteros",
    },
  },
  standings: {
    rank: "#",
    team: "Selección",
    group: "Grupo",
    played: "PJ",
    won: "G",
    drawn: "E",
    lost: "P",
    goalsFor: "GF",
    goalsAgainst: "GC",
    goalDifference: "DG",
    points: "Pts",
    unknown: "Desconocido",
  },
  positionList: {
    moveTeam: (teamName: string) => `Mover ${teamName}`,
    directQualifier: "Clasificación directa",
    thirdPlacePool: "Bolsa de terceros",
    eliminated: "Eliminado",
  },
  thirdPlaces: {
    title: "Ranking de terceros lugares",
    description: "Los mejores 8 terceros clasifican a la ronda de 32",
    noData: "No hay datos disponibles aún. Ingresa resultados en los grupos.",
    bestTitle: "Mejores terceros lugares",
    bestDescription: "Arrastra desde el control para ordenar terceros. Los 8 mejores clasifican a la ronda de 32.",
    eliminatedThirdPlaces: "Terceros lugares eliminados",
    qualifiedConfirmed: "Clasificado (confirmado)",
    moveGroupThird: (groupName: string) => `Mover el tercer lugar del Grupo ${groupName}`,
  },
  knockout: {
    title: "Fase eliminatoria",
    descriptionMatch: "28 de junio-19 de julio de 2026 - Simula resultados y determina el campeón",
    descriptionPositions: "Haz clic en cada ganador para hacerlo avanzar en la llave",
    simulateWinners: "Simular ganadores",
    simulateKnockout: "Simular eliminatorias",
    resetKnockout: "Reiniciar eliminatorias",
    shareBracket: "Compartir llave",
    shareBracketImage: "Compartir imagen de la llave",
    round32: "Ronda de 32",
    round16: "Octavos de final",
    quarterFinals: "Cuartos de final",
    semiFinals: "Semifinales",
    final: "Final",
    finals: "Finales",
    thirdPlace: "3.er lugar",
    worldChampion: "Campeón mundial",
    showRound: (roundTitle: string) => `Mostrar ${roundTitle}`,
  },
  playoffs: {
    title: "Repechajes de clasificación",
    description: "26-31 de marzo de 2026 • Define las 6 selecciones finales para el Mundial",
    uefaShort: "UEFA (4)",
    uefaLong: "Repechajes UEFA (4 cupos)",
    icShort: "Repechajes IC (2)",
    icLong: "Interconfederación (2 cupos)",
    uefaDescription: "16 selecciones compiten en 4 rutas • Los ganadores clasifican al Mundial",
    icDescription: "6 selecciones compiten en 2 rutas en México • Los ganadores clasifican al Mundial",
    qualifiedSummary: "Resumen de selecciones clasificadas",
    pathToGroup: (groupName: string) => `→ Grupo ${groupName}`,
    uefaPath: (pathName: string) => `Ruta UEFA ${pathName}`,
    icPath: (pathName: string) => `Ruta IC ${pathName}`,
    semifinals: (date: string) => `Semifinales - ${date}`,
    semifinal: (date: string) => `Semifinal - ${date}`,
    final: (date: string) => `Final - ${date}`,
    winnerSf: (matchNumber: string) => `Ganador SF${matchNumber}`,
    winnerMatch: (matchNumber: string) => `Ganador partido ${matchNumber}`,
  },
}

export const messages: Record<Locale, Messages> = { en, es }

export const intlLocales: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
}

const spanishTeamNames: Record<string, string> = {
  mex: "México",
  rsa: "Sudáfrica",
  kor: "Corea del Sur",
  uefad: "Ganador Ruta D UEFA",
  can: "Canadá",
  uefaa: "Ganador Ruta A UEFA",
  qat: "Catar",
  sui: "Suiza",
  bra: "Brasil",
  mar: "Marruecos",
  hai: "Haití",
  sco: "Escocia",
  usa: "Estados Unidos",
  par: "Paraguay",
  aus: "Australia",
  uefac: "Ganador Ruta C UEFA",
  ger: "Alemania",
  cur: "Curazao",
  civ: "Costa de Marfil",
  ecu: "Ecuador",
  ned: "Países Bajos",
  jpn: "Japón",
  uefab: "Ganador Ruta B UEFA",
  tun: "Túnez",
  bel: "Bélgica",
  egy: "Egipto",
  irn: "Irán",
  nzl: "Nueva Zelanda",
  esp: "España",
  cpv: "Cabo Verde",
  sau: "Arabia Saudita",
  uru: "Uruguay",
  fra: "Francia",
  sen: "Senegal",
  icp2: "Ganador Ruta 2 Intercontinental",
  nor: "Noruega",
  arg: "Argentina",
  alg: "Argelia",
  aut: "Austria",
  jor: "Jordania",
  por: "Portugal",
  icp1: "Ganador Ruta 1 Intercontinental",
  uzb: "Uzbekistán",
  col: "Colombia",
  eng: "Inglaterra",
  cro: "Croacia",
  gha: "Ghana",
  pan: "Panamá",
  ita: "Italia",
  ukr: "Ucrania",
  tur: "Turquía",
  den: "Dinamarca",
  wal: "Gales",
  pol: "Polonia",
  svk: "Eslovaquia",
  cze: "República Checa",
  bih: "Bosnia y Herzegovina",
  alb: "Albania",
  kos: "Kosovo",
  irl: "República de Irlanda",
  nir: "Irlanda del Norte",
  swe: "Suecia",
  rou: "Rumania",
  mkd: "Macedonia del Norte",
  cod: "RD Congo",
  ncl: "Nueva Caledonia",
  jam: "Jamaica",
  irq: "Irak",
  bol: "Bolivia",
  sur: "Surinam",
}

const spanishVenueNames: Record<string, string> = {
  "Mexico City, Estadio Azteca": "Ciudad de México, Estadio Azteca",
  "Zapopan, Estadio Akron": "Zapopan, Estadio Akron",
  "Toronto, BMO Field": "Toronto, BMO Field",
  "Inglewood, SoFi Stadium": "Inglewood, SoFi Stadium",
  "Foxborough, Gillette Stadium": "Foxborough, Gillette Stadium",
  "Vancouver, BC Place": "Vancouver, BC Place",
  "East Rutherford, MetLife Stadium": "East Rutherford, MetLife Stadium",
  "Santa Clara, Levi's Stadium": "Santa Clara, Levi's Stadium",
  "Philadelphia, Lincoln Financial Field": "Filadelfia, Lincoln Financial Field",
  "Houston, NRG Stadium": "Houston, NRG Stadium",
  "Arlington, AT&T Stadium": "Arlington, AT&T Stadium",
  "Guadalupe, Estadio BBVA": "Guadalupe, Estadio BBVA",
  "Miami Gardens, Hard Rock Stadium": "Miami Gardens, Hard Rock Stadium",
  "Atlanta, Mercedes-Benz Stadium": "Atlanta, Mercedes-Benz Stadium",
  "Seattle, Lumen Field": "Seattle, Lumen Field",
  "Kansas City, Arrowhead Stadium": "Kansas City, Arrowhead Stadium",
  Bergamo: "Bérgamo",
  Cardiff: "Cardiff",
  Zenica: "Zenica",
  "Valencia (neutral)": "Valencia (neutral)",
  Warsaw: "Varsovia",
  Solna: "Solna",
  Istanbul: "Estambul",
  Bratislava: "Bratislava",
  Pristina: "Pristina",
  Copenhagen: "Copenhague",
  Prague: "Praga",
  "Guadalajara (Estadio Akron)": "Guadalajara (Estadio Akron)",
  "Monterrey (Estadio BBVA)": "Monterrey (Estadio BBVA)",
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "es"
}

export function getLocaleFromAcceptLanguage(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale

  const preferredLocales = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qValue] = part.trim().split(";q=")
      const quality = qValue ? Number.parseFloat(qValue) : 1
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 1 }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of preferredLocales) {
    const language = tag.split("-")[0]
    if (isLocale(language)) return language
  }

  return defaultLocale
}

export function getRequestLocale(cookieLocale: string | null | undefined, acceptLanguage: string | null | undefined): Locale {
  if (isLocale(cookieLocale)) return cookieLocale
  return getLocaleFromAcceptLanguage(acceptLanguage)
}

export function getTeamDisplayName(team: Pick<Team, "id" | "name">, locale: Locale): string {
  if (locale === "es") return spanishTeamNames[team.id] ?? team.name
  return team.name
}

export function localizeTeam<TTeam extends Team>(team: TTeam, locale: Locale): TTeam {
  return {
    ...team,
    name: getTeamDisplayName(team, locale),
  }
}

export function localizeTeamsMap(teamsMap: Record<string, Team>, locale: Locale): Record<string, Team> {
  return Object.fromEntries(Object.entries(teamsMap).map(([teamId, team]) => [teamId, localizeTeam(team, locale)]))
}

export function getVenueDisplayName(venue: string, locale: Locale): string {
  if (locale === "es") return spanishVenueNames[venue] ?? venue
  return venue
}

export function formatDateTime(dateTime: string, locale: Locale, timeZone?: string): string | null {
  const date = new Date(dateTime)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat(intlLocales[locale], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(date)
}

export function formatPlayoffDate(dateValue: string, locale: Locale): string {
  const date = new Date(`${dateValue}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return dateValue

  return new Intl.DateTimeFormat(intlLocales[locale], {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}
