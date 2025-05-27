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
import { useBoxerStore } from "@/stores/boxer.store"

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
    mounted() {
        const uiStore = useUiStore()
        uiStore.loadUiStore()
        const tournamentStore = useTournamentStore()
        const boxerStore = useBoxerStore()
        watch(
            () => [tournamentStore.currentTournamentId],
            async () => {
                if (uiStore.account && tournamentStore.currentTournamentId == null) {
                    this.$router.push("tournaments")
                }
                if (tournamentStore.currentTournamentId) {
                    await boxerStore.fetchBoxers(tournamentStore.currentTournamentId)
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
        tournamentStore.fetchTournaments()
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
