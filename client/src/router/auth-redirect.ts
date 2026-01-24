import { useUiStore } from "@/stores/ui.store"
import type { Router, RouteLocationNormalized, NavigationGuardNext } from "vue-router"

export default function setupAuthRedirect(router: Router) {
    const uiStore = useUiStore()
    // Also check on each route
    router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        await uiStore.loadUiStore()
        const requiresAuth = to.meta?.requiresAuth !== false
        console.log("Auth Redirect Check:", { to: to.name, requiresAuth, isAuthenticated: uiStore.isAuthenticated })
        if (!uiStore.isAuthenticated && requiresAuth) {
            next({ name: "auth" })
        } else if (uiStore.isAuthenticated && to.name === "auth") {
            next({ name: "tournaments" })
        } else {
            next()
        }
    })
}
