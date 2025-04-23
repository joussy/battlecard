import { reactive, readonly, toRaw, watchEffect } from "vue"
import { Boxer, Fight, Tournament, Opponent } from "@/types/boxing.d"
import { FightCardStorage, BoxerStorage, FightStorage } from "@/types/localstorage.d"
import { BeaModality } from "@/fightModality/BeaModality"
import pocketBaseManager from "@/managers/pocketbase.manager"
import DbConverter from "@/converters/db.converter"
import { userStore } from "./user.composable"
import { ModalityError } from "@/types/modality"
import { generateRandomId } from "@/utils/string.utils"
import { IModality } from "@/fightModality/IModality"

const fightCardStore = reactive({
    restored: false as boolean,
    fightCard: [] as Fight[],
    boxers: [] as Boxer[],
    modality: new BeaModality() as IModality,
    tournaments: [] as Tournament[],
    currentTournament: null as Tournament | null,
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
            if (this.store.currentTournament) {
                await pocketBaseManager.addBoxerToTournament(boxer.attributes.id, this.store.currentTournament.id)
            }
        }
        fightCardStore.boxers.push(boxer)
        return boxer
    },
    async addTournament(tournament: Tournament) {
        if (userStore.account?.id) {
            const res = await pocketBaseManager.addTournament(DbConverter.toDbTournament(tournament))
            tournament = DbConverter.toTournament(res)
        }
        fightCardStore.tournaments.push(tournament)
    },
    async removeBoxersFromTournament() {
        if (userStore.account?.id && fightCardStore.currentTournament) {
            await pocketBaseManager.deleteFights(fightCardStore.fightCard.map((b) => b.id))
            await pocketBaseManager.deleteBoxersFromTournament(
                fightCardStore.boxers.map((b) => b.attributes.id),
                fightCardStore.currentTournament.id
            )
        }
        fightCardStore.boxers = []
        fightCardStore.fightCard = []
    },
    async addFight(boxer1: Boxer, boxer2: Boxer, order: number): Promise<Readonly<Fight>> {
        if (fightCardStore.currentTournament == null) {
            throw "CurrentTournament is null"
        }

        let fight: Fight = {
            boxer1: boxer1,
            boxer2: boxer2,
            modalityErrors: [],
            id: generateRandomId(),
            order: order + 1,
            tournamentId: fightCardStore.currentTournament.id,
        }
        if (fightCardStore.currentTournament?.id != null) {
            const ret = await pocketBaseManager.addFight(
                DbConverter.toDbFight(fight, fightCardStore.currentTournament.id)
            )
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
        await this.updateFightsOrder()
    },
    async updateFightsOrder() {
        const fights = fightCardStore.fightCard
        fights.forEach((fight, index) => {
            fight.order = index + 1 // +1 because we want an order starting 1, not 0
        })
        if (userStore?.account?.id != null) {
            await pocketBaseManager.updateFights(fights.map((f) => DbConverter.toDbFight(f, userStore.account!.id)))
        }
    },
    async updateFightOrder(fightId: string, newIndex: number) {
        if (newIndex < 0) {
            return
        }

        const fights = fightCardStore.fightCard
        // Find the fight by its ID
        const fightIndex = fights.findIndex((fight) => fight.id === fightId)

        if (fightIndex === -1) {
            console.error("Fight not found")
            return
        }

        // Get the fight to move
        const fightToMove = fights[fightIndex]

        if (fightIndex == newIndex) {
            return
        }

        // Remove the fight from its current position
        fights.splice(fightIndex, 1)

        // Insert the fight at the new position based on the order
        fights.splice(newIndex, 0, fightToMove)

        await this.updateFightsOrder()
    },
    async switchFight(fightId: string) {
        const fight = this.getFightById(fightId)
        if (fight) {
            const boxer1 = fight.boxer1
            const boxer2 = fight.boxer2
            fight.boxer1 = boxer2
            fight.boxer2 = boxer1
            if (userStore?.account?.id != null) {
                await pocketBaseManager.updateFights([DbConverter.toDbFight(fight, userStore.account.id)])
            }
        }
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
        const tournaments = await pocketBaseManager.getTournaments()
        fightCardStore.tournaments = tournaments.map((t) => DbConverter.toTournament(t))
        if (fightCardStore.currentTournament) {
            await this.loadTournamentFromDb(fightCardStore.currentTournament.id)
        }
    },

    async loadTournamentFromDb(tournamentId: string | null) {
        if (!tournamentId) {
            //TODO: Handle that no tournament can be selected
            return
        }

        const boxers = await pocketBaseManager.getBoxersForTournament(tournamentId)
        const fights = await pocketBaseManager.getFights(tournamentId)
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

        for (const fight of localStorageData.fightCard.sort((a, b) => a.order - b.order)) {
            const boxer1 = boxerMap.get(fight.boxer1Id)
            const boxer2 = boxerMap.get(fight.boxer2Id)
            if (boxer1 && boxer2) {
                this.addFight(boxer1, boxer2, fight.order)
            }
        }

        console.debug("store loaded")
    },

    setCurrentTournament(tournamentId: string | null) {
        const tournament = fightCardStore.tournaments.find((t) => t.id == tournamentId)
        if (fightCardStore.currentTournament?.id == tournamentId) {
            return
        }

        fightCardStore.currentTournament = tournament || null
    },
    deleteTournament(tournamentId: string) {
        if (userStore.account == null) {
            return
        }
        pocketBaseManager.deleteTournament(tournamentId)
        fightCardStore.tournaments = fightCardStore.tournaments.filter((t) => t.id != tournamentId)
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
            return {
                boxer1Id: f.boxer1.attributes.id,
                boxer2Id: f.boxer2.attributes.id,
                order: f.order,
            } as FightStorage
        }),
    }
    localStorage.setItem("fightCardStore", JSON.stringify(localStorageData))
})
