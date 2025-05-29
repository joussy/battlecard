import { defineStore } from "pinia"
import type { UiTheme, UiStorage } from "@/types/ui"
import type { UserAccount } from "@/types/user"
import { useTournamentStore } from "./tournament.store"

export const useUiStore = defineStore("ui", {
    state: () => ({
        restored: false as boolean,
        account: null as UserAccount | null,
        theme: "auto" as UiTheme,
        hideNonMatchableOpponents: false,
        hideFightersWithNoMatch: false,
        jwtToken: null as string | null,
    }),
    actions: {
        authenticate() {
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
            if (!this.jwtToken) {
                console.warn("No JWT token set, cannot fetch user profile.")
                return
            }
            const res = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${this.jwtToken}` },
            })
            if (res.ok) {
                const user = await res.json()
                this.account = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture || null,
                    apiEnabled: user.apiEnabled,
                    authToken: this.jwtToken,
                }
            } else {
                this.account = null
            }
        },
        getAccountOrThrow(): UserAccount {
            if (!this.account) throw "Cannot before action because the user is disconnected"
            return this.account
        },
        logout() {
            this.jwtToken = null
            this.account = null
        },
        loadUiStore() {
            console.debug("loading ui ... ")
            const localStorageDataString = localStorage.getItem("uiStore")
            const tournamentStore = useTournamentStore()
            if (localStorageDataString) {
                const localStorageData: UiStorage = JSON.parse(localStorageDataString)
                this.theme = localStorageData.theme
                this.hideNonMatchableOpponents = localStorageData.hideNonMatchableOpponents
                this.hideFightersWithNoMatch = localStorageData.hideFightersWithNoMatch
                tournamentStore.setCurrentTournament(localStorageData.currentTournamentId)
                this.jwtToken = localStorageData.jwtToken
                if (this.jwtToken) {
                    this.setTokenAndFetchUser()
                }
                console.debug("store loaded")
            } else {
                console.debug("no store available ... ")
            }
            this.listenWindowThemeChanges()
            this.setTheme(this.theme)
            this.restored = true
        },
        listenWindowThemeChanges() {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e: MediaQueryListEvent) => {
                if (this.theme != "auto") {
                    return
                }
                document.documentElement.setAttribute("data-bs-theme", e.matches ? "dark" : "light")
            })
        },
        saveUiStore() {
            if (!this.restored) return
            const tournamentStore = useTournamentStore()
            const localStorageData: UiStorage = {
                theme: this.theme,
                hideNonMatchableOpponents: this.hideNonMatchableOpponents,
                hideFightersWithNoMatch: this.hideFightersWithNoMatch,
                currentTournamentId: tournamentStore.currentTournamentId || null,
                jwtToken: this.jwtToken,
            }
            localStorage.setItem("uiStore", JSON.stringify(localStorageData))
        },
        setTheme(theme: UiTheme) {
            this.theme = theme
            let appliedTheme = theme
            if (theme == "auto") {
                appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            }
            document.documentElement.setAttribute("data-bs-theme", appliedTheme)
        },
    },
})
