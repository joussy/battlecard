import { defineStore } from "pinia"
import type { Fight, Boxer } from "@/types/boxing.d"
import type { ApiFight } from "@/shared/types/api"
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
                throw new Error("No current tournament selected")
            }

            this.loading = true
            this.error = null
            try {
                const apiFights: ApiFight[] = await dbManager.getFights(tournamentId)
                console.log("Fetched fights:", apiFights)
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

            const apiFight: ApiFight = {
                boxer1Id: boxer1.id,
                boxer2Id: boxer2.id,
                // modalityErrors: [],
                order: this.fights.length + 1,
                id: "",
                tournamentId: tournamentStore.currentTournamentId,
            }
            try {
                const created: ApiFight = await dbManager.addFight(apiFight)
                const newFight = ApiAdapter.toFight(created)
                this.fights.push(newFight)
                return newFight
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        // getOpponents(boxer: Boxer): Boxer[] {
        //     return this.fights
        //         .filter((fight) => fight.boxer1.id === boxer.id || fight.boxer2.id === boxer.id)
        //         .map((fight) => (fight.boxer1.id === boxer.id ? fight.boxer2 : fight.boxer1))
        // },

        async removeFromFightCard(fightIds: string[]): Promise<void> {
            await dbManager.deleteFights(fightIds)
            await this.fetchFights()
        },
        // canCompete(boxer1: Boxer, boxer2: Boxer): boolean {
        //     return !this.isCompeting(boxer1, boxer2)
        // },
        // isCompeting(boxer1: Boxer, boxer2: Boxer): boolean {
        //     return this.fights.some(
        //         (fight) =>
        //             (fight.boxer1.id === boxer1.id && fight.boxer2.id === boxer2.id) ||
        //             (fight.boxer1.id === boxer2.id && fight.boxer2.id === boxer1.id)
        //     )
        // },
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
        },
        async switchFight(fightId: string) {
            const fight = this.getFightById(fightId)
            if (fight) {
                const boxer1Id = fight.boxer1Id
                const boxer2Id = fight.boxer2Id
                fight.boxer1Id = boxer2Id
                fight.boxer2Id = boxer1Id
                await dbManager.updateFight(ApiAdapter.toApiFight(fight))
            }
        },
        getFightById(fightId: string): Fight | undefined {
            return this.fights.find((fight) => fight.id === fightId)
        },
    },
})
