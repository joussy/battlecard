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
            await this.fetchFights()
        },
        async updateFightOrder(fightId: string, newIndex: number) {
            //TODO: there is useless logic here, since the backend does it all
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

            await this.updateFightsOrder()
        },
        async updateFightsOrder() {
            const tournamentStore = useTournamentStore()
            if (tournamentStore.currentTournamentId == null) {
                return
            }
            const fights = this.fights
            if (fights.length == 0) {
                return
            }
            fights.forEach((fight, index) => {
                fight.order = index + 1 // +1 because we want an order starting 1, not 0
            })
            await dbManager.reorderFights(
                fights.map((f) => f.id),
                tournamentStore.currentTournamentId
            )
            await this.fetchFights()
        },
        async switchFight(fightId: string) {
            const fight = this.getFightById(fightId)
            if (fight) {
                const boxer1Id = fight.boxer1Id
                const boxer2Id = fight.boxer2Id
                fight.boxer1Id = boxer2Id
                fight.boxer2Id = boxer1Id
                const updated = await dbManager.updateFight(ApiAdapter.toApiFight(fight, 0, 0))
                // Update the local store entity with the response
                const updatedFight = ApiAdapter.toFight(updated)
                const idx = this.fights.findIndex((f) => f.id === fightId)
                if (idx !== -1) {
                    this.fights[idx] = updatedFight
                }
            }
        },
        getFightById(fightId: string): Fight | undefined {
            return this.fights.find((fight) => fight.id === fightId)
        },
    },
})
