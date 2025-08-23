import { defineStore } from "pinia"
import type { Boxer, Opponent } from "@/types/boxing.d"
import ApiAdapter from "@/adapters/api.adapter"
import { TournamentOpenApi } from "@/api"
import { useTournamentStore } from "./tournament.store"

export const useTournamentBoxerStore = defineStore("tournamentBoxer", {
    state: () => ({
        tournamentBoxers: [] as Boxer[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchTournamentBoxers() {
            const tournamentStore = useTournamentStore()
            const tournamentId = tournamentStore.currentTournamentId
            if (!tournamentId) {
                this.tournamentBoxers = []
                return
            }
            this.loading = true
            this.error = null
            try {
                const apiBoxers = await TournamentOpenApi.getBoxersForTournament({
                    path: { tournamentId },
                })
                if (apiBoxers) {
                    this.tournamentBoxers = apiBoxers.map(ApiAdapter.toBoxer)
                }
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
            } finally {
                this.loading = false
            }
        },
        async fetchBoxerOpponents(boxerId: string): Promise<Opponent[]> {
            try {
                this.loading = true
                const tournamentStore = useTournamentStore()
                const tournamentId = tournamentStore.currentTournamentId
                if (!tournamentId) {
                    throw new Error("No current tournament selected")
                }
                const apiOpponents = await TournamentOpenApi.getPossibleOpponents({
                    path: { tournamentId, boxerId },
                })
                if (apiOpponents) {
                    return apiOpponents.map(ApiAdapter.toOpponent)
                }
                return []
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            } finally {
                this.loading = false
            }
        },
    },
})
