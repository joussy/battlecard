import { createApp } from "vue"
import { createRouter } from "vue-router"
import { createWebHashHistory } from "vue-router"
import App from "@/pages/app.vue"
import FightCardComponent from "@/components/fight-card.component.vue"
import UploadComponent from "@/components/options-panel.component.vue"
import BoxerSelectorComponent from "@/components/boxer-selector.component.vue"
import ImportPage from "@/components/import/import.component.vue"
import setupAuthRedirect from "@/router/auth-redirect"

import "./style.scss"
import "bootstrap-icons/font/bootstrap-icons.css"
import BoxerTileDetailsComponent from "@/components/selector/boxer-details.component.vue"
import TournamentsComponent from "@/components/tournaments.component.vue"
import { createPinia } from "pinia"
import SharedFightCardComponent from "./components/shared-fight-card.component.vue"

const routes = [
    { path: "/", redirect: { name: "settings" } },
    { path: "/tournaments", name: "tournaments", component: TournamentsComponent },
    { path: "/selector", name: "selector", component: BoxerSelectorComponent },
    { path: "/selector/tile/:id", name: "selector-tile", component: BoxerTileDetailsComponent },
    { path: "/settings", name: "settings", component: UploadComponent },
    { path: "/card", name: "card", component: FightCardComponent },
    { path: "/shared-card/:roToken", name: "shared-card", component: SharedFightCardComponent },
    { path: "/import", name: "import", component: ImportPage },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount("#app")
setupAuthRedirect(router)
