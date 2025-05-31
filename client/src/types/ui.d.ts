export interface UiStorage {
    jwtToken: string | null
    theme: UiTheme
    hideNonMatchableOpponents: boolean
    hideFightersWithNoMatch: boolean
    currentTournamentId: string | null
}

type UiTheme = "dark" | "light" | "auto"
