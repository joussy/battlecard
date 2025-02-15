<template>
    <div class="d-flex">
        <h3 class="flex-grow-1"></h3>
        <button
            class="btn btn-outline-secondary mb-3 ms-2"
            @click="expandAll()"
        >
            <i class="bi bi-chevron-down" />
            /
            <i class="bi bi-chevron-right" />
        </button>
        <button
            class="btn btn-outline-danger mb-3 ms-2"
            @click="store.clear()"
        >
            <i class="bi bi-trash" />
        </button>
        <button
            class="btn btn-outline-success mb-3 ms-2"
            @click="(boxerToEdit = null), (boxerAddMode = !boxerAddMode)"
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
        class="card"
    >
        <BoxerTileComponent
            :boxer="boxer"
            @boxer-edit="editBoxer(boxer)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Boxer, BoxerAttributes, Gender } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import BoxerTileComponent from "@/components/boxer-tile.component.vue"
import BoxerAddComponent from "@/components/boxer-add.component.vue"

import { store } from "@/composables/fight.composable"
import BoxerSelectorFiltersComponent from "@/components/boxer-selector-filters.component.vue"

export default defineComponent({
    components: {
        BoxerTileComponent: BoxerTileComponent,
        BoxerAddComponent: BoxerAddComponent,
        BoxerSelectorFiltersComponent: BoxerSelectorFiltersComponent,
    },
    data() {
        return {
            store,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            boxerAddMode: false,
            boxerToEdit: null as BoxerAttributes | null,
        }
    },
    mounted() {},
    methods: {
        expandAll() {
            let collapse = true
            if (this.store.boxers[0]?.collapsed) {
                collapse = false
            }
            for (let [index] of this.store.boxers.entries()) {
                this.store.boxers[index].collapsed = collapse
            }
        },
        onBoxerAdd(newBoxer: BoxerAttributes) {
            this.boxerAddMode = false
            store.addBoxer(newBoxer)
            store.computeBoxersOpponents()
        },
        downloadCsv() {
            const csv = store.getAvailableBoxersAsCsv()
            const blob = new Blob([csv], { type: "text/csv" })
            const elem = window.document.createElement("a")
            elem.href = window.URL.createObjectURL(blob)
            elem.download = "boxers.csv"
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)
        },
        editBoxer(boxer: Boxer) {
            this.boxerToEdit = boxer.attributes
            this.boxerAddMode = true
        },
        getBoxersToDisplay(): Boxer[] {
            return store.boxers.filter((b) => {
                if (store.hideFightersWithNoMatch && !b.opponents.some((o) => o.isEligible)) return false
                return true
            })
        },
    },
})
</script>
