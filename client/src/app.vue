<template>
    <MenuTopComponent v-if="!$route.meta.hideMenu"></MenuTopComponent>
    <MenuBottomComponent v-if="!$route.meta.hideMenu"></MenuBottomComponent>
    <div class="main-container container">
        <RouterView />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import MenuTopComponent from "@/components/shared/layout/menu-top.component.vue"
import MenuBottomComponent from "@/components/shared/layout/menu-bottom.component.vue"
import { useUiStore } from "@/stores/ui.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useFightStore } from "@/stores/fight.store"

const router = useRouter()

onMounted(async () => {
    const uiStore = useUiStore()
    const tournamentStore = useTournamentStore()
    const fightStore = useFightStore()

    watch(
        () => [uiStore.restored],
        async () => {
            console.log("UI store restored:", uiStore.restored)
            if (uiStore.account) {
                await tournamentStore.fetchTournaments()
            }
        }
    )

    watch(
        () => tournamentStore.currentTournamentId,
        async () => {
            if (uiStore.account) {
                if (!tournamentStore.currentTournamentId) {
                    router.push("tournaments")
                } else {
                    await fightStore.fetchFights()
                }
            }
            uiStore.saveUiStore()
        },
        { immediate: true }
    )

    watch(
        () => [
            uiStore.facets,
            uiStore.theme,
            uiStore.hideNonMatchableOpponents,
            uiStore.hideFightersWithNoMatch,
            uiStore.jwtToken,
            uiStore.language,
        ],
        () => uiStore.saveUiStore(),
        { deep: true }
    )

    const localStorageData = await uiStore.loadUiStore()
    if (localStorageData?.currentTournamentId) {
        tournamentStore.setCurrentTournament(localStorageData.currentTournamentId)
    }
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
