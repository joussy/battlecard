import { reactive, readonly } from "vue"
import { Boxer, Fight, Tournament, Opponent, BoxerAttributes } from "@/types/boxing.d"
import { BeaModality } from "@/fightModality/BeaModality"
import dbManager from "@/managers/db.manager"
import DbConverter from "@/converters/db.converter"
import { ModalityError } from "@/types/modality"
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
    async addOrUpdateBoxer(boxer: Boxer) {
        try {
            const isNew = boxer.attributes.id === ""

            const dbBoxer = DbConverter.toDbBoxer(boxer.attributes)
            const result = isNew ? await dbManager.addBoxer(dbBoxer) : await dbManager.updateBoxer(dbBoxer)

            const updatedBoxer = DbConverter.toBoxer(result)

            //If the boxer already exist, we remove it from the store
            if (!isNew) {
                fightCardStore.boxers = fightCardStore.boxers.filter(
                    (b) => b.attributes.id !== updatedBoxer.attributes.id
                )
            }

            fightCardStore.boxers.push(updatedBoxer)

            if (isNew && this.store.currentTournament) {
                await dbManager.addBoxerToTournament(updatedBoxer.attributes.id, this.store.currentTournament.id)
            }

            return updatedBoxer
        } catch {
            return null
        }
    },
    async addBoxerToTournament(boxerId: string) {
        if (!this.store.currentTournament) {
            return
        }
        await dbManager.addBoxerToTournament(boxerId, this.store.currentTournament.id)
        const res = await dbManager.getBoxer(boxerId)
        const boxer = DbConverter.toBoxer(res)

        fightCardStore.boxers.push(boxer)
    },
    async addTournament(tournament: Tournament): Promise<Tournament> {
        const res = await dbManager.addTournament(DbConverter.toDbTournament(tournament))
        tournament = DbConverter.toTournament(res)
        fightCardStore.tournaments.push(tournament)
        return tournament
    },
    async removeBoxersFromTournament() {
        if (fightCardStore.currentTournament) {
            await dbManager.deleteFights(fightCardStore.fightCard.map((b) => b.id))
            await dbManager.deleteBoxersFromTournament(
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
            id: "",
            order: order + 1,
            tournamentId: fightCardStore.currentTournament.id,
        }
        if (fightCardStore.currentTournament?.id != null) {
            const ret = await dbManager.addFight(DbConverter.toDbFight(fight))
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
        await dbManager.deleteFights([id])
        const index = fightCardStore.fightCard.findIndex((f) => f.id == id)
        if (index > -1) fightCardStore.fightCard.splice(index, 1)
        await this.updateFightsOrder()
    },
    async updateFightsOrder() {
        const fights = fightCardStore.fightCard
        if (fights.length == 0) {
            return
        }
        fights.forEach((fight, index) => {
            fight.order = index + 1 // +1 because we want an order starting 1, not 0
        })
        await dbManager.reorderFights(
            fights.map((f) => f.id),
            fightCardStore.currentTournament!.id
        )
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
            await dbManager.updateFight(DbConverter.toDbFight(fight))
        }
    },
    setModalityErrors(fightId: string, modalityErrors: ModalityError[]) {
        const fight = this.getFightById(fightId)
        if (fight) {
            fight.modalityErrors = modalityErrors
        }
    },
    async loadFightStore() {
        const tournaments = await dbManager.getTournaments()
        fightCardStore.tournaments = tournaments.map((t) => DbConverter.toTournament(t))
        if (fightCardStore.currentTournament) {
            await this.loadTournamentFromDb(fightCardStore.currentTournament.id)
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

    async loadTournamentFromDb(tournamentId: string | null) {
        if (!tournamentId) {
            //TODO: Handle that no tournament can be selected
            return
        }

        const boxers = await dbManager.getTournamentBoxers(tournamentId)
        const fights = await dbManager.getFights(tournamentId)
        fightCardStore.boxers = boxers.map((b) => DbConverter.toBoxer(b))
        fightCardStore.fightCard = fights
            .map((f) => {
                const boxer1 = this.getBoxerById(f.boxer1Id)
                const boxer2 = this.getBoxerById(f.boxer2Id)
                if (boxer1 && boxer2) return DbConverter.toFight(f, boxer1, boxer2)
            })
            .filter((f) => f != null)
    },

    setCurrentTournament(tournamentId: string | null) {
        const tournament = fightCardStore.tournaments.find((t) => t.id == tournamentId)
        if (fightCardStore.currentTournament?.id == tournamentId) {
            return
        }

        fightCardStore.currentTournament = tournament || null
    },
    deleteTournament(tournamentId: string) {
        dbManager.deleteTournament(tournamentId)
        fightCardStore.tournaments = fightCardStore.tournaments.filter((t) => t.id != tournamentId)
        if (fightCardStore.currentTournament?.id == tournamentId) {
            fightCardStore.currentTournament = null
        }
    },
    async getAllBoxersAttributes(): Promise<Readonly<BoxerAttributes[]>> {
        const boxers = await dbManager.getBoxers()
        return boxers.map((b) => DbConverter.toBoxerAttributes(b))
    },
}
