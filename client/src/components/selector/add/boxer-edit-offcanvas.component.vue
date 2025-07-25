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
                :boxer="boxer"
                @boxer-saved="onBoxerSaved()"
            ></BoxerAddFormComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { Boxer } from "@/types/boxing.d"

import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import { closeModal } from "@/utils/ui.utils"
import { useUiStore } from "@/stores/ui.store"

export default defineComponent({
    components: {
        BoxerAddFormComponent,
    },
    props: {
        boxer: {
            type: Object as PropType<Boxer>,
            required: true,
        },
    },
    emits: ["boxer-saved"],
    data() {
        return {
            uiStore: useUiStore(),
        }
    },
    methods: {
        onBoxerSaved() {
            closeModal("#boxerEditOffcanvasNavbar")
            this.$emit("boxer-saved", this.boxer)
        },
    },
})
</script>
