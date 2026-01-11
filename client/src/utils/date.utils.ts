import { useI18n } from "vue-i18n"
import { fr } from "date-fns/locale/fr"
import { enUS } from "date-fns/locale/en-US"
import { Locale as DateFnsLocale } from "date-fns"

/**
 * Returns the date-fns locale object matching the current vue-i18n locale.
 * Defaults to enUS if not matched.
 */
export function getDateFnsLocale(): DateFnsLocale {
    // Use inside setup() or a component
    const { locale } = useI18n()
    const lang = typeof locale === "string" ? (locale as string).split("-")[0] : locale.value.split("-")[0]
    if (lang === "fr") return fr
    return enUS
}
