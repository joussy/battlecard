import { defineStore } from "pinia"
import type { UiTheme, UiLanguage, UiStorage, Facets } from "@/types/ui"
import type { UserAccount } from "@/types/user"
import { useTournamentStore } from "./tournament.store"
import { User, UserOpenApi } from "@/api"

export const useUiStore = defineStore("ui", {
    state: () => ({
        restored: false as boolean,
        account: null as UserAccount | null,
        theme: "auto" as UiTheme,
        language: "en" as UiLanguage,
        hideNonMatchableOpponents: false,
        hideFightersWithNoMatch: false,
        jwtToken: undefined as string | undefined,
        facets: null as Facets | null,
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
            let user: User | undefined
            try {
                user = await UserOpenApi.getMe()
            } catch (ex) {
                const res = ex as Response
                this.account = null
                if (res.status === 401) {
                    console.warn("Unauthorized access, JWT token may be invalid.")
                    this.jwtToken = undefined
                    //redirect to auth page
                    if (this.router) {
                        this.router.push({ name: "auth" })
                    }
                }
            }
            if (user && this.jwtToken) {
                this.account = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture || null,
                    apiEnabled: user.apiEnabled,
                    authToken: this.jwtToken,
                }
            }
        },
        logout() {
            this.jwtToken = undefined
            this.account = null
        },
        clearFacets() {
            this.facets = {
                filters: {
                    weight: { min: null, max: null },
                    age: { min: null, max: null },
                    nbFights: { min: null, max: null },
                    gender: null,
                },
                sort: { by: "name", direction: "asc" },
            }
        },
        clearFacet(facet: string) {
            if (!this.facets) {
                console.warn("No facets to clear")
                return
            }
            if (facet === "weight") {
                this.facets.filters.weight.min = null
                this.facets.filters.weight.max = null
            } else if (facet === "age") {
                this.facets.filters.age.min = null
                this.facets.filters.age.max = null
            } else if (facet === "nbFights") {
                this.facets.filters.nbFights.min = null
                this.facets.filters.nbFights.max = null
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
                this.language = localStorageData.language || "en"
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
                // Set default language based on browser language
                const browserLang = navigator.language.split("-")[0] as UiLanguage
                if (browserLang === "fr" || browserLang === "en") {
                    this.language = browserLang
                } else {
                    this.language = "en"
                }
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
                language: this.language,
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
        setLanguage(language: UiLanguage) {
            this.language = language
            // Update i18n locale - this will be handled by the component that calls this
        },
    },
})
