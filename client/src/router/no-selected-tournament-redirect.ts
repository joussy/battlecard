import { useTournamentStore } from "@/stores/tournament.store"
import type { Router, RouteLocationNormalized, NavigationGuardNext } from "vue-router"

export default function setupNoSelectedTournamentRedirect(router: Router) {
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
