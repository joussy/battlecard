import { DbBoxer, DbFight } from "@/types/db"
import { Boxer, BoxerAttributes, Fight, Gender } from "@/types/boxing.d"

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
            attributes: {
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
            },
            opponents: [],
        }
    }

    static toFight(fight: DbFight, boxer1: Boxer, boxer2: Boxer): Fight {
        return {
            boxer1,
            boxer2,
            id: fight.id,
            order: fight.order,
            modalityErrors: [],
        }
    }

    static toDbFight(fight: Fight, userId: string): DbFight {
        return {
            id: fight.id,
            boxer1Id: fight.boxer1.attributes.id,
            boxer2Id: fight.boxer2.attributes.id,
            userId: userId,
            order: fight.order,
        }
    }
}
