import { defineStore } from "pinia"
import type { Boxer } from "@/types/boxing.d"
import ApiAdapter from "@/adapters/api.adapter"
import { TournamentOpenApi, BoxerOpenApi } from "@/api"
import { useTournamentStore } from "./tournament.store"

export const useBoxerStore = defineStore("boxer", {
    state: () => ({
        boxers: [] as Boxer[],
        loading: false,
        error: null as string | null,
        restored: false,
        boxerToEdit: null as Boxer | null,
    }),
    actions: {
        async fetchBoxers() {
            const tournamentStore = useTournamentStore()
            this.loading = true
            this.error = null
            try {
                if (!tournamentStore.currentTournamentId) {
                    return
                }
                const apiBoxers = await TournamentOpenApi.getBoxersForTournament({
                    path: { tournamentId: tournamentStore.currentTournamentId },
                })
                if (apiBoxers) {
                    this.boxers = apiBoxers.map(ApiAdapter.toBoxer)
                }
                this.restored = true
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
            } finally {
                this.loading = false
            }
        },
        async fetchBoxerById(boxerId: string): Promise<Boxer> {
            this.loading = true
            this.error = null
            try {
                const apiBoxer = await BoxerOpenApi.getBoxer({
                    path: { id: boxerId },
                })
                if (!apiBoxer) {
                    throw new Error("Boxer not found")
                }
                const boxer = ApiAdapter.toBoxer(apiBoxer)
                // Update or insert the boxer in the store
                const idx = this.boxers.findIndex((b) => b.id === boxerId)
                if (idx !== -1) {
                    this.boxers[idx] = boxer
                } else {
                    this.boxers.push(boxer)
                }
                return boxer
            } finally {
                this.loading = false
            }
        },
    },
})
