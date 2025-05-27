import { ApiBoxerCreate, ApiBoxerGet, ApiFight, ApiTournament, ApiTournament_Boxer } from "@/shared/types/api"
import { get, mutate } from "@/utils/manager.utils"

export class ApiManager {
    // BOXER
    addBoxer(boxer: ApiBoxerCreate): Promise<ApiBoxerGet> {
        return mutate<ApiBoxerGet>("/api/boxers", "POST", boxer, "Failed to add boxer")
    }
    getBoxer(boxerId: string): Promise<ApiBoxerGet> {
        return get<ApiBoxerGet>(
            `/api/boxers/tournament/${encodeURIComponent(boxerId)}`,
            undefined,
            "Failed to fetch boxer"
        )
    }
    updateBoxer(boxer: ApiBoxerGet): Promise<ApiBoxerGet> {
        return mutate<ApiBoxerGet>(
            `/api/boxers/${encodeURIComponent(boxer.id)}`,
            "PUT",
            boxer,
            "Failed to update boxer"
        )
    }

    // FIGHT
    getFights(tournamentId: string): Promise<ApiFight[]> {
        return get<ApiFight[]>("/api/fights", { tournamentId }, "Failed to fetch fights")
    }
    addFight(fight: ApiFight): Promise<ApiFight> {
        return mutate<ApiFight>("/api/fights", "POST", fight, "Failed to add fight")
    }
    async deleteFights(ids: string[]): Promise<void> {
        await mutate("/api/fights", "DELETE", { ids }, "Failed to delete fights")
    }
    reorderFights(fightIds: string[], tournamentId: string): Promise<void> {
        return mutate<void>("/api/fights/reorder", "POST", { fightIds, tournamentId }, "Failed to reorder fights")
    }
    updateFight(fight: ApiFight): Promise<ApiFight> {
        return mutate<ApiFight>(`/api/fights/${encodeURIComponent(fight.id)}`, "PUT", fight, "Failed to update fight")
    }

    // TOURNAMENT
    getTournaments(): Promise<ApiTournament[]> {
        return get<ApiTournament[]>("/api/tournaments", undefined, "Failed to fetch tournaments")
    }
    addTournament(tournament: ApiTournament): Promise<ApiTournament> {
        return mutate<ApiTournament>("/api/tournaments", "POST", tournament, "Failed to add tournament")
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
    getTournamentBoxers(tournamentId: string): Promise<ApiBoxerGet[]> {
        return get<ApiBoxerGet[]>(
            `/api/tournaments/${encodeURIComponent(tournamentId)}/boxers`,
            undefined,
            "Failed to fetch tournament boxers"
        )
    }
    addBoxerToTournament(boxerId: string, tournamentId: string): Promise<ApiTournament_Boxer> {
        return mutate<ApiTournament_Boxer>(
            "/api/tournament-boxers",
            "POST",
            { boxerId, tournamentId },
            "Failed to add boxer to tournament"
        )
    }
    async deleteBoxersFromTournament(boxerIds: string[], tournamentId: string) {
        await mutate(
            "/api/tournament-boxers",
            "DELETE",
            { boxerIds, tournamentId },
            "Failed to delete boxers from tournament"
        )
    }
}

const instance = new ApiManager()
Object.freeze(instance)
export default instance
