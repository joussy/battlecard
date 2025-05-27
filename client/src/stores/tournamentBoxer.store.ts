import { defineStore } from "pinia"
import type { Boxer } from "@/types/boxing.d"
import type { ApiBoxerGet } from "@/shared/types/api"
import ApiAdapter from "@/adapters/api.adapter"
import dbManager from "@/managers/api.manager"

export const useTournamentBoxerStore = defineStore("tournamentBoxer", {
    state: () => ({
        tournamentBoxers: [] as Boxer[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchTournamentBoxers(tournamentId: string) {
            this.loading = true
            this.error = null
            try {
                const apiBoxers: ApiBoxerGet[] = await dbManager.getTournamentBoxers(tournamentId)
                this.tournamentBoxers = apiBoxers.map(ApiAdapter.toBoxer)
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
            } finally {
                this.loading = false
            }
        },
        async addBoxerToTournament(boxerId: string, tournamentId: string) {
            try {
                await dbManager.addBoxerToTournament(boxerId, tournamentId)
                // Optionally, refetch or update state
                await this.fetchTournamentBoxers(tournamentId)
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        async removeBoxersFromTournament(boxerIds: string[], tournamentId: string) {
            try {
                await dbManager.deleteBoxersFromTournament(boxerIds, tournamentId)
                // Optionally, refetch or update state
                await this.fetchTournamentBoxers(tournamentId)
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        async removeBoxersFromTournamentAll(tournamentId: string) {
            try {
                const boxerIds = this.tournamentBoxers.map((b) => b.id)
                if (boxerIds.length === 0) return
                await dbManager.deleteBoxersFromTournament(boxerIds, tournamentId)
                await this.fetchTournamentBoxers(tournamentId)
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
    },
})
