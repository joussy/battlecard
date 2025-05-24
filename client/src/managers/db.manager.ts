import { DbBoxer, DbFight, DbTournament, DbTournament_Boxer } from "@/types/db"
import { userStore } from "@/composables/user.composable"

function getAuthHeaders(): Record<string, string> {
    const token = userStore.account?.authToken || localStorage.getItem("jwtToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

function mergeHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return { ...getAuthHeaders(), ...extra }
}

export class DbManager {
    // BOXER
    async getBoxers(): Promise<DbBoxer[]> {
        const res = await fetch("/api/boxers", { headers: getAuthHeaders() })
        if (!res.ok) throw new Error("Failed to fetch boxers")
        return await res.json()
    }
    async addBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        boxer.userId = userStore.getAccountOrThrow().id
        const res = await fetch("/api/boxers", {
            method: "POST",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(boxer),
        })
        if (!res.ok) throw new Error("Failed to add boxer")
        return await res.json()
    }
    async getBoxer(boxerId: string): Promise<DbBoxer> {
        const res = await fetch(`/api/boxers/${encodeURIComponent(boxerId)}`, {
            headers: getAuthHeaders(),
        })
        if (!res.ok) throw new Error("Failed to fetch boxer")
        return await res.json()
    }
    async updateBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        const res = await fetch(`/api/boxers/${encodeURIComponent(boxer.id)}`, {
            method: "PUT",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(boxer),
        })
        if (!res.ok) throw new Error("Failed to update boxer")
        return await res.json()
    }

    // FIGHT
    async getFights(tournamentId: string): Promise<DbFight[]> {
        const res = await fetch(`/api/fights?tournamentId=${encodeURIComponent(tournamentId)}`, {
            headers: getAuthHeaders(),
        })
        if (!res.ok) throw new Error("Failed to fetch fights")
        return await res.json()
    }
    async addFight(fight: DbFight): Promise<DbFight> {
        const res = await fetch("/api/fights", {
            method: "POST",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(fight),
        })
        if (!res.ok) throw new Error("Failed to add fight")
        return await res.json()
    }
    async deleteFights(ids: string[]): Promise<void> {
        const res = await fetch(`/api/fights`, {
            method: "DELETE",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ ids }),
        })
        if (!res.ok) throw new Error("Failed to delete fights")
    }
    async reorderFights(fightIds: string[], tournamentId: string): Promise<void> {
        const res = await fetch(`/api/fights/reorder`, {
            method: "POST",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ fightIds, tournamentId }),
        })
        if (!res.ok) throw new Error("Failed to reorder fights")
    }
    async updateFight(fight: DbFight): Promise<DbFight> {
        const res = await fetch(`/api/fights/${encodeURIComponent(fight.id)}`, {
            method: "PUT",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(fight),
        })
        if (!res.ok) throw new Error("Failed to update fight")
        return await res.json()
    }

    // TOURNAMENT
    async getTournaments(): Promise<DbTournament[]> {
        const res = await fetch("/api/tournaments", { headers: getAuthHeaders() })
        if (!res.ok) throw new Error("Failed to fetch tournaments")
        return await res.json()
    }
    async addTournament(tournament: DbTournament): Promise<DbTournament> {
        tournament.userId = userStore.getAccountOrThrow().id
        const res = await fetch("/api/tournaments", {
            method: "POST",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(tournament),
        })
        if (!res.ok) throw new Error("Failed to add tournament")
        return await res.json()
    }
    async deleteTournament(tournamentId: string): Promise<void> {
        const res = await fetch(`/api/tournaments/${encodeURIComponent(tournamentId)}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        })
        if (!res.ok) throw new Error("Failed to delete tournament")
    }

    // TOURNAMENT_BOXER
    async getTournamentBoxers(tournamentId: string): Promise<DbBoxer[]> {
        const res = await fetch(`/api/tournament-boxers?tournamentId=${encodeURIComponent(tournamentId)}`, {
            headers: getAuthHeaders(),
        })
        if (!res.ok) throw new Error("Failed to fetch tournament boxers")
        return await res.json()
    }
    async addBoxerToTournament(boxerId: string, tournamentId: string): Promise<DbTournament_Boxer> {
        const res = await fetch("/api/tournament-boxers", {
            method: "POST",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ boxerId, tournamentId }),
        })
        if (!res.ok) throw new Error("Failed to add boxer to tournament")
        return await res.json()
    }
    async deleteBoxersFromTournament(boxerIds: string[], tournamentId: string): Promise<void> {
        const res = await fetch(`/api/tournament-boxers`, {
            method: "DELETE",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ boxerIds, tournamentId }),
        })
        if (!res.ok) throw new Error("Failed to delete boxers from tournament")
    }
}

const instance = new DbManager()
Object.freeze(instance)
export default instance
