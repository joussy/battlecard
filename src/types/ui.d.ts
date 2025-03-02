export interface BoxerUi {
    collapsed: boolean
}

export interface UiStorage {
    theme: UiTheme
    hideNonMatchableOpponents: boolean
    hideFightersWithNoMatch: boolean
    boxers: Array
}

type UiTheme = "dark" | "light" | "auto"
