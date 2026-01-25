import { useTournamentStore } from "@/stores/tournament.store"
import { useUiStore } from "@/stores/ui.store"
import type { Router, RouteLocationNormalized, NavigationGuardNext } from "vue-router"

export function setupAuthRedirect(router: Router) {
    const uiStore = useUiStore()
    // Also check on each route
    router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const requiresAuth = to.meta?.requiresAuth !== false
        if (!uiStore.isAuthenticated && requiresAuth) {
            next({ name: "auth" })
        } else if (uiStore.isAuthenticated && to.name === "auth") {
            next({ name: "tournaments" })
        } else {
            next()
        }
    })
}

export function setupNoSelectedTournamentRedirect(router: Router) {
    const tournamentStore = useTournamentStore()
    // Also check on each route
    router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const requiresSelectedTournament = to.meta?.requiresSelectedTournament === true
        const selectedTounament = tournamentStore.currentTournamentId
        if (requiresSelectedTournament && !selectedTounament) {
            console.debug("No tournament selected, redirecting to tournaments")
            next({ name: "tournaments" })
        } else {
            next()
        }
    })
}
