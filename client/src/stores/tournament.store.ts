import { defineStore } from "pinia"
import type { Tournament } from "@/types/boxing.d"
import type { DbTournament } from "@/types/db"
import DbAdapter from "@/adapters/db.adapter"
import dbManager from "@/managers/db.manager"
import { get } from "sortablejs"

export const useTournamentStore = defineStore("tournament", {
    state: () => ({
        tournaments: [] as Tournament[],
        loading: false,
        error: null as string | null,
        currentTournamentId: null as string | null,
    }),
    actions: {
        async fetchTournaments() {
            this.loading = true
            this.error = null
            try {
                const dbTournaments: DbTournament[] = await dbManager.getTournaments()
                this.tournaments = dbTournaments.map(DbAdapter.toTournament)
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
            } finally {
                this.loading = false
            }
        },
        async createTournament(tournament: Tournament) {
            try {
                const dbTournament: DbTournament = DbAdapter.toDbTournament(tournament)
                const created: DbTournament = await dbManager.addTournament(dbTournament)
                const newTournament = DbAdapter.toTournament(created)
                this.tournaments.push(newTournament)
                return newTournament
            } catch (e: unknown) {
                this.error = e instanceof Error ? e.message : "Unknown error"
                throw e
            }
        },
        setCurrentTournament(tournamentId: string | null) {
            this.currentTournamentId = tournamentId
        },
        getCurrentTournament(): Tournament | null {
            const tournament = this.tournaments.find((t) => t.id === this.currentTournamentId)
            return tournament || null
        },
    },
})
