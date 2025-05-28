import { ApiBoxerCreate, ApiBoxerGet, ApiFight, ApiOpponentGet, ApiTournament } from "@/shared/types/api"
import { Boxer, Fight, Gender, Opponent, Tournament } from "@/types/boxing.d"
import { IModality } from "@/fightModality/IModality"
import { getFightDurationAsString } from "@/utils/string.utils"
import { FightExtraInfo } from "@/types/api"

export default class ApiAdapter {
    static toFightCardExtraInfo(fight: Fight, modality: IModality): FightExtraInfo {
        const fightDuration = modality.getFightDuration(fight.boxer1, fight.boxer2)
        return {
            fightId: fight.id,
            duration: getFightDurationAsString(fightDuration.rounds, fightDuration.roundDurationAsSeconds),
            boxer1Category: fight.boxer1.category,
            boxer2Category: fight.boxer2.category,
        }
    }
    static toApiBoxer(boxer: Boxer): ApiBoxerGet {
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
            category: "fakeCat",
            categoryShortText: "fakeShortCat",
            id: boxer.id,
            userId: boxer.userId,
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

    static toFight(fight: ApiFight, boxer1: Boxer, boxer2: Boxer): Fight {
        return {
            boxer1,
            boxer2,
            id: fight.id,
            order: fight.order,
            modalityErrors: [],
            tournamentId: fight.tournamentId,
        }
    }

    static toApiFight(fight: Fight): ApiFight {
        return {
            id: fight.id,
            boxer1Id: fight.boxer1.id,
            boxer2Id: fight.boxer2.id,
            tournamentId: fight.tournamentId,
            order: fight.order,
        }
    }
}
