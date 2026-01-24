import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"
import type { UiTheme, UiLanguage, UiStorage, Facets } from "@/types/ui"
import type { UserAccount } from "@/types/user"
import { User, UserOpenApi } from "@/api"
import { useI18n } from "vue-i18n"

export const useUiStore = defineStore("ui", () => {
    const { locale } = useI18n()
    const router = useRouter()

    const restored = ref<boolean>(false)
    const account = ref<UserAccount | null>(null)
    const isAuthenticated = computed(() => account.value !== null)

    // Load from localStorage 'uiStore' key if available
    let initialUiStore: Partial<UiStorage> = {}
    if (typeof window !== "undefined") {
        const uiStoreStr = localStorage.getItem("uiStore")
        if (uiStoreStr) {
            try {
                initialUiStore = JSON.parse(uiStoreStr)
            } catch {}
        }
    }
    const theme = ref<UiTheme>(initialUiStore.theme || "auto")
    const language = ref<UiLanguage>(initialUiStore.language || getDefaultLanguage())
    const hideNonMatchableOpponents = ref(initialUiStore.hideNonMatchableOpponents ?? false)
    const hideFightersWithNoMatch = ref(initialUiStore.hideFightersWithNoMatch ?? false)
    const facets = ref<Facets | null>(initialUiStore.facets ?? null)
    const currentTournamentId = ref<string | null>(initialUiStore.currentTournamentId ?? null)

    // Watch for changes and update 'uiStore' localStorage key
    watch(
        [theme, language, hideNonMatchableOpponents, hideFightersWithNoMatch, facets, currentTournamentId],
        () => {
            const localStorageData: UiStorage = {
                theme: theme.value,
                language: language.value,
                hideNonMatchableOpponents: hideNonMatchableOpponents.value,
                hideFightersWithNoMatch: hideFightersWithNoMatch.value,
                facets: facets.value,
                currentTournamentId: currentTournamentId.value,
            }
            localStorage.setItem("uiStore", JSON.stringify(localStorageData))
        },
        { deep: true }
    )

    async function fetchUser() {
        console.log("Fetching user info...")
        let user: User | undefined
        try {
            user = await UserOpenApi.getMe()
        } catch (ex) {
            const res = ex as Response
            account.value = null
            if (res.status === 401) {
                console.warn("Unauthorized access, session may be invalid.")
                // redirect to auth page if router available
                if (router) {
                    router.push({ name: "auth" })
                }
            }
        }
        if (user) {
            account.value = {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture || null,
                apiEnabled: user.apiEnabled,
            }
        }
    }

    function logout() {
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
        if (restored.value) {
            return
        }
        await fetchUser()
        listenWindowThemeChanges()
        setTheme(theme.value)
        setLanguage(language.value)
        restored.value = true
    }

    function listenWindowThemeChanges() {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e: MediaQueryListEvent) => {
            if (theme.value != "auto") {
                return
            }
            document.documentElement.setAttribute("data-bs-theme", e.matches ? "dark" : "light")
        })
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
    }

    function getDefaultLanguage(): UiLanguage {
        if (!initialUiStore.language && typeof navigator !== "undefined" && navigator.language) {
            // Use only the language part (e.g., 'en' from 'en-US')
            return navigator.language.split("-")[0] as UiLanguage
        }
        return "en"
    }

    return {
        restored,
        account,
        theme,
        language,
        currentTournamentId,
        hideNonMatchableOpponents,
        hideFightersWithNoMatch,
        isAuthenticated,
        facets,
        fetchUser,
        logout,
        clearFacets,
        clearFacet,
        setTheme,
        setLanguage,
        loadUiStore,
    }
})
