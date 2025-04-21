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
import { loadUiStore } from "@/composables/ui.composable"

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
                await fightService.loadFightStore()
            },
            {
                immediate: true,
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
