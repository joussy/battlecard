<template>
    <div
        id="boxerAddOffcanvasNavbar"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        aria-labelledby="boxerAddOffcanvasNavbarLabel"
    >
        <div class="offcanvas-header">
            <h5
                id="boxerAddOffcanvasNavbarLabel"
                class="offcanvas-title"
            >
                Add a new boxer
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <BoxerSearchComponent @boxer-add="closeModal()"></BoxerSearchComponent>

            <BoxerAddFormComponent
                v-if="false"
                @boxer-add="closeModal()"
            ></BoxerAddFormComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { uiStore } from "@/composables/ui.composable"
import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import { closeModal } from "@/utils/ui.utils"
import BoxerSearchComponent from "./boxer-search.component.vue"

export default defineComponent({
    components: {
        BoxerAddFormComponent,
        BoxerSearchComponent,
    },
    data() {
        return {
            uiStore,
        }
    },
    methods: {
        closeModal() {
            closeModal("#boxerAddOffcanvasNavbar")
        },
    },
})
</script>
