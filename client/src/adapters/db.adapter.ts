import { DbBoxer, DbFight, DbTournament } from "@/shared/types/db"
import { Boxer, Fight, Gender, Tournament } from "@/types/boxing.d"

export default class DbAdapter {
    static toDbBoxer(boxer: Boxer): DbBoxer {
        return {
            birthDate: boxer.birthDate?.toISOString(),
            club: boxer.club,
            firstName: boxer.firstName,
            lastName: boxer.lastName,
            license: boxer.license,
            gender: boxer.gender == Gender.FEMALE ? "female" : "male",
            nbFights: boxer.nbFights,
            weight: boxer.weight,
            id: boxer.id,
            userId: boxer.userId,
        }
    }

    static toBoxer(boxer: DbBoxer): Boxer {
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
            userId: boxer.userId,
        }
    }

    static toTournament(tournament: DbTournament): Tournament {
        return {
            id: tournament.id,
            name: tournament.name,
            userId: tournament.userId,
            date: tournament.date,
        }
    }

    static toDbTournament(tournament: Tournament): DbTournament {
        return {
            id: tournament.id,
            name: tournament.name,
            userId: tournament.userId,
            date: tournament.date,
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
            boxer1Id: fight.boxer1.id,
            boxer2Id: fight.boxer2.id,
            tournamentId: fight.tournamentId,
            order: fight.order,
        }
    }
}
