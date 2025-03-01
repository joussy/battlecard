import PocketBase from "pocketbase"
import { DbBoxer, TypedPocketBase } from "@/types/db"
import { userStore } from "@/composables/user.composable"

const pocketBase = (
    import.meta.env.VITE_SERVER_URL ? new PocketBase(import.meta.env.VITE_SERVER_URL) : null
) as TypedPocketBase

export class PocketBaseManager {
    isAvailable(): boolean {
        return pocketBase && userStore.account?.id != null
    }
    async getBoxers(): Promise<DbBoxer[]> {
        return await pocketBase.collection("boxer").getFullList()
    }
    async addBoxer(boxer: DbBoxer): Promise<DbBoxer> {
        console.log("insert")
        if (!pocketBase || !userStore.account?.id) return Promise.reject()
        boxer.userId = userStore.account.id
        boxer.id = ""
        return pocketBase.collection("boxer").create(boxer)
    }
}
const instance = new PocketBaseManager()
Object.freeze(instance)
export default instance
