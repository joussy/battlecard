import { ApiBoxer } from "@/types/api"

export class ApiService {
    static async getBoxerById(id: string, baseUrl: string): Promise<ApiBoxer | null> {
        try {
            const response = await fetch(`${baseUrl}/getById?id=${id}`)
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
