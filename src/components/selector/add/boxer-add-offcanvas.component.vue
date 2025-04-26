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
            <div v-if="displayMode == 'search'">
                <BoxerSearchComponent @boxer-add="closeModal()"></BoxerSearchComponent>
                <div class="mt-2 text-center">
                    <div class="mb-2"><i> Cannot find what you want ? </i></div>
                    <button
                        class="btn btn-sm btn-light"
                        @click="displayMode = 'create'"
                    >
                        <i class="bi bi-person-add me-1"></i>Create one
                    </button>
                </div>
            </div>
            <BoxerAddFormComponent
                v-if="displayMode == 'create'"
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
            displayMode: "search" as "search" | "create",
        }
    },
    methods: {
        closeModal() {
            closeModal("#boxerAddOffcanvasNavbar")
        },
    },
})
</script>
