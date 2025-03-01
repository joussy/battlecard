import PocketBase from "pocketbase"
import { DbBoxer, TypedPocketBase } from "@/types/db"
import { userStore } from "@/composables/user.composable"

const pocketBase = (
    import.meta.env.VITE_SERVER_URL ? new PocketBase(import.meta.env.VITE_SERVER_URL) : null
) as TypedPocketBase

export class PocketBaseManager {
    async getBoxers(): Promise<DbBoxer[]> {
        return await pocketBase.collection("boxer").getFullList()
    }
    addBoxer(boxer: DbBoxer) {
        console.log("insert")
        if (!pocketBase || !userStore.account?.id) return
        boxer.userId = userStore.account.id
        pocketBase.collection("boxer").create(boxer)
    }
}
const instance = new PocketBaseManager()
Object.freeze(instance)
export default instance
