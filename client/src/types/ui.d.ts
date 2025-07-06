export interface UiStorage {
    jwtToken: string | null
    theme: UiTheme
    hideNonMatchableOpponents: boolean
    hideFightersWithNoMatch: boolean
    currentTournamentId: string | null
    facets: Facets | null
}

// Facet interfaces
export interface FacetFilters {
    weight: { min: number | null; max: number | null }
    age: { min: number | null; max: number | null }
    nbFights: { min: number | null; max: number | null }
    gender?: Gender
}
export interface FacetSort {
    by: "weight" | "age" | "nbFights" | "name"
    direction: "asc" | "desc"
}
export interface Facets {
    filters: FacetFilters
    sort: FacetSort
}

type UiTheme = "dark" | "light" | "auto"
