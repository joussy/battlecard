import { reactive, toRaw, watchEffect } from "vue"
import { Boxer, BoxerAttributes, Fight, Gender, Opponent } from "@/types/boxing.d"
import { DataStorage, BoxerStorage, FightStorage } from "@/types/localstorage.d"
import { ModalityError, ModalityErrorType } from "@/types/modality.d"
import { BeaModality } from "@/fightModality/BeaModality"
import { stringify as stringifyCsv, parse as parseCsv } from "csv/browser/esm/sync"
import { format, parse } from "date-fns"
import { ApiService } from "@/services/api.service"

export const store = reactive({
    darkMode: false,
    restored: false as boolean,
    fightCard: [] as Fight[],
    boxers: [] as Boxer[],
    modality: new BeaModality(),
    apiServerAddress: "",
    clear(): void {
        this.boxers = []
        this.fightCard = []
    },
    getNbFightsForBoxer(boxer: Boxer): number {
        return this.fightCard.filter(
            (f: Fight) => f.boxer1.attributes.id == boxer.attributes.id || f.boxer2.attributes.id == boxer.attributes.id
        ).length
    },
    getBoxerDisplayName(boxer: Boxer): string {
        return `${boxer.attributes.firstName} ${boxer.attributes.lastName}`
    },
    isInFightCard(boxer: Boxer): boolean {
        return this.getNbFightsForBoxer(boxer) > 0
    },
    removeFromFightCard(boxer1: Boxer, boxer2: Boxer): void {
        const index = this.getFightId(boxer1, boxer2)
        if (index != null) {
            this.removeFromFightCardByIndex(index)
        }
    },
    getFightId(boxer1: Boxer, boxer2: Boxer): number | null {
        const index = this.fightCard.findIndex(
            (fight: Fight) =>
                (fight.boxer1.attributes.id === boxer1.attributes.id &&
                    fight.boxer2.attributes.id === boxer2.attributes.id) ||
                (fight.boxer1.attributes.id === boxer2.attributes.id &&
                    fight.boxer2.attributes.id === boxer1.attributes.id)
        )
        return index < 0 ? null : index
    },
    removeFromFightCardByIndex(index: number): void {
        // Remove fight from the fight card
        this.fightCard.splice(index, 1)
    },
    getOpponentModalityErrors(boxer: Boxer, opponent: Boxer): ModalityError[] {
        return this.modality.getModalityProblems(boxer.attributes, opponent.attributes)
    },
    getOpponentModalityError(
        boxer: Boxer,
        opponent: Boxer,
        modalityErrorType: ModalityErrorType
    ): ModalityError | undefined {
        return this.modality
            .getModalityProblems(boxer.attributes, opponent.attributes)
            .find((m) => m.type == modalityErrorType)
    },
    getClubs(): string[] {
        return [...new Set(this.boxers.map((boxer) => boxer.attributes.club))]
    },
    canCompete(boxer1: Boxer, boxer2: Boxer): boolean {
        return !this.isCompeting(boxer1, boxer2)
    },

    isCompeting(boxer1: Boxer, boxer2: Boxer): boolean {
        const index = this.getFightId(boxer1, boxer2)

        return index != null
    },
    addToFightCard(boxer1: Boxer, boxer2: Boxer) {
        // Check if the fight already exists before adding to the fight card

        if (!this.isCompeting(boxer1, boxer2)) {
            this.fightCard.push({ boxer1, boxer2, modalityErrors: this.getOpponentModalityErrors(boxer1, boxer2) })
        }
    },
    computeBoxersOpponents() {
        for (const [, boxer] of this.boxers.entries()) {
            boxer.opponents = this.boxers
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
            boxer.attributes.category = this.modality.getCategory(boxer.attributes, false)
            boxer.attributes.categoryShortText = this.modality.getCategory(boxer.attributes, true)
        }
    },
    addBoxer(boxerAttributes: BoxerAttributes) {
        if (this.boxers.length > 0) {
            boxerAttributes.id = Math.max(...this.boxers.map((b) => b.attributes.id)) + 1
        } else {
            boxerAttributes.id = 0
        }

        const boxer: Boxer = {
            attributes: boxerAttributes,
            collapsed: true,
            opponents: [],
        }
        this.boxers.push(boxer)
        this.computeBoxersOpponents()
    },
    async importFromApiByIds(csv: string) {
        console.log(csv)
        const parsedCsv = parseCsv(csv, {
            columns: ["licence", "weight"],
            skip_empty_lines: true,
            delimiter: ",",
        })
        for (const [, entry] of parsedCsv.entries()) {
            const apiBoxer = await ApiService.getBoxerById(entry.licence, store.apiServerAddress)
            if (apiBoxer) {
                this.addBoxer({
                    id: 0,
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
    },
    importFromCsv(csv: string) {
        const parsedCsv = parseCsv(csv, {
            columns: ["lastName", "firstName", "nbFights", "gender", "weight", "club", "birthDate", "license"],
            skip_empty_lines: true,
            delimiter: "\t",
        })
        for (const [, entry] of parsedCsv.entries()) {
            const boxerAttributes = {
                id: 0,
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
    },
    getAvailableBoxersAsCsv(): string {
        const entries = this.boxers.map((entry: Boxer) => {
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
        console.log(csv)
        return csv
    },
})

export function loadStore(): void {
    console.debug("loading store ... ")
    const localStorageDataString = localStorage.getItem("store")
    if (localStorageDataString) {
        const localStorageData: DataStorage = JSON.parse(localStorageDataString)

        store.boxers = localStorageData.boxers.map((b) => {
            return {
                attributes: {
                    ...b.attributes,
                    birthDate: new Date(b.attributes.birthDate),
                },
                collapsed: b.collapsed,
            } as Boxer
        })
        store.computeBoxersOpponents()
        // Create a map of boxers by their id for quick lookup
        const boxerMap = new Map(store.boxers.map((boxer) => [boxer.attributes.id, boxer]))

        for (const fight of localStorageData.fightCard) {
            const boxer1 = boxerMap.get(fight.boxer1Id)
            const boxer2 = boxerMap.get(fight.boxer2Id)
            if (boxer1 && boxer2) {
                store.addToFightCard(boxer1, boxer2)
            }
        }

        store.darkMode = localStorageData.darkMode
        store.apiServerAddress = localStorageData.apiServerAddress

        console.debug("store loaded")
        console.debug(localStorageData)
    } else {
        console.debug("no store available ... ")
    }
    store.restored = true
}

watchEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute("data-bs-theme", store.darkMode ? "dark" : "light")
})

watchEffect(() => {
    if (!store.restored) {
        return
    }

    const localStorageData: DataStorage = {
        boxers: store.boxers.map((b): BoxerStorage => {
            return { attributes: toRaw(b.attributes), collapsed: b.collapsed }
        }),
        fightCard: store.fightCard.map((f) => {
            return { boxer1Id: f.boxer1.attributes.id, boxer2Id: f.boxer2.attributes.id } as FightStorage
        }),
        darkMode: store.darkMode,
        apiServerAddress: store.apiServerAddress,
    }
    localStorage.setItem("store", JSON.stringify(localStorageData))
    console.debug("store updated")
})
