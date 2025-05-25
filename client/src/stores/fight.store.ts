import { defineStore } from "pinia"
import type { Fight, Boxer } from "@/types/boxing.d"
import type { DbFight } from "@/shared/types/db"
import DbAdapter from "@/adapters/db.adapter"
import dbManager from "@/managers/db.manager"
import { useTournamentStore } from "./tournament.store"

export const useFightStore = defineStore("fight", {
    state: () => ({
        fights: [] as Fight[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchFights(tournamentId: string, boxers: Boxer[]) {
            this.loading = true
            this.error = null
            try {
                const dbFights: DbFight[] = await dbManager.getFights(tournamentId)
                // Map DbFight to Fight, resolving boxer1/boxer2 from the provided boxers array
                this.fights = dbFights
                    .map((f) => {
                        const boxer1 = boxers.find((b) => b.id === f.boxer1Id)
                        const boxer2 = boxers.find((b) => b.id === f.boxer2Id)
                        if (boxer1 && boxer2) return DbAdapter.toFight(f, boxer1, boxer2)
                        return null
                    })
                    .filter((f): f is Fight => f !== null)
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
            } finally {
                this.loading = false
            }
        },
        async addToFightCard(boxer1: Boxer, boxer2: Boxer) {
            const tournamentStore = useTournamentStore()

            // Check if the fight already exists before adding to the fight card
            if (!tournamentStore.currentTournamentId || this.isCompeting(boxer1, boxer2)) {
                return
            }
            const fight: Fight = {
                boxer1,
                boxer2,
                modalityErrors: [],
                order: this.fights.length + 1,
                id: "",
                tournamentId: tournamentStore.currentTournamentId,
            }
            try {
                const dbFight: DbFight = DbAdapter.toDbFight(fight)
                const created: DbFight = await dbManager.addFight(dbFight)
                const newFight = DbAdapter.toFight(created, fight.boxer1, fight.boxer2)
                this.fights.push(newFight)
                return newFight
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        getOpponents(boxer: Boxer): Boxer[] {
            return this.fights
                .filter((fight) => fight.boxer1.id === boxer.id || fight.boxer2.id === boxer.id)
                .map((fight) => (fight.boxer1.id === boxer.id ? fight.boxer2 : fight.boxer1))
        },

        async removeFromFightCard(boxer1: Boxer, boxer2: Boxer): Promise<void> {
            const fight = this.fights.find(
                (f) =>
                    (f.boxer1.id === boxer1.id && f.boxer2.id === boxer2.id) ||
                    (f.boxer1.id === boxer2.id && f.boxer2.id === boxer1.id)
            )
            if (fight) {
                // Remove from backend first
                await dbManager.deleteFights([fight.id])
                // Then update local state
                this.fights = this.fights.filter((f) => f.id !== fight.id)
            }
        },
        canCompete(boxer1: Boxer, boxer2: Boxer): boolean {
            return !this.isCompeting(boxer1, boxer2)
        },
        isCompeting(boxer1: Boxer, boxer2: Boxer): boolean {
            return this.fights.some(
                (fight) =>
                    (fight.boxer1.id === boxer1.id && fight.boxer2.id === boxer2.id) ||
                    (fight.boxer1.id === boxer2.id && fight.boxer2.id === boxer1.id)
            )
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
                const boxer1 = fight.boxer1
                const boxer2 = fight.boxer2
                fight.boxer1 = boxer2
                fight.boxer2 = boxer1
                await dbManager.updateFight(DbAdapter.toDbFight(fight))
            }
        },
        getFightById(fightId: string): Fight | undefined {
            return this.fights.find((fight) => fight.id === fightId)
        },
    },
})
