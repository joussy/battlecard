import { reactive, watchEffect } from "vue"
import { BoxerUi, UiStorage, UiTheme } from "@/types/ui"

const uiStore = reactive({
    theme: "auto" as UiTheme,
    hideNonMatchableOpponents: false,
    hideFightersWithNoMatch: false,
    tournamentId: null as string | null,
    restored: false as boolean,
    boxers: new Map<string, BoxerUi>(),
    createOrGetBoxerUi(boxerId: string): BoxerUi {
        if (!this.boxers.has(boxerId)) {
            this.boxers.set(boxerId, { collapsed: true })
        }
        return this.boxers.get(boxerId)!
    },
    collapse(boxerId: string, collapsed?: boolean | null) {
        const boxer = this.createOrGetBoxerUi(boxerId)
        if (collapsed == null) {
            collapsed = !boxer.collapsed
        }
        boxer.collapsed = collapsed
    },
    collapseAll() {
        for (const boxer of this.boxers) {
            boxer[1].collapsed = true
        }
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
        uiStore.boxers = new Map(localStorageData.boxers)

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
        boxers: Array.from(uiStore.boxers),
    }
    localStorage.setItem("uiStore", JSON.stringify(localStorageData))
})
// const readOnlyUiStore = readonly(uiStore)
export { loadUiStore, uiStore as uiStore }
