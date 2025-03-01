import { Boxer, BoxerAttributes, Fight, Gender, Opponent } from "@/types/boxing.d"
import { ModalityError, ModalityErrorType } from "@/types/modality.d"
import { stringify as stringifyCsv, parse as parseCsv } from "csv/browser/esm/sync"
import { format, parse } from "date-fns"
import { ApiService } from "@/services/api.service"
import { fightCardStore } from "@/composables/fight.composable"
import { FightCardStorage } from "@/types/localstorage"
import DbConverter from "@/converters/db.converter"
import pocketBaseManager from "@/managers/pocketbase.manager"
import { userStore } from "@/composables/user.composable"
import { generateRandomId } from "@/utils/string.utils"

export class FightService {
    clear(): void {
        fightCardStore.boxers = []
        fightCardStore.fightCard = []
    }
    getNbFightsForBoxer(boxer: Boxer): number {
        return fightCardStore.fightCard.filter(
            (f: Fight) => f.boxer1.attributes.id == boxer.attributes.id || f.boxer2.attributes.id == boxer.attributes.id
        ).length
    }

    getBoxerDisplayName(boxer: Boxer): string {
        return `${boxer.attributes.firstName} ${boxer.attributes.lastName}`
    }

    isInFightCard(boxer: Boxer): boolean {
        return this.getNbFightsForBoxer(boxer) > 0
    }

    removeFromFightCard(boxer1: Boxer, boxer2: Boxer): void {
        const index = this.getFightId(boxer1, boxer2)
        if (index != null) {
            this.removeFromFightCardByIndex(index)
        }
    }

    getFightId(boxer1: Boxer, boxer2: Boxer): number | null {
        const index = fightCardStore.fightCard.findIndex(
            (fight: Fight) =>
                (fight.boxer1.attributes.id === boxer1.attributes.id &&
                    fight.boxer2.attributes.id === boxer2.attributes.id) ||
                (fight.boxer1.attributes.id === boxer2.attributes.id &&
                    fight.boxer2.attributes.id === boxer1.attributes.id)
        )
        return index < 0 ? null : index
    }

    removeFromFightCardByIndex(index: number): void {
        // Remove fight from the fight card
        fightCardStore.fightCard.splice(index, 1)
    }

    getOpponentModalityErrors(boxer: Boxer, opponent: Boxer): ModalityError[] {
        return fightCardStore.modality.getModalityProblems(boxer.attributes, opponent.attributes)
    }

    getOpponentModalityError(
        boxer: Boxer,
        opponent: Boxer,
        modalityErrorType: ModalityErrorType
    ): ModalityError | undefined {
        return fightCardStore.modality
            .getModalityProblems(boxer.attributes, opponent.attributes)
            .find((m) => m.type == modalityErrorType)
    }

    getClubs(): string[] {
        return [...new Set(fightCardStore.boxers.map((boxer) => boxer.attributes.club))]
    }

    canCompete(boxer1: Boxer, boxer2: Boxer): boolean {
        return !this.isCompeting(boxer1, boxer2)
    }

    isCompeting(boxer1: Boxer, boxer2: Boxer): boolean {
        const index = this.getFightId(boxer1, boxer2)

        return index != null
    }

    addToFightCard(boxer1: Boxer, boxer2: Boxer) {
        // Check if the fight already exists before adding to the fight card

        if (!this.isCompeting(boxer1, boxer2)) {
            fightCardStore.fightCard.push({
                boxer1,
                boxer2,
                modalityErrors: this.getOpponentModalityErrors(boxer1, boxer2),
            })
        }
    }

    computeBoxersOpponents() {
        for (const [, boxer] of fightCardStore.boxers.entries()) {
            boxer.opponents = fightCardStore.boxers
                .map(
                    (b) =>
                        <Opponent>{
                            weightDifference: Math.abs(boxer.attributes.weight - b.attributes.weight),
                            boxer: b,
                            modalityErrors: this.getOpponentModalityErrors(boxer, b),
                            isEligible: this.getOpponentModalityErrors(boxer, b).length == 0,
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
            boxer.attributes.category = fightCardStore.modality.getCategory(boxer.attributes, false)
            boxer.attributes.categoryShortText = fightCardStore.modality.getCategory(boxer.attributes, true)
        }
    }

    addBoxer(boxerAttributes: BoxerAttributes) {
        boxerAttributes.id = generateRandomId()

        const boxer: Boxer = {
            attributes: boxerAttributes,
            collapsed: true,
            opponents: [],
        }
        pocketBaseManager.addBoxer(DbConverter.toDbBoxer(boxerAttributes))
        fightCardStore.boxers.push(boxer)
        this.computeBoxersOpponents()
    }

    async importFromApiByIds(csv: string) {
        const parsedCsv = parseCsv(csv, {
            columns: ["licence", "weight"],
            skip_empty_lines: true,
            delimiter: ",",
        })
        for (const [, entry] of parsedCsv.entries()) {
            const apiBoxer = await ApiService.getBoxerById(entry.licence)
            if (apiBoxer) {
                this.addBoxer({
                    id: generateRandomId(),
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
                })
            }
        }
    }

    importFromCsv(csv: string) {
        const parsedCsv = parseCsv(csv, {
            columns: ["lastName", "firstName", "nbFights", "gender", "weight", "club", "birthDate", "license"],
            skip_empty_lines: true,
            delimiter: "\t",
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
            }
            this.addBoxer(boxerAttributes)
        }
        this.computeBoxersOpponents()
    }

    getAvailableBoxersAsCsv(): string {
        const entries = fightCardStore.boxers.map((entry: Boxer) => {
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

    async loadFightStore() {
        if (userStore.account?.id) {
            console.debug("loading store from Db... ")
            await this.loadFromDb()
        } else if (localStorage["fightCardStore"]) {
            console.debug("loading store from LocalStorage... ")
            const localStorageDataString = localStorage.getItem("fightCardStore") as string
            this.loadFromLocalStorage(localStorageDataString)
        } else {
            console.debug("no store available ... ")
        }
        fightCardStore.restored = true
    }

    private async loadFromDb() {
        const boxers = await pocketBaseManager.getBoxers()
        fightCardStore.boxers = boxers.map((b) => DbConverter.toBoxer(b))
        this.computeBoxersOpponents()
    }

    private loadFromLocalStorage(localStorageDataString: string) {
        const localStorageData: FightCardStorage = JSON.parse(localStorageDataString)

        fightCardStore.boxers = localStorageData.boxers.map((b) => {
            return {
                attributes: {
                    ...b.attributes,
                    birthDate: new Date(b.attributes.birthDate),
                },
                collapsed: b.collapsed,
            } as Boxer
        })
        this.computeBoxersOpponents()
        // Create a map of boxers by their id for quick lookup
        const boxerMap = new Map(fightCardStore.boxers.map((boxer) => [boxer.attributes.id, boxer]))

        for (const fight of localStorageData.fightCard) {
            const boxer1 = boxerMap.get(fight.boxer1Id)
            const boxer2 = boxerMap.get(fight.boxer2Id)
            if (boxer1 && boxer2) {
                this.addToFightCard(boxer1, boxer2)
            }
        }

        console.debug("store loaded")
        console.debug(localStorageData)
    }
}

const instance = new FightService()
Object.freeze(instance)
export default instance
