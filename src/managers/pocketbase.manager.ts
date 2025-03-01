import PocketBase from "pocketbase"
import { DbBoxer, DbFight, TypedPocketBase } from "@/types/db"
import { userStore } from "@/composables/user.composable"

const pocketBase = (
    import.meta.env.VITE_SERVER_URL ? new PocketBase(import.meta.env.VITE_SERVER_URL) : null
) as TypedPocketBase

export class PocketBaseManager {
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
        return await pocketBase.collection("fight").getFullList()
    }
    async addFight(fight: DbFight): Promise<DbFight> {
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
    isAvailable(): boolean {
        return pocketBase && userStore.account?.id != null
    }
    async getBoxers(): Promise<DbBoxer[]> {
        return await pocketBase.collection("boxer").getFullList()
    }
    async addBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        console.log("insert")
        if (!pocketBase || !userStore.account?.id) {
            return Promise.reject()
        }
        boxer.userId = userStore.account.id
        boxer.id = ""
        return await pocketBase.collection("boxer").create(boxer)
    }
}
const instance = new PocketBaseManager()
Object.freeze(instance)
export default instance
