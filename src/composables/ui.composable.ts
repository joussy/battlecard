import { reactive, watchEffect } from "vue"
import { UiStorage } from "@/types/localstorage.d"

const uiStore = reactive({
    darkMode: false,
    hideNonMatchableOpponents: false,
    hideFightersWithNoMatch: false,
    restored: false as boolean,
})

function loadUiStore() {
    console.debug("loading ui ... ")
    const localStorageDataString = localStorage.getItem("uiStore")
    if (localStorageDataString) {
        const localStorageData: UiStorage = JSON.parse(localStorageDataString)

        uiStore.darkMode = localStorageData.darkMode
        uiStore.hideNonMatchableOpponents = localStorageData.hideNonMatchableOpponents
        uiStore.hideFightersWithNoMatch = localStorageData.hideFightersWithNoMatch

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
    }
    localStorage.setItem("uiStore", JSON.stringify(localStorageData))
    console.debug("ui store updated")
})

export { loadUiStore, uiStore }
