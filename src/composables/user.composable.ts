import { reactive, watchEffect } from "vue"
import { UserStorage } from "@/types/localstorage.d"
import PocketBase from "pocketbase"
import { UserAccount } from "@/types/user"

const pocketBase = import.meta.env.VITE_SERVER_URL ? new PocketBase(import.meta.env.VITE_SERVER_URL) : null

export const userStore = reactive({
    darkMode: false,
    apiServerAddress: "",
    hideNonMatchableOpponents: false,
    hideFightersWithNoMatch: false,
    restored: false as boolean,
    account: null as UserAccount | null,
    authenticationAvailable: pocketBase != null,
    async authenticate() {
        if (!pocketBase || pocketBase.authStore.isValid) return null
        await pocketBase.collection("users").authWithOAuth2({ provider: "google" })
        updateAccount()
    },
    async logout() {
        if (!pocketBase) return null
        await pocketBase.authStore.clear()
    },
})

function updateAccount() {
    if (!pocketBase?.authStore.isValid) {
        userStore.account = null
    } else if (pocketBase?.authStore.record) {
        userStore.account = {
            id: pocketBase.authStore.record.id,
            name: pocketBase.authStore.record.name as string,
            email: pocketBase.authStore.record.email as string,
            avatar: null,
        }
        if (pocketBase.authStore.record?.avatar) {
            userStore.account.avatar = pocketBase.files.getURL(
                pocketBase.authStore.record,
                pocketBase.authStore.record.avatar,
                {}
            )
        }
    }
}

export function loadUserStore(): void {
    console.debug("loading user ... ")
    pocketBase?.authStore.onChange(() => {
        updateAccount()
    })
    updateAccount()
    const localStorageDataString = localStorage.getItem("userStore")
    if (localStorageDataString) {
        const localStorageData: UserStorage = JSON.parse(localStorageDataString)

        userStore.darkMode = localStorageData.darkMode
        userStore.apiServerAddress = localStorageData.apiServerAddress
        userStore.hideNonMatchableOpponents = localStorageData.hideNonMatchableOpponents
        userStore.hideFightersWithNoMatch = localStorageData.hideFightersWithNoMatch

        console.debug("store loaded")
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
