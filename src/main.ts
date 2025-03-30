import { createApp } from "vue"
import { createRouter } from "vue-router"
import { createWebHashHistory } from "vue-router"
import App from "@/pages/app.vue"
import FightCardComponent from "@/components/fight-card.component.vue"
import UploadComponent from "@/components/options-panel.component.vue"
import BoxerSelectorComponent from "@/components/boxer-selector.component.vue"

import "./style.scss"
import "bootstrap-icons/font/bootstrap-icons.css"
import ClubStatisticsComponent from "@/components/club-statistics.component.vue"
import BoxerTileDetailsComponent from "@/components/selector/boxer-tile-details.component.vue"

const routes = [
    { path: "/", redirect: { name: "selector" } },
    { path: "/selector", name: "selector", component: BoxerSelectorComponent },
    { path: "/selector/tile/:id", name: "selector-tile", component: BoxerTileDetailsComponent },
    { path: "/settings", name: "settings", component: UploadComponent },
    { path: "/card", name: "card", component: FightCardComponent },
    { path: "/metrics", name: "metrics", component: ClubStatisticsComponent },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

createApp(App).use(router).mount("#app")
