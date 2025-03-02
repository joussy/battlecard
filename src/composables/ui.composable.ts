import { reactive, readonly, watchEffect } from "vue"
import { BoxerUi, UiStorage } from "@/types/ui"

const uiStore = reactive({
    darkMode: false,
    hideNonMatchableOpponents: false,
    hideFightersWithNoMatch: false,
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
})

function loadUiStore() {
    console.debug("loading ui ... ")
    const localStorageDataString = localStorage.getItem("uiStore")
    if (localStorageDataString) {
        const localStorageData: UiStorage = JSON.parse(localStorageDataString)

        uiStore.darkMode = localStorageData.darkMode
        uiStore.hideNonMatchableOpponents = localStorageData.hideNonMatchableOpponents
        uiStore.hideFightersWithNoMatch = localStorageData.hideFightersWithNoMatch
        uiStore.boxers = new Map(localStorageData.boxers)

        console.debug("store loaded")
    } else {
        console.debug("no store available ... ")
    }
    uiStore.restored = true
}

watchEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute("data-bs-theme", uiStore.darkMode ? "dark" : "light")
})

watchEffect(() => {
    if (!uiStore.restored) {
        return
    }

    const localStorageData: UiStorage = {
        darkMode: uiStore.darkMode,
        hideNonMatchableOpponents: uiStore.hideNonMatchableOpponents,
        hideFightersWithNoMatch: uiStore.hideFightersWithNoMatch,
        boxers: Array.from(uiStore.boxers),
    }
    localStorage.setItem("uiStore", JSON.stringify(localStorageData))
})
// const readOnlyUiStore = readonly(uiStore)
export { loadUiStore, uiStore as uiStore }
