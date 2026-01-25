import { useTournamentStore } from "@/stores/tournament.store"
import { useUiStore } from "@/stores/ui.store"
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router"
/**
 * Sets up authentication navigation guard for the router.
 */
export function setupAuthRedirect(router: Router) {
    const uiStore = useUiStore()
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

/**
 * Sets up tournament selection navigation guard for the router.
 */
export function setupNoSelectedTournamentRedirect(router: Router) {
    const tournamentStore = useTournamentStore()
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
import { createRouter, Router, createWebHashHistory } from "vue-router"
import FightCardComponent from "@/components/fight-card/fight-card.component.vue"
import SharedFightCardComponent from "../components/fight-card/shared-fight-card.component.vue"
import SettingsComponent from "@/components/settings/settings.component.vue"
import BoxerSelectorComponent from "@/components/selector/boxer-selector.component.vue"
import BoxerTileDetailsComponent from "@/components/selector/boxer-details.component.vue"
import AuthComponent from "@/components/authentication/authentication.component.vue"
import ImportPage from "@/components/import/import.component.vue"
import TournamentsComponent from "@/components/tournament/tournaments.component.vue"

/**
 * Returns the application's route definitions for Vue Router.
 */
export function getRoutes() {
    return [
        { path: "/", redirect: { name: "auth" } },
        {
            path: "/tournaments",
            name: "tournaments",
            component: TournamentsComponent,
            meta: { requiresSelectedTournament: false },
        },
        {
            path: "/selector",
            name: "selector",
            component: BoxerSelectorComponent,
            meta: { requiresSelectedTournament: true },
        },
        {
            path: "/selector/tile/:id",
            name: "selector-tile",
            component: BoxerTileDetailsComponent,
            meta: { requiresSelectedTournament: true },
        },
        {
            path: "/settings",
            name: "settings",
            component: SettingsComponent,
            meta: { requiresSelectedTournament: false },
        },
        { path: "/card", name: "card", component: FightCardComponent, meta: { requiresSelectedTournament: true } },
        {
            path: "/auth",
            name: "auth",
            component: AuthComponent,
            meta: { hideMenu: true, requiresAuth: false, requiresSelectedTournament: false },
        },
        {
            path: "/shared-card/:roToken",
            name: "shared-card",
            component: SharedFightCardComponent,
            meta: { requiresAuth: false, hideMenu: true },
        },
        { path: "/import", name: "import", component: ImportPage },
    ]
}

/**
 * Creates and configures the Vue Router instance for the application.
 */
export function createAppRouter(): Router {
    return createRouter({
        history: createWebHashHistory(),
        scrollBehavior(to, from) {
            if (from.name == "selector-tile" && to.name == "selector-tile") {
                return { top: 0 }
            }
        },
        routes: getRoutes(),
    })
}
