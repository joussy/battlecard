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
import fightService from "@/services/fight.service"
import { loadUserStore, userStore } from "@/composables/user.composable"
import { loadUiStore, uiStore } from "@/composables/ui.composable"

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
        loadUiStore()
        loadUserStore()
        watch(
            () => [userStore.account],
            async () => {
                if (userStore.account == null) {
                    uiStore.currentTournamentId = null
                    this.$router.push("settings")
                }
                await fightService.loadFightStore()
                await fightService.setCurrentTournament(uiStore.currentTournamentId)
            },
            {
                immediate: true,
            }
        )
        watch(
            () => [uiStore.currentTournamentId],
            () => {
                if (userStore.account && uiStore.currentTournamentId == null) {
                    this.$router.push("tournaments")
                }
            }
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
