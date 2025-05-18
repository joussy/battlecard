import { Boxer, BoxerAttributes, Fight, Gender, Opponent, Tournament } from "@/types/boxing.d"
import { ModalityError, ModalityErrorType } from "@/types/modality.d"
import { stringify as stringifyCsv, parse as parseCsv } from "csv/browser/esm/sync"
import { format, parse } from "date-fns"
import { ApiService } from "@/services/api.service"
import fightCardStore from "@/composables/fight.composable"
import { generateRandomId } from "@/utils/string.utils"
import { readonly } from "vue"
import { uiStore } from "@/composables/ui.composable"
import { userStore } from "@/composables/user.composable"

export class FightService {
    async loadFightStore() {
        await fightCardStore.loadFightStore()
        this.computeBoxersCategory()
        this.computeBoxersOpponents()
    }

    computeBoxersCategory() {
        for (const boxer of fightCardStore.store.boxers) {
            fightCardStore.setBoxerCategory(
                boxer.attributes.id,
                fightCardStore.store.modality.getCategoryName(boxer.attributes, false),
                fightCardStore.store.modality.getCategoryName(boxer.attributes, true)
            )
        }
    }

    store() {
        return readonly(fightCardStore.store)
    }
    async removeBoxersFromTournament() {
        await fightCardStore.removeBoxersFromTournament()
    }
    getNbFightsForBoxer(boxer: Boxer): number {
        return fightCardStore.store.fightCard.filter(
            (f) => f.boxer1.attributes.id == boxer.attributes.id || f.boxer2.attributes.id == boxer.attributes.id
        ).length
    }

    getBoxerDisplayName(boxer: Readonly<BoxerAttributes>): string {
        return `${boxer.firstName} ${boxer.lastName}`
    }

    isInFightCard(boxer: Boxer): boolean {
        return this.getNbFightsForBoxer(boxer) > 0
    }

    async removeFight(fight: Fight) {
        await fightCardStore.removeFightById(fight.id)
    }

    removeFromFightCard(boxer1: Boxer, boxer2: Boxer): void {
        const fightId = this.getFightId(boxer1, boxer2)
        if (fightId != null) {
            fightCardStore.removeFightById(fightId)
        }
    }

    getFightId(boxer1: Boxer, boxer2: Boxer): string | null {
        const index = fightCardStore.store.fightCard.find(
            (fight) =>
                (fight.boxer1.attributes.id === boxer1.attributes.id &&
                    fight.boxer2.attributes.id === boxer2.attributes.id) ||
                (fight.boxer1.attributes.id === boxer2.attributes.id &&
                    fight.boxer2.attributes.id === boxer1.attributes.id)
        )
        return index?.id ?? null
    }

    getOpponentModalityErrors(boxer: BoxerAttributes, opponent: BoxerAttributes): ModalityError[] {
        return fightCardStore.store.modality.getModalityProblems(boxer, opponent)
    }

    getOpponentModalityError(
        boxer: Boxer,
        opponent: Boxer,
        modalityErrorType: ModalityErrorType
    ): ModalityError | undefined {
        return fightCardStore.store.modality
            .getModalityProblems(boxer.attributes, opponent.attributes)
            .find((m) => m.type == modalityErrorType)
    }

    getClubs(): string[] {
        return [...new Set(fightCardStore.store.boxers.map((boxer) => boxer.attributes.club))]
    }

    canCompete(boxer1: Boxer, boxer2: Boxer): boolean {
        return !this.isCompeting(boxer1, boxer2)
    }

    isCompeting(boxer1: Boxer, boxer2: Boxer): boolean {
        const index = this.getFightId(boxer1, boxer2)

        return index != null
    }

    async addToFightCard(boxer1: Boxer, boxer2: Boxer) {
        // Check if the fight already exists before adding to the fight card
        const order = fightCardStore.store.fightCard.length
        if (!this.isCompeting(boxer1, boxer2)) {
            const fight = await fightCardStore.addFight(boxer1, boxer2, order)
            fightCardStore.setModalityErrors(
                fight.id,
                this.getOpponentModalityErrors(boxer1.attributes, boxer2.attributes)
            )
        }
    }

    computeBoxersOpponents() {
        for (const [, boxer] of fightCardStore.store.boxers.entries()) {
            const opponents = fightCardStore.store.boxers
                .map(
                    (b) =>
                        <Opponent>{
                            weightDifference: Math.abs(boxer.attributes.weight - b.attributes.weight),
                            boxer: b,
                            modalityErrors: this.getOpponentModalityErrors(boxer.attributes, b.attributes),
                            isEligible: this.getOpponentModalityErrors(boxer.attributes, b.attributes).length == 0,
                        }
                )
                .filter(
                    (o) =>
                        !o.modalityErrors.some((modalityError) =>
                            [
                                ModalityErrorType.SAME_CLUB,
                                ModalityErrorType.SAME_ID,
                                ModalityErrorType.OPPOSITE_GENDER,
                            ].includes(modalityError.type)
                        )
                )
                .sort((a, b) => a.modalityErrors.length - b.modalityErrors.length)
            fightCardStore.setBoxerOpponents(boxer.attributes.id, opponents)
        }
    }

