<template>
    <MenuComponent />
    <div class="container mt-2 mt-md-5 mb-5 main-container">
        <component :is="currentView" />
        <!-- <div class="row">
            <div class="col-md-12 mb-4">
                <UploadComponent />
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <BoxerSelectorComponent />
            </div>
            <div class="col-md-6">
                <FightCardComponent />
                <ClubStatisticsComponent />
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
import { Component, defineComponent } from "vue"
import FightCardComponent from "@/components/fight-card.component.vue"
import ClubStatisticsComponent from "@/components/club-statistics.component.vue"
import UploadComponent from "@/components/options-panel.component.vue"
import BoxerSelectorComponent from "@/components/boxer-selector.component.vue"
import MenuComponent from "@/components/menu.component.vue"
import { loadStore } from "@/composables/fight.composable"

const routes = {
    "/selector": BoxerSelectorComponent,
    "/card": FightCardComponent,
    "/settings": UploadComponent,
}

export default defineComponent({
    components: {
        FightCardComponent: FightCardComponent,
        ClubStatisticsComponent: ClubStatisticsComponent,
        UploadComponent: UploadComponent,
        BoxerSelectorComponent: BoxerSelectorComponent,
        MenuComponent: MenuComponent,
    },
    data() {
        return {
            currentPath: window.location.hash,
        }
    },
    computed: {
        currentView(): Component | null {
            return routes[this.currentPath.slice(1) as keyof typeof routes] || null
        },
    },
    async mounted() {
        loadStore()
        window.addEventListener("hashchange", () => {
            this.currentPath = window.location.hash
        })
    },
})
</script>

<style>
@include media-breakpoint-up(sm) {
    .main-container {
        margin-top: 100px;
    }
}
</style>
