import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Tournament } from "@/types/boxing.d"
import ApiAdapter from "@/adapters/api.adapter"
import { TournamentOpenApi } from "@/api"
import { useUiStore } from "./ui.store"

export const useTournamentStore = defineStore("tournament", () => {
    const tournaments = ref<Tournament[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    // Map to uiStore's currentTournamentId without initializing uiStore at store setup time
    const currentTournamentId = computed({
        get: () => useUiStore().currentTournamentId,
        set: (val: string | null) => {
            useUiStore().currentTournamentId = val
        },
    })

    async function fetchTournaments() {
        loading.value = true
        error.value = null
        try {
            const apiTournaments = await TournamentOpenApi.findAll()
            if (apiTournaments) {
                tournaments.value = apiTournaments.map(ApiAdapter.toTournament)
            }
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : "Unknown error"
        } finally {
            loading.value = false
        }
    }

    const getCurrentTournament = computed(() => {
        return tournaments.value.find((t) => t.id === currentTournamentId.value)
    })

    return {
        tournaments,
        loading,
        error,
        currentTournamentId,
        fetchTournaments,
        getCurrentTournament,
    }
})
