<template>
    <div class="d-flex">
        <h3 class="flex-grow-1">Fighters</h3>
        <button class="btn btn-outline-secondary mb-3 ms-2" @click="expandAll()">
            <i class="bi bi-chevron-down" />
            /
            <i class="bi bi-chevron-right" />
        </button>
        <button class="btn btn-outline-danger mb-3 ms-2" @click="store.clear()">
            <i class="bi bi-trash" />
        </button>
        <button class="btn btn-outline-success mb-3 ms-2" @click="boxerAddMode = !boxerAddMode">
            <i class="bi bi-person-add" />
        </button>
    </div>
    <div v-show="boxerAddMode" class="card">
        <BoxerAddComponent />
    </div>

    <div v-for="boxer in store.boxers" v-show="!boxerAddMode" :key="boxer.attributes.id" class="card">
        <BoxerTileComponent :boxer="boxer" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Gender } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import BoxerTileComponent from "@/components/boxer-tile.component.vue"
import BoxerAddComponent from "@/components/boxer-add.component.vue"

import { store } from "@/composables/fight.composable"

export default defineComponent({
    components: {
        BoxerTileComponent: BoxerTileComponent,
        BoxerAddComponent: BoxerAddComponent,
    },
    data() {
        return {
            store,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            boxerAddMode: false,
        }
    },
    mounted() {
        console.log(this.boxerAddMode)
        console.log("sdfwefewf")
    },
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
    },
})
</script>
