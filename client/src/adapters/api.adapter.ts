import { Fight } from "@/types/boxing.d"
import { IModality } from "@/fightModality/IModality"
import { getFightDurationAsString } from "@/utils/string.utils"
import { FightExtraInfo } from "@/types/api"

export default class ApiAdapters {
    static toFightCardExtraInfo(fight: Fight, modality: IModality): FightExtraInfo {
        const fightDuration = modality.getFightDuration(fight.boxer1.attributes, fight.boxer2.attributes)
        return {
            fightId: fight.id,
            duration: getFightDurationAsString(fightDuration.rounds, fightDuration.roundDurationAsSeconds),
            boxer1Category: fight.boxer1.attributes.category,
            boxer2Category: fight.boxer2.attributes.category,
        }
    }
}
