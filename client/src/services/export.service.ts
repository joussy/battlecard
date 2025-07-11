import { postAndDownload } from "@/utils/manager.utils"

export class ExportService {
    static async downloadFightCardPdf(tournamentId: string) {
        await postAndDownload(`/api/export/fightcard/pdf`, { tournamentId }, `fight-card.pdf`)
    }
    static async downloadFightCardPng(tournamentId: string) {
        await postAndDownload(`/api/export/fightcard/png`, { tournamentId }, `fight-card.png`)
    }
    static async downloadFightCardXlsx(tournamentId: string) {
        await postAndDownload(`/api/export/fightcard/xlsx`, { tournamentId }, `fight-card.xlsx`)
    }
    static async downloadFightCardCsv(tournamentId: string) {
        await postAndDownload(`/api/export/fightcard/csv`, { tournamentId }, `fight-card.csv`)
    }

    // Selector export methods
    static async downloadSelectorPdf(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/pdf`, { tournamentId, boxerIds }, `selector.pdf`)
    }
    static async downloadSelectorPng(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/png`, { tournamentId, boxerIds }, `selector.png`)
    }
    static async downloadSelectorXlsx(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/xlsx`, { tournamentId, boxerIds }, `selector.xlsx`)
    }
    static async downloadSelectorBattlecard(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/battlecard`, { tournamentId, boxerIds }, `battlecard.csv`)
    }
    static async downloadSelectorCsv(tournamentId: string, boxerIds: string[]) {
        await postAndDownload(`/api/export/selector/csv`, { tournamentId, boxerIds }, `selector.csv`)
    }
}
