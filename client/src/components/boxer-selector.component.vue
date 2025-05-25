<template>
    <div class="max-width-md">
        <div class="d-flex">
            <div class="flex-grow-1">
                <div class="input-group">
                    <span
                        id="basic-addon1"
                        class="input-group-text"
                    >
                        <Icon name="tournament"></Icon>
                    </span>
                    <select
                        v-model="selectedTournamentId"
                        class="form-select"
                        aria-label="Choose an event"
                        @change="setTournament"
                    >
                        <option
                            v-for="tournament in getTournaments()"
                            :value="tournament.id"
                            :selected="tournament.id == selectedTournamentId"
                        >
                            {{ tournament.name }}
                        </option>
                    </select>
                </div>
            </div>
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
            :key="boxer.attributes.id"
        >
            <BoxerTileComponent
                :boxer="boxer"
                @click="$router.push({ name: 'selector-tile', params: { id: boxer.attributes.id } })"
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
import { Gender } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import BoxerTileComponent from "@/components/selector/boxer-tile.component.vue"
import BoxerAddOffcanvasComponent from "@/components/selector/add/boxer-add-offcanvas.component.vue"

import BoxerSelectorFiltersComponent from "@/components/selector/boxer-selector-filters.component.vue"
import IconComponent from "./core/icon.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"

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
            return this.boxersStore.boxers.filter((b) => {
                if (this.uiStore.hideFightersWithNoMatch && !b.opponents.some((o) => o.isEligible)) return false
                return true
            })
        },
        setTournament() {
            this.tournamentStore.setCurrentTournament(this.selectedTournamentId)
        },
        getTournaments() {
            return this.tournamentStore.tournaments
        },
    },
})
</script>
