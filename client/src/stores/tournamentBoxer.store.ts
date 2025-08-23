import { defineStore } from "pinia"
import type { Boxer, Opponent } from "@/types/boxing.d"
import ApiAdapter from "@/adapters/api.adapter"
import { TournamentOpenApi } from "@/api"
import { createApiClient } from "@/utils/api.client"
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
                const client = createApiClient()
                const apiBoxers = await TournamentOpenApi.getBoxersForTournament({
                    client,
                    path: { tournamentId }
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
        // TODO: These methods need to be implemented when tournament-boxer endpoints are added to the OpenAPI spec
        async addBoxerToTournament(boxerId: string, tournamentId: string) {
            // Implementation pending - tournament-boxer relationship endpoints not found in generated SDK
            console.warn("addBoxerToTournament not implemented - endpoint not found in OpenAPI spec")
            throw new Error("Method not implemented - tournament-boxer endpoints missing from API")
        },
        async removeBoxersFromTournament(boxerIds: string[], tournamentId: string) {
            // Implementation pending - tournament-boxer relationship endpoints not found in generated SDK
            console.warn("removeBoxersFromTournament not implemented - endpoint not found in OpenAPI spec")
            throw new Error("Method not implemented - tournament-boxer endpoints missing from API")
        },
        async removeBoxersFromTournamentAll(tournamentId: string) {
            // Implementation pending - tournament-boxer relationship endpoints not found in generated SDK
            console.warn("removeBoxersFromTournamentAll not implemented - endpoint not found in OpenAPI spec")
            throw new Error("Method not implemented - tournament-boxer endpoints missing from API")
        },
        async fetchBoxerOpponents(boxerId: string): Promise<Opponent[]> {
            try {
                this.loading = true
                const tournamentStore = useTournamentStore()
                const tournamentId = tournamentStore.currentTournamentId
                if (!tournamentId) {
                    throw new Error("No current tournament selected")
                }
                const client = createApiClient()
                const apiOpponents = await TournamentOpenApi.getPossibleOpponents({
                    client,
                    path: { tournamentId, boxerId }
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
