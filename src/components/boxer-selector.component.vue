<template>
    <div class="max-width-md">
        <div class="d-flex">
            <h3 class="flex-grow-1"></h3>
            <button
                class="btn btn-outline-danger mb-3 ms-2"
                @click="clear()"
            >
                <i class="bi bi-trash" />
            </button>
            <button
                class="btn btn-outline-success mb-3 ms-2"
                @click="((boxerToEdit = null), (boxerAddMode = !boxerAddMode))"
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
                data-bs-target="#offcanvasNavbar"
            >
                <span class="bi bi-funnel"></span>
            </button>
            <BoxerSelectorFiltersComponent />
        </div>
        <div
            v-if="boxerAddMode"
            class="card"
        >
            <BoxerAddComponent
                :boxer="boxerToEdit"
                @boxer-add="onBoxerAdd"
            />
        </div>

        <div
            v-for="boxer in getBoxersToDisplay()"
            v-show="!boxerAddMode"
            :key="boxer.attributes.id"
        >
            <BoxerTileComponent
                :boxer="boxer"
                @boxer-edit="editBoxer(boxer.attributes)"
                @click="$router.push({ name: 'selector-tile', params: { id: boxer.attributes.id } })"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { BoxerAttributes, Gender } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import BoxerTileComponent from "@/components/boxer-tile.component.vue"
import BoxerAddComponent from "@/components/boxer-add.component.vue"

import BoxerSelectorFiltersComponent from "@/components/boxer-selector-filters.component.vue"
import fightService from "@/services/fight.service"
import { uiStore } from "@/composables/ui.composable"

export default defineComponent({
    components: {
        BoxerTileComponent: BoxerTileComponent,
        BoxerAddComponent: BoxerAddComponent,
        BoxerSelectorFiltersComponent: BoxerSelectorFiltersComponent,
    },
    data() {
        return {
            store: fightService.store(),
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            boxerAddMode: false,
            boxerToEdit: null as BoxerAttributes | null,
            fightService: fightService,
        }
    },
    methods: {
        async clear() {
            await fightService.clear()
        },
        collapseAll() {
            uiStore.collapseAll()
        },
        onBoxerAdd(newBoxer: BoxerAttributes) {
            this.boxerAddMode = false
            fightService.addBoxer(newBoxer)
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
        editBoxer(boxer: Readonly<BoxerAttributes>) {
            this.boxerToEdit = boxer
            this.boxerAddMode = true
        },
        getBoxersToDisplay() {
            return fightService.store().boxers.filter((b) => {
                if (uiStore.hideFightersWithNoMatch && !b.opponents.some((o) => o.isEligible)) return false
                return true
            })
        },
    },
})
</script>
