<template>
    <MenuTopComponent></MenuTopComponent>
    <MenuBottomComponent></MenuBottomComponent>
    <div class="main-container container">
        <RouterView />
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue"
import MenuTopComponent from "@/components/menu/menu-top.component.vue"
import MenuBottomComponent from "@/components/menu/menu-bottom.component.vue"
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
        uiStore.loadUiStore()
        const tournamentStore = useTournamentStore()
        const fightStore = useFightStore()
        await tournamentStore.fetchTournaments()
        watch(
            () => [tournamentStore.currentTournamentId],
            async () => {
                if (uiStore.account) {
                    if (tournamentStore.currentTournamentId == null) {
                        this.$router.push("tournaments")
                    } else {
                        await fightStore.fetchFights()
                    }
                }
                uiStore.saveUiStore()
            },
            { immediate: true }
        )
        watch(
            () => [uiStore.theme, uiStore.hideNonMatchableOpponents, uiStore.hideFightersWithNoMatch, uiStore.jwtToken],
            () => uiStore.saveUiStore(),
            { deep: true }
        )
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
