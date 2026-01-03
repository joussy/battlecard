import { Gender } from "@/api"
import { Boxer, Fight } from "@/types/boxing"
import { format } from "date-fns"

export function getBoxerDisplayName(boxer: Boxer): string {
    return `${boxer.firstName} ${boxer.lastName}`
}

export function getBoxerClipboardText(boxer: Boxer): string {
    const text = `${boxer.firstName} ${boxer.lastName?.toUpperCase()}, ${boxer.categoryShortText}, ${format(boxer.birthDate, "dd/MM/yyyy")}, ${boxer.gender == Gender.MALE ? "Male" : "Female"}, Record: ${boxer.nbFights} fights, ${boxer.weight} kg`
    return text
}

export function getFightClipboardText(fight: Fight): string {
    const boxer1Text = getBoxerClipboardText(fight.boxer1)
    const boxer2Text = getBoxerClipboardText(fight.boxer2)
    const fightDetails = `Duration: ${fight.rounds}x${fight.roundDurationSeconds}s`
    return `Red Corner: ${boxer1Text}\nBlue Corner: ${boxer2Text}\n${fightDetails}`
}
