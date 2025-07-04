import { ApiImportBoxer } from "@/shared/types/api"
import { getRaw, postAndDownload } from "@/utils/manager.utils"

export class ExternalService {
    static async importBoxerById(id: string): Promise<ApiImportBoxer | null> {
        const ret = await getRaw(`/api/external/importBoxerById`, { id }, "Failed to fetch boxer")
        return ret.ok ? await ret.json() : null
    }
    static async downloadFightCardPdf(tournamentId: string) {
        await postAndDownload(`/api/external/generatePdf`, { tournamentId }, `fight-card.pdf`)
    }
    static async downloadFightCardPng(tournamentId: string) {
        await postAndDownload(`/api/external/generatePng`, { tournamentId }, `fight-card.png`)
    }
    static async downloadFightCardXlsx(tournamentId: string) {
        await postAndDownload(`/api/external/generateXlsx`, { tournamentId }, `fight-card.xlsx`)
    }
    static async downloadFightCardCsv(tournamentId: string) {
        await postAndDownload(`/api/external/generateCsv`, { tournamentId }, `fight-card.csv`)
    }
}
