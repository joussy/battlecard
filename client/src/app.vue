<template>
    <MenuTopComponent v-if="!$route.meta.hideMenu"></MenuTopComponent>
    <MenuBottomComponent v-if="!$route.meta.hideMenu"></MenuBottomComponent>
    <div class="main-container container">
        <RouterView />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, watch } from "vue"
import { useRouter } from "vue-router"
import MenuTopComponent from "@/components/shared/layout/menu-top.component.vue"
import MenuBottomComponent from "@/components/shared/layout/menu-bottom.component.vue"
import { useUiStore } from "@/stores/ui.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useFightStore } from "@/stores/fight.store"
import { useI18n } from "vue-i18n"

const router = useRouter()
const useI18nInstance = useI18n()
const uiStore = useUiStore()

onMounted(() => {
    const tournamentStore = useTournamentStore()
    const fightStore = useFightStore()

    // Sync language between i18n and uiStore, since I18n cannot be used in the store
    watch(
        () => uiStore.language,
        (newLanguage) => {
            useI18nInstance.locale.value = newLanguage
        },
        { immediate: true }
    )

    // Handle authentication state changes
    watch(
        () => uiStore.isAuthenticated,
        () => {
            // Redirect to tournaments if authenticated and on auth page
            if (router.currentRoute.value.name === "auth" && uiStore.isAuthenticated) {
                router.push("tournaments")
            } else if (router.currentRoute.value.name !== "auth" && !uiStore.isAuthenticated) {
                router.push("auth")
            }
            //UI needs tournaments loaded in several pages
            if (uiStore.isAuthenticated) {
                tournamentStore.fetchTournaments()
            }
        },
        { immediate: true }
    )

    // Start periodic authentication check to redirect if session expires
    uiStore.startAuthCheck()

    watch(
        () => tournamentStore.currentTournamentId,
        async () => {
            if (uiStore.isAuthenticated) {
                if (!tournamentStore.currentTournamentId) {
                    router.push("tournaments")
                } else {
                    await fightStore.fetchFights()
                }
            }
        },
        { immediate: true }
    )
})
onUnmounted(() => {
    uiStore.stopAuthCheck()
})
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap";

.main-container {
    margin-top: 15px;
    margin-bottom: 15px;
}

@include media-breakpoint-up(md) {
    .main-container {
        margin-top: 70px;
    }
}
@include media-breakpoint-down(md) {
    .main-container {
        margin-bottom: 100px;
    }
}
</style>
