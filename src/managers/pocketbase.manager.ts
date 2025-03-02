import PocketBase from "pocketbase"
import { DbBoxer, DbFight, TypedPocketBase } from "@/types/db"
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
    async getFights(): Promise<DbFight[]> {
        return await pocketBase.collection("fight").getFullList({
            sort: "order",
        })
    }
    async addFight(fight: DbFight): Promise<DbFight> {
        fight.userId = userStore.account?.id
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
    async addBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        boxer.userId = userStore.account?.id
        boxer.id = ""
        return await pocketBase.collection("boxer").create(boxer)
    }
}
const instance = new PocketBaseManager()
Object.freeze(instance)
export default instance
