import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"
import type { UiTheme, UiLanguage, UiStorage, Facets } from "@/types/ui"
import type { UserAccount } from "@/types/user"
import { useTournamentStore } from "./tournament.store"
import { User, UserOpenApi } from "@/api"
import { useI18n } from "vue-i18n"

export const useUiStore = defineStore("ui", () => {
    const { locale } = useI18n()
    const router = useRouter()

    const restored = ref<boolean>(false)
    const account = ref<UserAccount | null>(null)
    const theme = ref<UiTheme>("auto")
    const language = ref<UiLanguage>("en")
    const hideNonMatchableOpponents = ref(false)
    const hideFightersWithNoMatch = ref(false)
    const jwtToken = ref<string | undefined>(undefined)
    const facets = ref<Facets | null>(null)

    function authenticate() {
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2
        window.open(
            "/api/auth/google",
            "GoogleAuth",
            `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`
        )
    }

    async function setTokenAndFetchUser() {
        if (!jwtToken.value) {
            console.warn("No JWT token set, cannot fetch user profile.")
            return
        }
        let user: User | undefined
        try {
            user = await UserOpenApi.getMe()
        } catch (ex) {
            const res = ex as Response
            account.value = null
            if (res.status === 401) {
                console.warn("Unauthorized access, JWT token may be invalid.")
                jwtToken.value = undefined
                // redirect to auth page if router available
                if (router) {
                    router.push({ name: "auth" })
                }
            }
        }
        if (user && jwtToken.value) {
            account.value = {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture || null,
                apiEnabled: user.apiEnabled,
                authToken: jwtToken.value,
            }
        }
    }

    function logout() {
        jwtToken.value = undefined
        account.value = null
    }

    function clearFacets() {
        facets.value = {
            filters: {
                weight: { min: null, max: null },
                age: { min: null, max: null },
                nbFights: { min: null, max: null },
                gender: null,
            },
            sort: { by: "name", direction: "asc" },
        }
    }

    function clearFacet(facet: string) {
        if (!facets.value) {
            console.warn("No facets to clear")
            return
        }
        if (facet === "weight") {
            facets.value.filters.weight.min = null
            facets.value.filters.weight.max = null
        } else if (facet === "age") {
            facets.value.filters.age.min = null
            facets.value.filters.age.max = null
        } else if (facet === "nbFights") {
            facets.value.filters.nbFights.min = null
            facets.value.filters.nbFights.max = null
        } else if (facet === "gender") {
            facets.value.filters.gender = ""
        } else if (facet === "sort") {
            facets.value.sort.by = "name"
            facets.value.sort.direction = "asc"
        }
    }

    async function loadUiStore() {
        let localStorageData: UiStorage | undefined
        console.debug("loading ui ... ")
        const localStorageDataString = localStorage.getItem("uiStore")
        if (localStorageDataString) {
            localStorageData = JSON.parse(localStorageDataString)
        }
        if (localStorageData) {
            theme.value = localStorageData.theme
            language.value = localStorageData.language || "en"
            hideNonMatchableOpponents.value = localStorageData.hideNonMatchableOpponents
            hideFightersWithNoMatch.value = localStorageData.hideFightersWithNoMatch
            jwtToken.value = localStorageData.jwtToken
            clearFacets()
            if (localStorageData.facets) {
                facets.value = localStorageData.facets
            }
            if (jwtToken.value) {
                await setTokenAndFetchUser()
            }
            console.debug("store loaded")
        } else {
            console.debug("no store available ... ")
            // Set default language based on browser language
            const browserLang = navigator.language.split("-")[0] as UiLanguage
            if (browserLang === "fr" || browserLang === "en") {
                language.value = browserLang
            } else {
                language.value = "en"
            }
        }
        listenWindowThemeChanges()
        setTheme(theme.value)
        setLanguage(language.value)
        restored.value = true
        return localStorageData
    }

    function listenWindowThemeChanges() {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e: MediaQueryListEvent) => {
            if (theme.value != "auto") {
                return
            }
            document.documentElement.setAttribute("data-bs-theme", e.matches ? "dark" : "light")
        })
    }

    function saveUiStore() {
        if (!restored.value) return
        const tournamentStore = useTournamentStore()
        const localStorageData: UiStorage = {
            theme: theme.value,
            language: language.value,
            hideNonMatchableOpponents: hideNonMatchableOpponents.value,
            hideFightersWithNoMatch: hideFightersWithNoMatch.value,
            currentTournamentId: tournamentStore.currentTournamentId || null,
            jwtToken: jwtToken.value,
            facets: facets.value,
        }
        localStorage.setItem("uiStore", JSON.stringify(localStorageData))
    }

    function setTheme(t: UiTheme) {
        theme.value = t
        let appliedTheme = t
        if (t == "auto") {
            appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }
        document.documentElement.setAttribute("data-bs-theme", appliedTheme)
    }

    function setLanguage(lang: UiLanguage) {
        language.value = lang
        locale.value = lang
        // Update i18n locale - this will be handled by the component that calls this
    }

    return {
        restored,
        account,
        theme,
        language,
        hideNonMatchableOpponents,
        hideFightersWithNoMatch,
        jwtToken,
        facets,
        authenticate,
        setTokenAndFetchUser,
        logout,
        clearFacets,
        clearFacet,
        loadUiStore,
        listenWindowThemeChanges,
        saveUiStore,
        setTheme,
        setLanguage,
    }
})
