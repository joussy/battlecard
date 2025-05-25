import { defineStore } from "pinia"
import type { Boxer, BoxerAttributes } from "@/types/boxing.d"
import type { DbBoxer } from "@/types/db"
import DbAdapter from "@/adapters/db.adapter"
import dbManager from "@/managers/db.manager"
import { ModalityError, ModalityErrorType } from "@/types/modality"

export const useBoxerStore = defineStore("boxer", {
    state: () => ({
        boxers: [] as Boxer[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchBoxers() {
            this.loading = true
            this.error = null
            try {
                const dbBoxers: DbBoxer[] = await dbManager.getBoxers()
                this.boxers = dbBoxers.map(DbAdapter.toBoxer)
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
            } finally {
                this.loading = false
            }
        },
        async createBoxer(boxer: BoxerAttributes) {
            try {
                const dbBoxer: DbBoxer = DbAdapter.toDbBoxer(boxer)
                const created: DbBoxer = await dbManager.addBoxer(dbBoxer)
                const newBoxer = DbAdapter.toBoxer(created)
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
            return `${boxer.attributes.firstName} ${boxer.attributes.lastName}`
        },
        getOpponentModalityErrors(boxer: BoxerAttributes, opponent: BoxerAttributes): ModalityError[] {
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
