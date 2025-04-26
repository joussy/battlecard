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
                        aria-label="Default select example"
                        @change="setTournament"
                    >
                        <option
                            v-for="tournament in store.tournaments"
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
            <button
                class="btn btn-outline-secondary mb-3 ms-2"
                @click="downloadCsv"
            >
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
    </div>
</template>

<script lang="ts">
import { defineComponent, watch, watchEffect } from "vue"
import { Gender } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import BoxerTileComponent from "@/components/selector/boxer-tile.component.vue"
import BoxerAddOffcanvasComponent from "@/components/selector/add/boxer-add-offcanvas.component.vue"

import BoxerSelectorFiltersComponent from "@/components/selector/boxer-selector-filters.component.vue"
import fightService from "@/services/fight.service"
import { uiStore } from "@/composables/ui.composable"
import IconComponent from "./core/icon.component.vue"

export default defineComponent({
    components: {
        BoxerTileComponent: BoxerTileComponent,
        BoxerAddOffcanvasComponent: BoxerAddOffcanvasComponent,
        BoxerSelectorFiltersComponent: BoxerSelectorFiltersComponent,
        Icon: IconComponent,
    },
    data() {
        return {
            store: fightService.store(),
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            fightService: fightService,
            selectedTournamentId: null as string | null,
        }
    },
    mounted() {
        watchEffect(() => {
            console.log(this.store.currentTournament)
            this.selectedTournamentId = this.store.currentTournament?.id ?? null
        })
    },
    methods: {
        async clear() {
            await fightService.removeBoxersFromTournament()
        },
        downloadCsv() {
            const csv = fightService.getAvailableBoxersAsCsv()
            const blob = new Blob([csv], { type: "text/csv" })
            const elem = window.document.createElement("a")
            elem.href = window.URL.createObjectURL(blob)
            elem.download = "boxers.csv"
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        },
        getBoxersToDisplay() {
            return fightService.store().boxers.filter((b) => {
                if (uiStore.hideFightersWithNoMatch && !b.opponents.some((o) => o.isEligible)) return false
                return true
            })
        },
        setTournament() {
            this.fightService.setCurrentTournament(this.selectedTournamentId)
        },
    },
})
</script>
