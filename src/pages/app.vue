<template>
    <MenuComponent />
    <div class="container main-container">
        <RouterView />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import MenuComponent from "@/components/menu.component.vue"
import fightService from "@/services/fight.service"
import { loadUserStore } from "@/composables/user.composable"

export default defineComponent({
    components: {
        MenuComponent: MenuComponent,
    },
    data() {
        return {
            currentPath: window.location.hash,
        }
    },
    async mounted() {
        await loadUserStore()
        fightService.loadStore()
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
