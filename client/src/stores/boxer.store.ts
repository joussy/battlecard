import { defineStore } from "pinia"
import type { Boxer } from "@/types/boxing.d"
import ApiAdapter from "@/adapters/api.adapter"
import dbManager from "@/managers/api.manager"
import { ApiBoxerGet } from "@/shared/types/api"
import { useTournamentStore } from "./tournament.store"

export const useBoxerStore = defineStore("boxer", {
    state: () => ({
        boxers: [] as Boxer[],
        loading: false,
        error: null as string | null,
        restored: false,
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
                const apiBoxers: ApiBoxerGet[] = await dbManager.getTournamentBoxers(
                    tournamentStore.currentTournamentId
                )
                this.boxers = apiBoxers.map(ApiAdapter.toBoxer)
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
                const apiBoxer: ApiBoxerGet = await dbManager.getBoxer(boxerId)
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
        async createBoxer(boxer: Boxer): Promise<Boxer> {
            try {
                const tournamentStore = useTournamentStore()
                const apiBoxerCreate = ApiAdapter.toApiBoxerCreate(
                    boxer,
                    tournamentStore.currentTournamentId || undefined
                )
                const created: ApiBoxerGet = await dbManager.addBoxer(apiBoxerCreate)
                const newBoxer = ApiAdapter.toBoxer(created)
                this.boxers.push(newBoxer)
                return newBoxer
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        async updateBoxer(boxer: Boxer): Promise<Boxer> {
            try {
                const apiBoxerUpdate = ApiAdapter.toApiBoxerCreate(boxer, undefined)
                const updated: ApiBoxerGet = await dbManager.updateBoxer(apiBoxerUpdate, boxer.id)
                const updatedBoxer = ApiAdapter.toBoxer(updated)
                // Update the boxer in the store
                const idx = this.boxers.findIndex((b) => b.id === updatedBoxer.id)
                if (idx !== -1) {
                    this.boxers[idx] = updatedBoxer
                }
                return updatedBoxer
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        getBoxerById(boxerId: string): Boxer | undefined {
            return this.boxers.find((b) => b.id === boxerId)
        },
    },
})
