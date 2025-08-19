import { defineStore } from "pinia"
import type { Tournament } from "@/types/boxing.d"
import type { ApiTournament } from "@/shared/types/api"
import ApiAdapter from "@/adapters/api.adapter"
import dbManager from "@/managers/api.manager"

export const useTournamentStore = defineStore("tournament", {
    state: () => ({
        tournaments: [] as Tournament[],
        loading: false,
        error: null as string | null,
        currentTournamentId: undefined as string | undefined,
    }),
    actions: {
        async fetchTournaments() {
            this.loading = true
            this.error = null
            try {
                const apiTournaments: ApiTournament[] = await dbManager.getTournaments()
                this.tournaments = apiTournaments.map(ApiAdapter.toTournament)
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
            } finally {
                this.loading = false
            }
        },
        setCurrentTournament(tournamentId?: string) {
            this.currentTournamentId = tournamentId
        },
        getCurrentTournament(): Tournament | undefined {
            const tournament = this.tournaments.find((t) => t.id === this.currentTournamentId)
            return tournament
        },
    },
})
