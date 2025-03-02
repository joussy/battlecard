import { reactive, readonly, toRaw, watchEffect } from "vue"
import { Boxer, Fight, Opponent } from "@/types/boxing.d"
import { FightCardStorage, BoxerStorage, FightStorage } from "@/types/localstorage.d"
import { BeaModality } from "@/fightModality/BeaModality"
import pocketBaseManager from "@/managers/pocketbase.manager"
import DbConverter from "@/converters/db.converter"
import { userStore } from "./user.composable"
import { ModalityError } from "@/types/modality"
import { generateRandomId } from "@/utils/string.utils"

const fightCardStore = reactive({
    restored: false as boolean,
    fightCard: [] as Fight[],
    boxers: [] as Boxer[],
    modality: new BeaModality(),
})

export default {
    store: readonly(fightCardStore),
    getBoxerById(id: string) {
        return fightCardStore.boxers.find((x) => x.attributes.id == id)
    },
    getFightById(id: string) {
        return fightCardStore.fightCard.find((x) => x.id == id)
    },
    async addBoxer(boxer: Boxer) {
        if (userStore.account?.id) {
            const res = await pocketBaseManager.addBoxer(DbConverter.toDbBoxer(boxer.attributes))
            boxer = DbConverter.toBoxer(res)
        }
        fightCardStore.boxers.push(boxer)
        return boxer
    },
    async clear() {
        if (userStore.account?.id) {
            await pocketBaseManager.deleteFights(fightCardStore.fightCard.map((b) => b.id))
            await pocketBaseManager.deleteBoxers(fightCardStore.boxers.map((b) => b.attributes.id))
        }
        fightCardStore.boxers = []
        fightCardStore.fightCard = []
    },
    async addFight(boxer1: Boxer, boxer2: Boxer): Promise<Readonly<Fight>> {
        let fight: Fight = {
            boxer1: boxer1,
            boxer2: boxer2,
            modalityErrors: [],
            id: generateRandomId(),
        }
        if (userStore.account?.id != null) {
            const ret = await pocketBaseManager.addFight(DbConverter.toDbFight(fight, userStore.account?.id))
            fight = DbConverter.toFight(ret, boxer1, boxer2)
        }

        fightCardStore.fightCard.push(fight)

        return readonly(fight)
    },
    setBoxerOpponents(boxerId: string, opponents: Opponent[]) {
        const boxer = this.getBoxerById(boxerId)
        if (boxer) {
            boxer.opponents = opponents
        }
    },
    async removeFightById(id: string) {
        if (userStore.account?.id) {
            await pocketBaseManager.deleteFights([id])
        }
        const index = fightCardStore.fightCard.findIndex((f) => f.id == id)
        if (index > -1) fightCardStore.fightCard.splice(index, 1)
    },
    setModalityErrors(fightId: string, modalityErrors: ModalityError[]) {
        const fight = this.getFightById(fightId)
        if (fight) {
            fight.modalityErrors = modalityErrors
        }
    },
    async loadFightStore() {
        if (userStore.account?.id != null) {
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
    },
    setBoxerCategory(boxerId: string, category: string, categoryShort: string) {
        const boxer = this.getBoxerById(boxerId)
        if (boxer) {
            boxer.attributes.category = category
            boxer.attributes.categoryShortText = categoryShort
        }
    },

    async loadFromDb() {
        const boxers = await pocketBaseManager.getBoxers()
        const fights = await pocketBaseManager.getFights()
        fightCardStore.boxers = boxers.map((b) => DbConverter.toBoxer(b))
        fightCardStore.fightCard = fights
            .map((f) => {
                const boxer1 = this.getBoxerById(f.boxer1Id)
                const boxer2 = this.getBoxerById(f.boxer2Id)
                if (boxer1 && boxer2) return DbConverter.toFight(f, boxer1, boxer2)
            })
            .filter((f) => f != null)
    },

    loadFromLocalStorage(localStorageDataString: string) {
        const localStorageData: FightCardStorage = JSON.parse(localStorageDataString)

        fightCardStore.boxers = localStorageData.boxers.map((b) => {
            return {
                attributes: {
                    ...b.attributes,
                    birthDate: new Date(b.attributes.birthDate),
                },
            } as Boxer
        })

        const boxerMap = new Map(fightCardStore.boxers.map((boxer) => [boxer.attributes.id, boxer]))

        for (const fight of localStorageData.fightCard) {
            const boxer1 = boxerMap.get(fight.boxer1Id)
            const boxer2 = boxerMap.get(fight.boxer2Id)
            if (boxer1 && boxer2) {
                this.addFight(boxer1, boxer2)
            }
        }

        console.debug("store loaded")
    },
}

watchEffect(() => {
    if (!fightCardStore.restored || userStore.account?.id != null) {
        return
    }

    const localStorageData: FightCardStorage = {
        boxers: fightCardStore.boxers.map((b): BoxerStorage => {
            return { attributes: toRaw(b.attributes) }
        }),
        fightCard: fightCardStore.fightCard.map((f) => {
            return { boxer1Id: f.boxer1.attributes.id, boxer2Id: f.boxer2.attributes.id } as FightStorage
        }),
    }
    localStorage.setItem("fightCardStore", JSON.stringify(localStorageData))
})
