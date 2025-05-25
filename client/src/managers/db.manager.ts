import { DbBoxer, DbFight, DbTournament, DbTournament_Boxer } from "@/shared/types/db"
import { get, mutate, mutateRaw } from "@/utils/manager.utils"

export class DbManager {
    // BOXER
    getBoxers(): Promise<DbBoxer[]> {
        return get<DbBoxer[]>("/api/boxers", undefined, "Failed to fetch boxers")
    }
    addBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        return mutate<DbBoxer>("/api/boxers", "POST", boxer, "Failed to add boxer")
    }
    getBoxer(boxerId: string): Promise<DbBoxer> {
        return get<DbBoxer>(`/api/boxers/${encodeURIComponent(boxerId)}`, undefined, "Failed to fetch boxer")
    }
    updateBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        return mutate<DbBoxer>(`/api/boxers/${encodeURIComponent(boxer.id)}`, "PUT", boxer, "Failed to update boxer")
    }

    // FIGHT
    getFights(tournamentId: string): Promise<DbFight[]> {
        return get<DbFight[]>("/api/fights", { tournamentId }, "Failed to fetch fights")
    }
    addFight(fight: DbFight): Promise<DbFight> {
        return mutate<DbFight>("/api/fights", "POST", fight, "Failed to add fight")
    }
    async deleteFights(ids: string[]): Promise<void> {
        await mutateRaw("/api/fights", "DELETE", { ids }, "Failed to delete fights")
    }
    reorderFights(fightIds: string[], tournamentId: string): Promise<void> {
        return mutate<void>("/api/fights/reorder", "POST", { fightIds, tournamentId }, "Failed to reorder fights")
    }
    updateFight(fight: DbFight): Promise<DbFight> {
        return mutate<DbFight>(`/api/fights/${encodeURIComponent(fight.id)}`, "PUT", fight, "Failed to update fight")
    }

    // TOURNAMENT
    getTournaments(): Promise<DbTournament[]> {
        return get<DbTournament[]>("/api/tournaments", undefined, "Failed to fetch tournaments")
    }
    addTournament(tournament: DbTournament): Promise<DbTournament> {
        return mutate<DbTournament>("/api/tournaments", "POST", tournament, "Failed to add tournament")
    }
    deleteTournament(tournamentId: string): Promise<void> {
        return mutate<void>(
            `/api/tournaments/${encodeURIComponent(tournamentId)}`,
            "DELETE",
            undefined,
            "Failed to delete tournament"
        )
    }

    // TOURNAMENT_BOXER
    getTournamentBoxers(tournamentId: string): Promise<DbBoxer[]> {
        return get<DbBoxer[]>("/api/tournament-boxers", { tournamentId }, "Failed to fetch tournament boxers")
    }
    addBoxerToTournament(boxerId: string, tournamentId: string): Promise<DbTournament_Boxer> {
        return mutate<DbTournament_Boxer>(
            "/api/tournament-boxers",
            "POST",
            { boxerId, tournamentId },
            "Failed to add boxer to tournament"
        )
    }
    deleteBoxersFromTournament(boxerIds: string[], tournamentId: string): Promise<void> {
        return mutate<void>(
            "/api/tournament-boxers",
            "DELETE",
            { boxerIds, tournamentId },
            "Failed to delete boxers from tournament"
        )
    }
}

const instance = new DbManager()
Object.freeze(instance)
export default instance
