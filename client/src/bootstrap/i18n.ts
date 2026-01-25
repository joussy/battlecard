import { createI18n } from "vue-i18n"
import enUS from "../locales/en-US.json"
import frFR from "../locales/fr-FR.json"

export function createI18nInstance() {
    /**
     * Creates and configures the vue-i18n instance for localization support.
     */
    type MessageSchema = typeof enUS
    return createI18n<[MessageSchema], "en" | "fr">({
        availableLocales: ["en-US", "fr-FR"],
        locale: "en", // Default, will be updated from store
        fallbackLocale: "en",
        legacy: false,
        messages: {
            fr: frFR,
            en: enUS,
        },
    })
}
