import { createApp } from "vue"
import { createRouter } from "vue-router"
import { createMemoryHistory } from "vue-router"
import "./style.scss"
import App from "@/pages/app.vue"
import FightCardComponent from "@/components/fight-card.component.vue"
import UploadComponent from "@/components/options-panel.component.vue"
import BoxerSelectorComponent from "@/components/boxer-selector.component.vue"

import "bootstrap-icons/font/bootstrap-icons.css"
import { createWebHistory } from "vue-router"

const routes = [
    { path: "/", redirect: { name: "selector" } },
    { path: "/selector", name: "selector", component: BoxerSelectorComponent },
    { path: "/settings", name: "settings", component: UploadComponent },
    { path: "/card", name: "card", component: FightCardComponent },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).mount("#app")
