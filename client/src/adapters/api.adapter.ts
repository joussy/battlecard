import { ApiBoxerCreate, ApiBoxerGet, ApiFightGet, ApiOpponentGet, ApiTournament } from "@/shared/types/api"
import { Gender } from "@/shared/types/modality.type"
import { Boxer, Fight, Opponent, Tournament } from "@/types/boxing.d"

export default class ApiAdapter {
    static toApiBoxerCreate(boxer: Boxer, tournamentId: string | undefined): ApiBoxerCreate {
        return {
            birthDate: boxer.birthDate?.toISOString(),
            club: boxer.club,
            firstName: boxer.firstName,
            lastName: boxer.lastName,
            license: boxer.license,
            gender: boxer.gender,
            nbFights: boxer.nbFights,
            weight: boxer.weight,
            tournamentId: tournamentId,
        }
    }

    static toOpponent(opponent: ApiOpponentGet): Opponent {
        return {
            ...ApiAdapter.toBoxer(opponent),
            weightDifference: opponent.weightDifference,
            isEligible: opponent.isEligible,
            fightId: opponent.fightId,
            modalityErrors: opponent.modalityErrors,
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

    static toFight(fight: ApiFightGet): Fight {
        return {
            boxer1Id: fight.boxer1Id,
            boxer2Id: fight.boxer2Id,
            id: fight.id,
            order: fight.order,
            modalityErrors: [],
            tournamentId: fight.tournamentId,
            roundDurationSeconds: fight.roundDurationAsSeconds,
            rounds: fight.rounds,
        }
    }

    static toApiFight(fight: Fight, roundDurationSeconds: number, rounds: number): ApiFightGet {
        return {
            id: fight.id,
            boxer1Id: fight.boxer1Id,
            boxer2Id: fight.boxer2Id,
            tournamentId: fight.tournamentId,
            order: fight.order,
            roundDurationAsSeconds: roundDurationSeconds,
            rounds,
        }
    }
}
