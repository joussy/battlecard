import { defineStore } from "pinia"
import type { UiTheme, UiStorage, Facets } from "@/types/ui"
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
        facets: {} as Facets,
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
        clearFacets() {
            this.facets = {
                filters: {
                    weight: { min: null, max: null },
                    age: { min: null, max: null },
                    record: { min: null, max: null },
                    gender: null,
                },
                sort: { by: "name", direction: "asc" },
            }
        },
        clearFacet(facet: string) {
            if (facet === "weight") {
                this.facets.filters.weight.min = null
                this.facets.filters.weight.max = null
            } else if (facet === "age") {
                this.facets.filters.age.min = null
                this.facets.filters.age.max = null
            } else if (facet === "record") {
                this.facets.filters.record.min = null
                this.facets.filters.record.max = null
            } else if (facet === "gender") {
                this.facets.filters.gender = ""
            } else if (facet === "sort") {
                this.facets.sort.by = "name"
                this.facets.sort.direction = "asc"
            }
        },
        async loadUiStore() {
            let localStorageData: UiStorage | undefined
            console.debug("loading ui ... ")
            const localStorageDataString = localStorage.getItem("uiStore")
            if (localStorageDataString) {
                localStorageData = JSON.parse(localStorageDataString)
            }
            if (localStorageData) {
                this.theme = localStorageData.theme
                this.hideNonMatchableOpponents = localStorageData.hideNonMatchableOpponents
                this.hideFightersWithNoMatch = localStorageData.hideFightersWithNoMatch
                this.jwtToken = localStorageData.jwtToken
                this.clearFacets()
                if (localStorageData.facets) {
                    this.facets = localStorageData.facets
                }
                if (this.jwtToken) {
                    await this.setTokenAndFetchUser()
                }
                console.debug("store loaded")
            } else {
                console.debug("no store available ... ")
            }
            this.listenWindowThemeChanges()
            this.setTheme(this.theme)
            this.restored = true
            return localStorageData
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
                facets: this.facets,
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
