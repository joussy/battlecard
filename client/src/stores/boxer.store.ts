import { defineStore } from "pinia"
import type { Boxer, Opponent } from "@/types/boxing.d"
import ApiAdapter from "@/adapters/api.adapter"
import dbManager from "@/managers/api.manager"
import { ModalityError, ModalityErrorType } from "@/shared/types/modality.type"
import { ApiBoxerGet } from "@/shared/types/api"

export const useBoxerStore = defineStore("boxer", {
    state: () => ({
        boxers: [] as Boxer[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchBoxers(tournamentId: string) {
            this.loading = true
            this.error = null
            try {
                const apiBoxers: ApiBoxerGet[] = await dbManager.getTournamentBoxers(tournamentId)
                this.boxers = apiBoxers.map(ApiAdapter.toBoxer)
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
                return boxer
            } finally {
                this.loading = false
            }
        },
        async createBoxer(boxer: Boxer, tournamentId?: string): Promise<Boxer> {
            try {
                const apiBoxerCreate = ApiAdapter.toApiBoxerCreate(boxer, tournamentId)
                const created: ApiBoxerGet = await dbManager.addBoxer(apiBoxerCreate)
                const newBoxer = ApiAdapter.toBoxer(created)
                this.boxers.push(newBoxer)
                return newBoxer
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        getNbFightsForBoxer(boxer: Boxer): number {
            return 0
        },
        getBoxerDisplayName(boxer: Boxer): string {
            return `${boxer.firstName} ${boxer.lastName}`
        },
        getOpponentModalityErrors(boxer: Boxer, opponent: Boxer): ModalityError[] {
            //TODO: Implement modality logic
            // return this.modality.getModalityErrors(boxer, opponent)
            return []
        },
        getOpponentModalityError(
            boxer: Boxer,
            opponent: Boxer,
            modalityErrorType: ModalityErrorType
        ): ModalityError | null {
            //TODO: Implement modality logic
            // return this.modality.getModalityErrors(boxer, opponent)
            return null
        },
    },
})
