import { ApiBoxerCreate, ApiBoxerGet, ApiFight, ApiOpponentGet, ApiTournament } from "@/shared/types/api"
import { Boxer, Fight, Gender, Opponent, Tournament } from "@/types/boxing.d"

export default class ApiAdapter {
    static toApiBoxerCreate(boxer: Boxer, tournamentId: string | undefined): ApiBoxerCreate {
        return {
            birthDate: boxer.birthDate?.toISOString(),
            club: boxer.club,
            firstName: boxer.firstName,
            lastName: boxer.lastName,
            license: boxer.license,
            gender: boxer.gender == Gender.FEMALE ? "female" : "male",
            nbFights: boxer.nbFights,
            weight: boxer.weight,
            tournamentId: tournamentId,
        }
    }

    static toOpponent(opponent: ApiOpponentGet): Opponent {
        return {
            ...ApiAdapter.toBoxer(opponent),
            // modalityErrors: opponent.modalityErrors,
            modalityErrors: [],
            weightDifference: opponent.weightDifference,
            isEligible: opponent.isEligible,
            fightId: opponent.fightId,
        }
    }

    static toBoxer(boxer: ApiBoxerGet): Boxer {
        return {
            birthDate: new Date(boxer.birthDate),
            club: boxer.club,
            firstName: boxer.firstName,
            lastName: boxer.lastName,
            gender: boxer.gender == "female" ? Gender.FEMALE : Gender.MALE,
            license: boxer.license,
            nbFights: boxer.nbFights ?? 0,
            weight: boxer.weight ?? 0,
            categoryShortText: boxer.categoryShort,
            id: boxer.id,
            userId: boxer.userId,
            categoryShort: boxer.categoryShort,
            category: boxer.category,
            eligibleFights: boxer.eligibleFights,
            selectedFights: boxer.selectedFights,
        }
    }

    static toTournament(tournament: ApiTournament): Tournament {
        return {
            id: tournament.id,
            name: tournament.name,
            userId: tournament.userId,
            date: tournament.date,
        }
    }

    static toApiTournament(tournament: Tournament): ApiTournament {
        return {
            id: tournament.id,
            name: tournament.name,
            userId: tournament.userId,
            date: tournament.date,
        }
    }

    static toFight(fight: ApiFight): Fight {
        return {
            boxer1Id: fight.boxer1Id,
            boxer2Id: fight.boxer2Id,
            id: fight.id,
            order: fight.order,
            modalityErrors: [],
            tournamentId: fight.tournamentId,
        }
    }

    static toApiFight(fight: Fight): ApiFight {
        return {
            id: fight.id,
            boxer1Id: fight.boxer1Id,
            boxer2Id: fight.boxer2Id,
            tournamentId: fight.tournamentId,
            order: fight.order,
        }
    }
}
