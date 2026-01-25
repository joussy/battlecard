import { createApp } from "vue"
import App from "./app.vue"
import "./style.scss"
import "bootstrap-icons/font/bootstrap-icons.css"
import { useUiStore } from "./stores/ui.store"
import { createAppRouter } from "./bootstrap/router"
import { setupApiClient } from "./bootstrap/api-client"
import { createPiniaWithRouter } from "./bootstrap/pinia"
import { createI18nInstance } from "./bootstrap/i18n"
import { setupAuthRedirect, setupNoSelectedTournamentRedirect } from "./bootstrap/redirect"

async function bootstrap() {
    // Create the Vue Router instance with all routes and scroll behavior
    const router = createAppRouter()
    // Set up API client interceptors and config, including session and locale handling
    setupApiClient(router)
    // Create Pinia store and inject router for use in stores
    const pinia = createPiniaWithRouter(router)
    // Create the i18n instance for localization
    const i18n = createI18nInstance()
    // Create the Vue app root instance
    const app = createApp(App)
    // Register Pinia (state management)
    app.use(pinia)
    // Register i18n (internationalization)
    app.use(i18n)
    // Register router (routing)
    app.use(router)
    // Load UI store before mounting to ensure navigation guards have access to state
    await useUiStore().loadUiStore()
    // Mount the app to the DOM
    app.mount("#app")
    // Set up navigation guards for authentication and tournament selection
    setupAuthRedirect(router)
    setupNoSelectedTournamentRedirect(router)
}

bootstrap()
