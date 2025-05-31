<template>
    <div class="max-width-md">
        <div class="d-flex">
            <div class="d-none d-xs-none d-sm-block">
                <div>
                    <i class="bi bi-calendar ms-2"></i>
                    {{ tournamentName }} - <i>{{ tournamentDate }}</i>
                </div>
            </div>
            <div class="flex-grow-1"></div>
            <button
                class="btn btn-outline-danger mb-3 ms-2"
                @click="clear()"
            >
                <i class="bi bi-trash" />
            </button>
            <button
                class="btn btn-outline-success mb-3 ms-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#boxerAddOffcanvasNavbar"
            >
                <i class="bi bi-person-add" />
            </button>
            <button class="btn btn-outline-secondary mb-3 ms-2">
                <i class="bi bi-download" />
            </button>
            <button
                class="btn btn-outline-secondary mb-3 ms-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#filtersOffcanvasNavbar"
            >
                <span class="bi bi-funnel"></span>
            </button>
            <BoxerSelectorFiltersComponent />
            <BoxerAddOffcanvasComponent />
        </div>
        <div
            v-for="boxer in getBoxersToDisplay()"
            :key="boxer.id"
        >
            <BoxerTileComponent
                :boxer="boxer"
                :nb-opponents="boxer.eligibleFights"
                @click="$router.push({ name: 'selector-tile', params: { id: boxer.id } })"
            />
        </div>
        <div
            v-if="getBoxersToDisplay().length == 0"
            class="justify-content-center m-4 text-center"
        >
            <div class="mb-4"><i>No boxer available ...</i></div>
            <div>
                <button
                    class="btn btn-outline-success"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#boxerAddOffcanvasNavbar"
                >
                    <i class="bi bi-person-add me-2"></i>Import or create a boxer
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect } from "vue"
import { Gender, ModalityErrorType } from "@/shared/types/modality.type"
import BoxerTileComponent from "@/components/selector/boxer-tile.component.vue"
import BoxerAddOffcanvasComponent from "@/components/selector/add/boxer-add-offcanvas.component.vue"

import BoxerSelectorFiltersComponent from "@/components/selector/boxer-selector-filters.component.vue"
import IconComponent from "./core/icon.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { format } from "date-fns"

export default defineComponent({
    components: {
        BoxerTileComponent: BoxerTileComponent,
        BoxerAddOffcanvasComponent: BoxerAddOffcanvasComponent,
        BoxerSelectorFiltersComponent: BoxerSelectorFiltersComponent,
        Icon: IconComponent,
    },
    data() {
        return {
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            selectedTournamentId: null as string | null,
            tournamentStore: useTournamentStore(),
            tournamentBoxerStore: useTournamentBoxerStore(),
            uiStore: useUiStore(),
            boxersStore: useBoxerStore(),
        }
    },
    computed: {
        tournamentName() {
            return this.tournamentStore.getCurrentTournament()?.name
        },
        tournamentDate() {
            const dateAsStr = this.tournamentStore.getCurrentTournament()?.date
            if (!dateAsStr) return null
            const date = new Date(dateAsStr)
            return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString() : null
        },
    },
    async created() {
        await this.boxersStore.fetchBoxers()
    },
    mounted() {
        watchEffect(() => {
            this.selectedTournamentId = this.tournamentStore.currentTournamentId ?? null
        })
    },
    methods: {
        async clear() {
            if (this.selectedTournamentId == null) return
            await this.tournamentBoxerStore.removeBoxersFromTournamentAll(this.selectedTournamentId)
        },
        getBoxersToDisplay() {
            return this.boxersStore.boxers
        },
    },
})
</script>
