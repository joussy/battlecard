import { createApp } from "vue"
import { createRouter, Router } from "vue-router"
import { createWebHashHistory } from "vue-router"
import App from "./app.vue"
import FightCardComponent from "@/components/fight-card/fight-card.component.vue"
import SettingsComponent from "@/components/settings/settings.component.vue"
import BoxerSelectorComponent from "@/components/selector/boxer-selector.component.vue"
import AuthComponent from "@/components/authentication/authentication.component.vue"
import ImportPage from "@/components/import/import.component.vue"
import setupAuthRedirect from "@/router/auth-redirect"

import "./style.scss"
import "bootstrap-icons/font/bootstrap-icons.css"
import BoxerTileDetailsComponent from "@/components/selector/boxer-details.component.vue"
import TournamentsComponent from "@/components/tournament/tournaments.component.vue"
import { createPinia } from "pinia"
import SharedFightCardComponent from "./components/fight-card/shared-fight-card.component.vue"

declare module "pinia" {
    export interface PiniaCustomProperties {
        router: Router
    }
}

const routes = [
    { path: "/", redirect: { name: "auth" } },
    { path: "/tournaments", name: "tournaments", component: TournamentsComponent },
    { path: "/selector", name: "selector", component: BoxerSelectorComponent },
    { path: "/selector/tile/:id", name: "selector-tile", component: BoxerTileDetailsComponent },
    { path: "/settings", name: "settings", component: SettingsComponent },
    { path: "/card", name: "card", component: FightCardComponent },
    { path: "/auth", name: "auth", component: AuthComponent, meta: { hideMenu: true, requiresAuth: false } },
    {
        path: "/shared-card/:roToken",
        name: "shared-card",
        component: SharedFightCardComponent,
        meta: { requiresAuth: false, hideMenu: true },
    },
    { path: "/import", name: "import", component: ImportPage },
]

const router = createRouter({
    history: createWebHashHistory(),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scrollBehavior(to, from, savedPosition) {
        if (from.name == "selector-tile" && to.name == "selector-tile") {
            return { top: 0 }
        }
    },
    routes,
})

const pinia = createPinia()
pinia.use(() => ({ router }))
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount("#app")
setupAuthRedirect(router)
