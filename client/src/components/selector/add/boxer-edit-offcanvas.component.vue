<template>
    <div
        id="boxerEditOffcanvasNavbar"
        ref="offcanvas"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        aria-labelledby="boxerEditOffcanvasNavbarLabel"
    >
        <div class="offcanvas-header">
            <h5
                id="boxerEditOffcanvasNavbarLabel"
                class="offcanvas-title"
            >
                <i class="bi bi-pencil-square me-1"></i>
                Edit a boxer
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <BoxerAddFormComponent
                v-if="boxerStore.boxerToEdit"
                :boxer="boxerStore.boxerToEdit"
                @boxer-saved="onBoxerSaved()"
            ></BoxerAddFormComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import { closeModal, openModal } from "@/utils/ui.utils"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { Boxer } from "@/types/boxing"

export default defineComponent({
    components: {
        BoxerAddFormComponent,
    },
    emits: ["boxer-saved"],
    data() {
        return {
            uiStore: useUiStore(),
            boxerStore: useBoxerStore(),
        }
    },
    watch: {
        "boxerStore.boxerToEdit": function (newBoxer: Boxer | null) {
            console.log("Boxer to edit changed", newBoxer)
            if (!newBoxer) {
                closeModal("#boxerEditOffcanvasNavbar")
            } else {
                openModal("#boxerEditOffcanvasNavbar")
            }
        },
    },
    methods: {
        onBoxerSaved() {
            this.$emit("boxer-saved", this.boxerStore.boxerToEdit)
            this.boxerStore.boxerToEdit = null
        },
    },
})
</script>