    async addBoxer(boxerAttributes: BoxerAttributes) {
        let boxer: Boxer | null = {
            attributes: boxerAttributes,
            opponents: [],
        }
        boxer = await fightCardStore.addOrUpdateBoxer(boxer)

        if (boxer != null) {
            fightCardStore.setBoxerCategory(
                boxer.attributes.id,
                fightCardStore.store.modality.getCategoryName(boxer.attributes, false),
                fightCardStore.store.modality.getCategoryName(boxer.attributes, true)
            )
            this.computeBoxersOpponents()
        }

        return boxer
    }

    async addTournament(tournament: Tournament) {
        tournament = await fightCardStore.addTournament(tournament)
        this.setCurrentTournament(tournament.id)
    }

    async importFromApiByIds(csv: string) {
        const parsedCsv = parseCsv(csv, {
            columns: ["license", "weight"],
            skip_empty_lines: true,
            delimiter: ",",
        })
        for (const [, entry] of parsedCsv.entries()) {
            const apiBoxer = await ApiService.getBoxerById(entry.license)
            if (apiBoxer) {
                await this.addBoxer({
                    id: "",
                    license: apiBoxer.license,
                    birthDate: new Date(apiBoxer.birth_date),
                    club: apiBoxer.club,
                    firstName: apiBoxer.firstname,
                    lastName: apiBoxer.name,
                    nbFights: 0,
                    weight: parseFloat(entry.weight),
                    category: "fakeCat",
                    categoryShortText: "fakeCatShort",
                    gender: apiBoxer.gender == "male" ? Gender.MALE : Gender.FEMALE,
                    userId: userStore.account!.id,
                })
            }
        }
    }

    async importFromCsv(csv: string, delimiter: string) {
        if (!userStore.account?.id) {
            return
        }
        const parsedCsv = parseCsv(csv, {
            columns: ["lastName", "firstName", "nbFights", "gender", "weight", "club", "birthDate", "license"],
            skip_empty_lines: true,
            delimiter,
        })
        for (const [, entry] of parsedCsv.entries()) {
            const boxerAttributes = {
                id: generateRandomId(),
                lastName: entry.lastName,
                firstName: entry.firstName,
                birthDate: parse(entry.birthDate, "dd/MM/yyyy", new Date()),
                nbFights: parseInt(entry.nbFights),
                category: "",
                categoryShortText: "",
                club: entry.club,
                weight: parseFloat(entry.weight),
                gender: entry.gender == "F" ? Gender.FEMALE : Gender.MALE,
                license: entry.license,
                userId: userStore.account.id,
            }
            await this.addBoxer(boxerAttributes)
        }
        this.computeBoxersOpponents()
    }

    getAvailableBoxersAsCsv(): string {
        const entries = fightCardStore.store.boxers.map((entry) => {
            return {
                lastName: entry.attributes.lastName,
                firstName: entry.attributes.firstName,
                nbFights: entry.attributes.nbFights,
                gender: entry.attributes.gender == Gender.FEMALE ? "F" : "M",
                weight: entry.attributes.weight,
                club: entry.attributes.club,
                birthDate: format(entry.attributes.birthDate, "dd/MM/yyyy"),
                license: entry.attributes.license,
            }
        })
        const csv = stringifyCsv(entries, { delimiter: "\t" })
        return csv
    }

    async moveFight(fightId: string, order: number) {
        await fightCardStore.updateFightOrder(fightId, order)
    }
    async switchFight(fightId: string) {
        await fightCardStore.switchFight(fightId)
    }

    async setCurrentTournament(tournamentId: string | null) {
        const tournaments = fightCardStore.store.tournaments
        tournamentId = tournaments.length == 1 ? tournaments[0].id : tournamentId
        uiStore.setCurrentTournament(tournamentId)
        if (fightCardStore.store.currentTournament != tournamentId) {
            fightCardStore.setCurrentTournament(tournamentId)
            await this.loadFightStore()
        }
    }
    deleteTournament(tournamentId: string) {
        fightCardStore.deleteTournament(tournamentId)
    }
    getAllBoxerAttributes(): Promise<Readonly<BoxerAttributes[]>> {
        return fightCardStore.getAllBoxersAttributes()
    }
    async addBoxerToTournament(boxerId: string) {
        const boxer = await fightCardStore.addBoxerToTournament(boxerId)
        this.computeBoxersCategory()
        this.computeBoxersOpponents()

        return boxer
    }
}

const instance = new FightService()
Object.freeze(instance)
export default instance
