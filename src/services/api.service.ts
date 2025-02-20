import { ApiBoxer } from "@/types/api"
import { userStore } from "@/composables/user.composable"

export class ApiService {
    static async getBoxerById(id: string): Promise<ApiBoxer | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/getBoxerById?id=${id}`, {
                headers: {
                    Authorization: userStore.account?.authToken ?? "",
                },
            })
            if (!response.ok) {
                throw new Error(`Error fetching user: ${response.statusText}`)
            }
            return await response.json()
        } catch (error) {
            console.error(error)
            return null
        }
    }
}
