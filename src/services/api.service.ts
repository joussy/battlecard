import { ApiBoxer, BoxerExtraInfo, FileType } from "@/types/api"
import { userStore } from "@/composables/user.composable"
import { postAndDownload } from "@/utils/download.utils"
import { BoxerAttributes } from "@/types/boxing"
import ApiConverter from "@/converters/api.converter"

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
    static async downloadFightCard(fileType: FileType, boxers: readonly BoxerAttributes[]) {
        const cardExtraInfo = boxers.map((b) => ApiConverter.toBoxerCardExtraInfo(b))
        await postAndDownload(
            `${import.meta.env.VITE_SERVER_URL}/api/printCard`,
            { fileType, cardExtraInfo },
            `fight-card.${fileType}`,
            {
                Authorization: userStore.account?.authToken ?? "",
            }
        )
    }
}
