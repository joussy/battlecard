import { ApiImportBoxer, FileType } from "@/types/api"
import { getRaw, postAndDownload } from "@/utils/manager.utils"

export class ExternalService {
    static async getBoxerById(id: string): Promise<ApiImportBoxer | null> {
        const ret = await getRaw(`/api/external/importBoxerById`, { id }, "Failed to fetch boxer")
        return ret.ok ? await ret.json() : null
    }
    static async downloadFightCard(fileType: FileType, tournamentId: string) {
        await postAndDownload(`/api/external/printCard`, { fileType, tournamentId }, `fight-card.${fileType}`)
    }
}
