export interface UiStorage {
    theme: UiTheme
    hideNonMatchableOpponents: boolean
    hideFightersWithNoMatch: boolean
    currentTournamentId: string | null
}

type UiTheme = "dark" | "light" | "auto"
