import { Gender } from "@/shared/types/modality.type"
import { Boxer } from "@/types/boxing"
import { format } from "date-fns"

export function getBoxerDisplayName(boxer: Boxer): string {
    return `${boxer.firstName} ${boxer.lastName}`
}

export function getClipboardText(boxer: Boxer): string {
    const text = `${boxer.firstName} ${boxer.lastName?.toUpperCase()}, ${boxer.categoryShortText}, ${format(boxer.birthDate, "dd/MM/yyyy")}, ${boxer.gender == Gender.MALE ? "Male" : "Female"}, Record: ${boxer.nbFights} fights, ${boxer.weight} kg`
    return text
}
