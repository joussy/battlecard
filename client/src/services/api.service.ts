import { uiStore } from "@/composables/ui.composable"
import { ApiBoxer, FileType } from "@/types/api"
import { postAndDownload } from "@/utils/download.utils"

export class ApiService {
    static async getBoxerById(id: string): Promise<ApiBoxer | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/external/importBoxerById?id=${id}`, {
                headers: {
                    Authorization: uiStore.getAccountOrThrow().authToken ?? "",
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
    static async downloadFightCard(fileType: FileType, tournamentId: string) {
        await postAndDownload(
            `${import.meta.env.VITE_SERVER_URL}/external/printCard`,
            { fileType, tournamentId },
            `fight-card.${fileType}`,
            {
                Authorization: uiStore.getAccountOrThrow().authToken ?? "",
            }
        )
    }
}
