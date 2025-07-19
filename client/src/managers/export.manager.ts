import { ApiGeneratedToken } from "@/shared/types/api"
import { mutate, postAndDownload } from "@/utils/manager.utils"

export class ExportManager {
    async downloadFightCardPdf(tournamentId: string) {
        await postAndDownload(`/api/export/fightcard/pdf`, { tournamentId }, `fight-card.pdf`)
    }
    async downloadFightCardPng(tournamentId: string) {
        await postAndDownload(`/api/export/fightcard/png`, { tournamentId }, `fight-card.png`)
    }
    async downloadFightCardXlsx(tournamentId: string) {
        await postAndDownload(`/api/export/fightcard/xlsx`, { tournamentId }, `fight-card.xlsx`)
    }
    async downloadFightCardCsv(tournamentId: string) {
        await postAndDownload(`/api/export/fightcard/csv`, { tournamentId }, `fight-card.csv`)
    }

    // Selector export methods
    async downloadSelectorPdf(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/pdf`, { tournamentId, boxerIds }, `selector.pdf`)
    }
    async downloadSelectorPng(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/png`, { tournamentId, boxerIds }, `selector.png`)
    }
    async downloadSelectorXlsx(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/xlsx`, { tournamentId, boxerIds }, `selector.xlsx`)
    }
    async downloadSelectorBattlecard(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/battlecard`, { tournamentId, boxerIds }, `battlecard.csv`)
    }
    async downloadSelectorCsv(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/csv`, { tournamentId, boxerIds }, `selector.csv`)
    }

    async generateFightCardRoToken(tournamentId: string): Promise<string> {
        const res = await mutate<ApiGeneratedToken>(`/api/share/fightcard/generateRoToken`, "POST", { tournamentId })
        return res.token
    }

    // Shared fight card download
    async downloadSharedFightCardPdf(fightCardToken: string) {
        await postAndDownload(`/api/share/fightcard/pdf`, { fightCardToken }, "fight-card.pdf")
    }
    async downloadSharedFightCardPng(fightCardToken: string) {
        await postAndDownload(`/api/share/fightcard/png`, { fightCardToken }, "fight-card.png")
    }
    async downloadSharedFightCardXlsx(fightCardToken: string) {
        await postAndDownload(`/api/share/fightcard/xlsx`, { fightCardToken }, "fight-card.xlsx")
    }
    async downloadSharedFightCardCsv(fightCardToken: string) {
        await postAndDownload(`/api/share/fightcard/csv`, { fightCardToken }, "fight-card.csv")
    }
}

const instance = new ExportManager()
Object.freeze(instance)
export default instance
