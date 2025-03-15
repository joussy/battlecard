import { BoxerAttributes } from "@/types/boxing.d"
import { BoxerExtraInfo as BoxerCardExtraInfo } from "@/types/api"

export default class ApiConverter {
    static toBoxerCardExtraInfo(boxerAttributes: BoxerAttributes): BoxerCardExtraInfo {
        return {
            boxerId: boxerAttributes.id,
            category: boxerAttributes.category,
        }
    }
}
