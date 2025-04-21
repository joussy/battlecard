import PocketBase from "pocketbase"
import { DbBoxer, DbFight, DbTournament, TypedPocketBase } from "@/types/db"
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
    async deleteBoxers(ids: string[]) {
        if (ids.length == 0) {
            return
        }
        const batch = pocketBase.createBatch()
        for (const id of ids) {
            batch.collection("boxer").delete(id)
        }
        await batch.send()
    }
    async getBoxers(): Promise<DbBoxer[]> {
        return await pocketBase.collection("boxer").getFullList()
    }
    async getBoxersForTournament(tournamentId: string): Promise<DbBoxer[]> {
        return await pocketBase.collection("tournament_boxer").getFullList({
            filter: `tournamentId = '${tournamentId}'`,
            expand: "boxerId",
        })
    }
    async addBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        boxer.userId = userStore.account?.id
        boxer.id = ""
        return await pocketBase.collection("tournament_boxer").create(boxer)
    }
}
const instance = new PocketBaseManager()
Object.freeze(instance)
export default instance
