<template>
    <MenuTopComponent v-if="!$route.meta.hideMenu"></MenuTopComponent>
    <MenuBottomComponent v-if="!$route.meta.hideMenu"></MenuBottomComponent>
    <div class="main-container container">
        <RouterView />
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue"
import MenuTopComponent from "@/components/shared/layout/menu-top.component.vue"
import MenuBottomComponent from "@/components/shared/layout/menu-bottom.component.vue"
import { useUiStore } from "@/stores/ui.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useFightStore } from "@/stores/fight.store"

export default defineComponent({
    components: {
        MenuTopComponent,
        MenuBottomComponent,
    },
    data() {
        return {
            currentPath: window.location.hash,
        }
    },
    async mounted() {
        const uiStore = useUiStore()
        const tournamentStore = useTournamentStore()
        const fightStore = useFightStore()
        watch(
            () => [uiStore.restored],
            async () => {
                console.log("UI store restored:", uiStore.restored)
                // If the user is logged in, fetch the tournaments
                if (uiStore.account) {
                    await tournamentStore.fetchTournaments()
                }
            }
        )
        watch(
            () => [tournamentStore.currentTournamentId],
            async () => {
                if (uiStore.account) {
                    if (!tournamentStore.currentTournamentId) {
                        this.$router.push("tournaments")
                    } else {
                        //Just for the fight counter, but it's overkill
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
            ],
            () => uiStore.saveUiStore(),
            { deep: true }
        )
        const localStorageData = await uiStore.loadUiStore()
        if (localStorageData?.currentTournamentId) {
            tournamentStore.setCurrentTournament(localStorageData.currentTournamentId)
        }
    },
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
