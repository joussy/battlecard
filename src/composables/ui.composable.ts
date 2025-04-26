import { reactive, watchEffect } from "vue"
import { UiStorage, UiTheme } from "@/types/ui"

const uiStore = reactive({
    theme: "auto" as UiTheme,
    hideNonMatchableOpponents: false,
    hideFightersWithNoMatch: false,
    restored: false as boolean,
    currentTournamentId: null as string | null,
    setCurrentTournament(tournamentId: string | null) {
        this.currentTournamentId = tournamentId
    },
})

function loadUiStore() {
    console.debug("loading ui ... ")
    const localStorageDataString = localStorage.getItem("uiStore")
    if (localStorageDataString) {
        const localStorageData: UiStorage = JSON.parse(localStorageDataString)

        uiStore.theme = localStorageData.theme
        uiStore.hideNonMatchableOpponents = localStorageData.hideNonMatchableOpponents
        uiStore.hideFightersWithNoMatch = localStorageData.hideFightersWithNoMatch
        uiStore.currentTournamentId = localStorageData.currentTournamentId

        console.debug("store loaded")
    } else {
        console.debug("no store available ... ")
    }
    listenWindowThemeChanges()
    uiStore.restored = true
}

function listenWindowThemeChanges() {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e: MediaQueryListEvent) => {
        if (uiStore.theme != "auto") {
            return
        }
        document.documentElement.setAttribute("data-bs-theme", e.matches ? "dark" : "light")
    })
}

watchEffect(() => {
    let theme = uiStore.theme
    if (uiStore.theme == "auto") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    document.documentElement.setAttribute("data-bs-theme", theme)
})

watchEffect(() => {
    if (!uiStore.restored) {
        return
    }

    const localStorageData: UiStorage = {
        theme: uiStore.theme,
        hideNonMatchableOpponents: uiStore.hideNonMatchableOpponents,
        hideFightersWithNoMatch: uiStore.hideFightersWithNoMatch,
        currentTournamentId: uiStore.currentTournamentId,
    }
    localStorage.setItem("uiStore", JSON.stringify(localStorageData))
})

export { loadUiStore, uiStore as uiStore }
