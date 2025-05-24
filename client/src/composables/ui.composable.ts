import { reactive, watchEffect } from "vue"
import { UiStorage, UiTheme } from "@/types/ui"
import { UserAccount } from "@/types/user"

const uiStore = reactive({
    restored: false as boolean,
    account: null as null | UserAccount,
    tournamentId: null as string | null,
    theme: "auto" as UiTheme,
    hideNonMatchableOpponents: false,
    hideFightersWithNoMatch: false,
    jwtToken: null as string | null,
    currentTournamentId: null as string | null,
    setCurrentTournament(tournamentId: string | null) {
        this.currentTournamentId = tournamentId
    },
    authenticate() {
        // Open popup for Google OAuth
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2
        window.open(
            "/api/auth/google",
            "GoogleAuth",
            `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`
        )
    },
    async setTokenAndFetchUser() {
        if (!uiStore.jwtToken) {
            console.warn("No JWT token set, cannot fetch user profile.")
            return
        }
        // Fetch user profile from backend
        const res = await fetch("/api/users/me", {
            headers: { Authorization: `Bearer ${uiStore.jwtToken}` },
        })
        if (res.ok) {
            const user = await res.json()
            this.account = {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture || null,
                apiEnabled: user.apiEnabled,
                authToken: uiStore.jwtToken,
            }
        } else {
            this.account = null
        }
    },
    getAccountOrThrow(): UserAccount {
        if (!uiStore.account) throw "Cannot before action because the user is disconnected"

        return this.account!
    },
    logout() {
        uiStore.jwtToken = null
        this.account = null
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
        uiStore.jwtToken = localStorageData.jwtToken
        if (uiStore.jwtToken) {
            uiStore.setTokenAndFetchUser()
        }

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
        jwtToken: uiStore.jwtToken,
    }
    localStorage.setItem("uiStore", JSON.stringify(localStorageData))
})

export { loadUiStore, uiStore as uiStore }
