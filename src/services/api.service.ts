import { ApiBoxer, FileType } from "@/types/api"
import { userStore } from "@/composables/user.composable"
import { postAndDownload } from "@/utils/download.utils"
import { Fight } from "@/types/boxing"
import ApiConverter from "@/converters/api.converter"
import { IModality } from "@/fightModality/IModality"

export class ApiService {
    static async getBoxerById(id: string): Promise<ApiBoxer | null> {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/getBoxerById?id=${id}`, {
                headers: {
                    Authorization: userStore.getAccountOrThrow().authToken ?? "",
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
    static async downloadFightCard(fileType: FileType, fightCard: readonly Fight[], modality: IModality) {
        const cardExtraInfo = fightCard.map((f) => ApiConverter.ToFightCardExtraInfo(f, modality))
        await postAndDownload(
            `${import.meta.env.VITE_SERVER_URL}/api/printCard`,
            { fileType, cardExtraInfo },
            `fight-card.${fileType}`,
            {
                Authorization: userStore.getAccountOrThrow().authToken ?? "",
            }
        )
    }
}
