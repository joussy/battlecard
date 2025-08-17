import {
    ApiBoxerCreate,
    ApiBoxerGet,
    ApiFightGet,
    ApiFightCreate,
    ApiOpponentGet,
    ApiTournament,
    ApiTournament_Boxer,
    ApiImportBoxersResponse,
    ApiImportBoxers,
    ApiPreviewBoxersResponse,
    ApiPreviewBoxersCsv,
    ApiSharedFightCardGet,
    ApiAddressAutocompleteGet,
    ApiTournamentCreate,
} from "@/shared/types/api"
import { get, mutate, upload } from "@/utils/manager.utils"

export class ApiManager {
    getPossibleOpponents(boxerId: string, tournamentId: string): PromiseLike<ApiOpponentGet[]> {
        return get<ApiOpponentGet[]>(
            `/api/tournaments/${encodeURIComponent(tournamentId)}/opponents/${encodeURIComponent(boxerId)}`,
            undefined,
            "Failed to fetch possible opponents"
        )
    }
    // BOXER
    addBoxer(boxer: ApiBoxerCreate): Promise<ApiBoxerGet> {
        return mutate<ApiBoxerGet>("/api/boxers", "POST", boxer, "Failed to add boxer")
    }
    getBoxer(boxerId: string): Promise<ApiBoxerGet> {
        return get<ApiBoxerGet>(`/api/boxers/${encodeURIComponent(boxerId)}`, undefined, "Failed to fetch boxer")
    }
    updateBoxer(boxer: ApiBoxerCreate, boxerId: string): Promise<ApiBoxerGet> {
        return mutate<ApiBoxerGet>(`/api/boxers/${encodeURIComponent(boxerId)}`, "PUT", boxer, "Failed to update boxer")
    }

    // FIGHT
    getFights(tournamentId: string): Promise<ApiFightGet[]> {
        return get<ApiFightGet[]>(
            `/api/tournaments/${encodeURIComponent(tournamentId)}/fights`,
            { tournamentId },
            "Failed to fetch fights"
        )
    }
    addFight(fight: ApiFightCreate): Promise<ApiFightGet> {
        return mutate<ApiFightGet>("/api/fights", "POST", fight, "Failed to add fight")
    }
    async deleteFights(ids: string[]): Promise<void> {
        await mutate("/api/fights", "DELETE", { ids }, "Failed to delete fights", true)
    }
    reorderFight(fightId: string, newIndex: number): Promise<void> {
        return mutate("/api/fights/reorder", "POST", { fightId, newIndex }, "Failed to reorder fights", true)
    }

    async switchFights(fightId: string): Promise<ApiFightGet> {
        return await mutate<ApiFightGet>("/api/fights/switch", "POST", { fightId }, "Failed to switch fights", false)
    }

    // TOURNAMENT
    getTournaments(): Promise<ApiTournament[]> {
        return get<ApiTournament[]>("/api/tournaments", undefined, "Failed to fetch tournaments")
    }
    addTournament(tournament: ApiTournamentCreate): Promise<ApiTournament> {
        return mutate<ApiTournament>("/api/tournaments", "POST", tournament, "Failed to add tournament")
    }
    deleteTournament(tournamentId: string): Promise<void> {
        return mutate(
            `/api/tournaments/${encodeURIComponent(tournamentId)}`,
            "DELETE",
            undefined,
            "Failed to delete tournament"
        )
    }
    updateTournament(tournament: ApiTournamentCreate, tournamentId: string): Promise<ApiTournament> {
        return mutate<ApiTournament>(
            `/api/tournaments/${encodeURIComponent(tournamentId)}`,
            "PUT",
            tournament,
            "Failed to update tournament"
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
    // Import
    importBoxers(importBoxers: ApiImportBoxers): Promise<ApiImportBoxersResponse> {
        return mutate<ApiImportBoxersResponse>("/api/import", "POST", importBoxers, "Failed to import boxers", false)
    }
    previewBoxersFromApi(payload: string) {
        return mutate<ApiPreviewBoxersResponse>(
            "/api/import/previewFromApi",
            "POST",
            { payload } as ApiPreviewBoxersCsv,
            "Failed to import CSV",
            false
        )
    }
    previewBoxersFromText(payload: string) {
        return mutate<ApiPreviewBoxersResponse>(
            "/api/import/previewFromCsvText",
            "POST",
            { payload } as ApiPreviewBoxersCsv,
            "Failed to import CSV",
            false
        )
    }
    previewBoxersFromFfboxeFile(file: File): Promise<ApiPreviewBoxersResponse> {
        return upload<ApiPreviewBoxersResponse>(
            "/api/import/previewFromFfboxeFile",
            file,
            "Failed to import FFBoxe file"
        )
    }
    previewBoxersFromCsvFile(file: File): Promise<ApiPreviewBoxersResponse> {
        return upload<ApiPreviewBoxersResponse>("/api/import/previewFromCsvFile", file, "Failed to import FFBoxe file")
    }

    // Share
    getFightsByFightCardToken(fightCardToken: string): Promise<ApiSharedFightCardGet> {
        return get<ApiSharedFightCardGet>(
            `/api/share/fightcard/${encodeURIComponent(fightCardToken)}`,
            undefined,
            "Failed to fetch fights by fight card token"
        )
    }

    getAutoCompleteAddress(query: string): Promise<ApiAddressAutocompleteGet[]> {
        return get<ApiAddressAutocompleteGet[]>(
            `/api/places/autocomplete`,
            { q: query },
            "Failed to fetch address autocomplete"
        )
    }
    getMatchups(tournamentId: string): Promise<ApiFightGet[]> {
        return get<ApiFightGet[]>(
            `/api/fights/matchups/${encodeURIComponent(tournamentId)}`,
            undefined,
            "Failed to fetch matchups"
        )
    }
}

const instance = new ApiManager()
Object.freeze(instance)
export default instance
