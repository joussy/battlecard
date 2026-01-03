import { Gender } from "@/api"
import { Boxer, Fight } from "@/types/boxing"
import { format } from "date-fns"
import { useI18n } from "vue-i18n"

export function useLabels() {
    const { t } = useI18n({ useScope: "global" })

    function getBoxerDisplayName(boxer: Boxer): string {
        return `${boxer.firstName} ${boxer.lastName}`
    }

    function getBoxerClipboardText(boxer: Boxer): string {
        const genderLabel = boxer.gender == Gender.MALE ? t("clipboard.male") : t("clipboard.female")
        return `${boxer.firstName} ${boxer.lastName?.toUpperCase()}, ${boxer.categoryShortText}, ${format(boxer.birthDate, "dd/MM/yyyy")}, ${genderLabel}, ${t("clipboard.record")}: ${boxer.nbFights} ${t("clipboard.fights")}, ${boxer.weight} kg`
    }

    function getFightClipboardText(fight: Fight): string {
        const boxer1Text = getBoxerClipboardText(fight.boxer1)
        const boxer2Text = getBoxerClipboardText(fight.boxer2)
        const fightDetails = `${t("clipboard.duration")}: ${fight.rounds}x${fight.roundDurationSeconds}s`
        return `${t("clipboard.redCorner")}: ${boxer1Text}\n${t("clipboard.blueCorner")}: ${boxer2Text}\n${fightDetails}`
    }

    return {
        getBoxerDisplayName,
        getBoxerClipboardText,
        getFightClipboardText,
    }
}
