import { DbBoxer, DbFight, DbTournament } from "@/types/db"
import { Boxer, BoxerAttributes, Fight, Gender, Tournament } from "@/types/boxing.d"

export default class DbConverter {
    static toDbBoxer(boxerAttributes: BoxerAttributes): DbBoxer {
        return {
            birthDate: boxerAttributes.birthDate?.toISOString(),
            club: boxerAttributes.club,
            firstName: boxerAttributes.firstName,
            lastName: boxerAttributes.lastName,
            license: boxerAttributes.license,
            gender: boxerAttributes.gender == Gender.FEMALE ? "female" : "male",
            nbFights: boxerAttributes.nbFights,
            weight: boxerAttributes.weight,
            id: boxerAttributes.id,
        }
    }

    static toBoxer(boxer: DbBoxer): Boxer {
        return {
            attributes: this.toBoxerAttributes(boxer),
            opponents: [],
        }
    }

    static toBoxerAttributes(boxer: DbBoxer): BoxerAttributes {
        return {
            birthDate: new Date(boxer.birthDate),
            club: boxer.club,
            firstName: boxer.firstName,
            lastName: boxer.lastName,
            gender: boxer.gender == "female" ? Gender.FEMALE : Gender.MALE,
            license: boxer.license,
            nbFights: boxer.nbFights ?? 0,
            weight: boxer.weight ?? 0,
            category: "fakeCat",
            categoryShortText: "fakeShortCat",
            id: boxer.id,
        }
    }

    static toTournament(tournament: DbTournament): Tournament {
        return {
            id: tournament.id,
            name: tournament.name,
            userId: tournament.userId,
        }
    }

    static toDbTournament(tournament: Tournament): DbTournament {
        return {
            id: tournament.id,
            name: tournament.name,
            userId: tournament.userId,
        }
    }

    static toFight(fight: DbFight, boxer1: Boxer, boxer2: Boxer): Fight {
        return {
            boxer1,
            boxer2,
            id: fight.id,
            order: fight.order,
            modalityErrors: [],
            tournamentId: fight.tournamentId,
        }
    }

    static toDbFight(fight: Fight): DbFight {
        return {
            id: fight.id,
            boxer1Id: fight.boxer1.attributes.id,
            boxer2Id: fight.boxer2.attributes.id,
            tournamentId: fight.tournamentId,
            order: fight.order,
        }
    }
}
