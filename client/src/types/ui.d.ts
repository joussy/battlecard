export interface UiStorage {
    jwtToken: string | null
    theme: UiTheme
    hideNonMatchableOpponents: boolean
    hideFightersWithNoMatch: boolean
    currentTournamentId: string | null
    facets: Facets
}

// Facet interfaces
export interface FacetFilters {
    weight: { min: number | null; max: number | null }
    age: { min: number | null; max: number | null }
    record: { min: number | null; max: number | null }
    gender?: Gender
}
export interface FacetSort {
    by: "weight" | "age" | "record" | "name"
    direction: "asc" | "desc"
}
export interface Facets {
    filters: FacetFilters
    sort: FacetSort
}

type UiTheme = "dark" | "light" | "auto"
