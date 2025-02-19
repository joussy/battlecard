import { reactive, watchEffect } from "vue"
import { UserStorage } from "@/types/localstorage.d"
import PocketBase from "pocketbase"

const pocketBase = import.meta.env.VITE_SERVER_URL ? new PocketBase(import.meta.env.VITE_SERVER_URL) : null

export const userStore = reactive({
    darkMode: false,
    apiServerAddress: "",
    hideNonMatchableOpponents: false,
    hideFightersWithNoMatch: false,
    restored: false as boolean,
    getAvatar() {
        if (pocketBase?.authStore.record) {
            return pocketBase.files.getURL(pocketBase.authStore.record, pocketBase.authStore.record?.avatar)
        }
    },
    async authenticate() {
        if (!pocketBase) return null
        const authData = await pocketBase.collection("users").authWithOAuth2({ provider: "google" })
    },
})

export function loadUserStore(): void {
    console.debug("loading user ... ")
    const localStorageDataString = localStorage.getItem("userStore")
    if (localStorageDataString) {
        const localStorageData: UserStorage = JSON.parse(localStorageDataString)

        userStore.darkMode = localStorageData.darkMode
        userStore.apiServerAddress = localStorageData.apiServerAddress
        userStore.hideNonMatchableOpponents = localStorageData.hideNonMatchableOpponents
        userStore.hideFightersWithNoMatch = localStorageData.hideFightersWithNoMatch

        console.debug("store loaded")
        console.debug(localStorageData)
    } else {
        console.debug("no store available ... ")
    }
    userStore.restored = true
}

watchEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute("data-bs-theme", userStore.darkMode ? "dark" : "light")
})

watchEffect(() => {
    if (!userStore.restored) {
        return
    }

    const localStorageData: UserStorage = {
        darkMode: userStore.darkMode,
        apiServerAddress: userStore.apiServerAddress,
        hideNonMatchableOpponents: userStore.hideNonMatchableOpponents,
        hideFightersWithNoMatch: userStore.hideFightersWithNoMatch,
    }
    localStorage.setItem("userStore", JSON.stringify(localStorageData))
    console.debug("user store updated")
})
