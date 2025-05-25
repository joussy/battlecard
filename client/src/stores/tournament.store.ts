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
        currentTournamentId: null as string | null,
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
        async createTournament(tournament: Tournament) {
            try {
                const apiTournament: ApiTournament = ApiAdapter.toApiTournament(tournament)
                const created: ApiTournament = await dbManager.addTournament(apiTournament)
                const newTournament = ApiAdapter.toTournament(created)
                this.tournaments.push(newTournament)
                return newTournament
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        setCurrentTournament(tournamentId: string | null) {
            this.currentTournamentId = tournamentId
        },
        getCurrentTournament(): Tournament | null {
            const tournament = this.tournaments.find((t) => t.id === this.currentTournamentId)
            return tournament || null
        },
    },
})
