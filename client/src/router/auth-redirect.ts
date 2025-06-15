import { useUiStore } from "@/stores/ui.store"
import type { Router, RouteLocationNormalized, NavigationGuardNext } from "vue-router"

export default function setupAuthRedirect(router: Router) {
    const uiStore = useUiStore()
    // Also check on each route
    router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        if (!uiStore.jwtToken && to.name !== "settings") {
            next({ name: "settings" })
        } else {
            next()
        }
    })
}
