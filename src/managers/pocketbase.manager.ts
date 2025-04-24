import PocketBase from "pocketbase"
import { DbBoxer, DbFight, DbTournament, DbTournament_Boxer, TypedPocketBase } from "@/types/db"
import { userStore } from "@/composables/user.composable"

const pocketBase = (
    import.meta.env.VITE_SERVER_URL ? new PocketBase(import.meta.env.VITE_SERVER_URL) : null
) as TypedPocketBase

export class PocketBaseManager {
    async updateFights(fights: DbFight[]) {
        const batch = pocketBase.createBatch()
        for (const fight of fights) {
            batch.collection("fight").update(fight.id, fight)
        }
        await batch.send()
    }
    async deleteFights(fightIds: string[]) {
        if (fightIds.length == 0) {
            return
        }
        const batch = pocketBase.createBatch()
        for (const id of fightIds) {
            batch.collection("fight").delete(id)
        }
        await batch.send()
    }
    async getFights(tournamentId: string): Promise<DbFight[]> {
        return await pocketBase.collection("fight").getFullList({
            sort: "order",
            filter: `tournamentId = '${tournamentId}'`,
        })
    }
    async getTournaments(): Promise<DbTournament[]> {
        return await pocketBase.collection("tournament").getFullList()
    }
    async addFight(fight: DbFight): Promise<DbFight> {
        fight.id = ""
        return await pocketBase.collection("fight").create(fight)
    }
    async deleteBoxersFromTournament(boxerIds: string[], tournamentId: string) {
        if (boxerIds.length == 0) {
            return
        }

        const tbs = (
            (await pocketBase.collection("tournament_boxer").getFullList({
                filter: `tournamentId = '${tournamentId}'`,
            })) as DbTournament_Boxer[]
        ).filter((tbs) => tbs.id)

        const batch = pocketBase.createBatch()
        for (const tb of tbs) {
            batch.collection("tournament_boxer").delete(tb.id)
        }
        await batch.send()
    }
    async getBoxers(): Promise<DbBoxer[]> {
        return await pocketBase.collection("boxer").getFullList()
    }
    async getBoxersForTournament(tournamentId: string): Promise<DbBoxer[]> {
        const ret = await pocketBase.collection("tournament_boxer").getFullList({
            filter: `tournamentId = '${tournamentId}'`,
            expand: "boxerId",
        })
        const boxers = ret.map((r: DbTournament_Boxer) => r.expand.boxerId)
        return boxers
    }

    async addBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        boxer.userId = userStore.getAccountOrThrow().id
        boxer.id = ""
        return await pocketBase.collection("boxer").create(boxer)
    }
    getBoxer(boxerId: string): Promise<DbBoxer> {
        return pocketBase.collection("boxer").getOne(boxerId)
    }

    async addTournament(tournament: DbTournament): Promise<DbTournament> {
        tournament.userId = userStore.getAccountOrThrow().id
        tournament.id = ""
        return await pocketBase.collection("tournament").create(tournament)
    }

    async addBoxerToTournament(boxerId: string, tournamentId: string): Promise<DbTournament_Boxer> {
        return await pocketBase.collection("tournament_boxer").create({ boxerId, tournamentId } as DbTournament_Boxer)
    }
    async deleteTournament(tournamentId: string) {
        const tbs = (await pocketBase.collection("tournament_boxer").getFullList({
            filter: `tournamentId = '${tournamentId}'`,
            fields: "id",
        })) as DbTournament_Boxer[]
        const fights = (await pocketBase.collection("fight").getFullList({
            filter: `tournamentId = '${tournamentId}'`,
            fields: "id",
        })) as DbFight[]

        const batch = pocketBase.createBatch()
        for (const fight of fights) {
            batch.collection("fight").delete(fight.id)
        }
        for (const tb of tbs) {
            batch.collection("tournament_boxer").delete(tb.id)
        }
        batch.collection("tournament").delete(tournamentId)
        await batch.send()
    }

    getAllBoxers(): Promise<DbBoxer[]> {
        return pocketBase.collection("boxer").getFullList() as Promise<DbBoxer[]>
    }
}
const instance = new PocketBaseManager()
Object.freeze(instance)
export default instance
