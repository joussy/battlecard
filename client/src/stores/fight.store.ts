import { defineStore } from "pinia"
import type { Fight, Boxer } from "@/types/boxing.d"
import type { ApiFightGet, ApiFightCreate } from "@/shared/types/api"
import ApiAdapter from "@/adapters/api.adapter"
import dbManager from "@/managers/api.manager"
import { useTournamentStore } from "./tournament.store"

export const useFightStore = defineStore("fight", {
    state: () => ({
        fights: [] as Fight[],
        loading: false,
        error: null as string | null,
        restored: false,
    }),
    actions: {
        async fetchFights() {
            const tournamentStore = useTournamentStore()
            const tournamentId = tournamentStore.currentTournamentId
            if (!tournamentId) {
                return
            }

            this.loading = true
            this.error = null
            try {
                const apiFights: ApiFightGet[] = await dbManager.getFights(tournamentId)
                this.fights = apiFights.map((apiFight) => ApiAdapter.toFight(apiFight))
                this.restored = true
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
            } finally {
                this.loading = false
            }
        },
        async addToFightCard(boxer1: Boxer, boxer2: Boxer) {
            const tournamentStore = useTournamentStore()
            if (!tournamentStore.currentTournamentId) {
                throw new Error("No current tournament selected")
            }
            this.loading = true

            const apiFight: ApiFightCreate = {
                boxer1Id: boxer1.id,
                boxer2Id: boxer2.id,
                // modalityErrors: [],
                order: this.fights.length + 1,
                tournamentId: tournamentStore.currentTournamentId,
            }
            try {
                const created: ApiFightGet = await dbManager.addFight(apiFight)
                const newFight = ApiAdapter.toFight(created)
                this.fights.push(newFight)
                return newFight
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },

        async removeFromFightCard(fightIds: string[]): Promise<void> {
            await dbManager.deleteFights(fightIds)
            // Remove the fights from the local store
            this.fights = this.fights.filter((fight) => !fightIds.includes(fight.id))
        },
        async updateFightOrder(fightId: string, newIndex: number) {
            if (newIndex < 0) {
                return
            }

            const fights = this.fights
            // Find the fight by its ID
            const fightIndex = fights.findIndex((fight) => fight.id === fightId)

            if (fightIndex === -1) {
                console.error("Fight not found")
                return
            }

            // Get the fight to move
            const fightToMove = fights[fightIndex]

            if (fightIndex == newIndex) {
                return
            }

            // Remove the fight from its current position
            fights.splice(fightIndex, 1)

            // Insert the fight at the new position based on the order
            fights.splice(newIndex, 0, fightToMove)
            await dbManager.reorderFight(fightId, newIndex)
        },
        async switchFight(fightId: string) {
            const fight = this.getFightById(fightId)
            if (fight) {
                const switchedFight = await dbManager.switchFights(fightId)
                // Update the fight in the store
                const index = this.fights.findIndex((f) => f.id === fightId)
                if (index !== -1) {
                    this.fights[index] = ApiAdapter.toFight(switchedFight)
                }
                return switchedFight
            }
        },
        getFightById(fightId: string): Fight | undefined {
            return this.fights.find((fight) => fight.id === fightId)
        },
    },
})
