<template>
    <div
        id="boxerAddOffcanvasNavbar"
        ref="offcanvas"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        aria-labelledby="boxerAddOffcanvasNavbarLabel"
    >
        <div class="offcanvas-header">
            <h5
                id="boxerAddOffcanvasNavbarLabel"
                class="offcanvas-title"
            >
                Add a boxer
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <div class="bg-body-tertiary rounded">
                <ul class="nav nav-pills nav-fill mb-3">
                    <li class="nav-item">
                        <button
                            class="nav-link disabled"
                            aria-current="page"
                            :class="{ active: displayMode == 'search' }"
                            @click="displayMode = 'search'"
                        >
                            Search
                        </button>
                    </li>
                    <li class="nav-item">
                        <button
                            class="nav-link"
                            :class="{ active: displayMode == 'create' }"
                            @click="displayMode = 'create'"
                        >
                            Create
                        </button>
                    </li>
                    <li class="nav-item">
                        <button
                            class="nav-link"
                            aria-current="page"
                            :class="{ active: displayMode == 'import' }"
                            @click="displayMode = 'import'"
                        >
                            Import
                        </button>
                    </li>
                </ul>
            </div>
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
            <BoxerImportComponent
                v-if="displayMode == 'import'"
                @boxer-add="closeModal()"
            ></BoxerImportComponent>

            <BoxerAddFormComponent
                v-if="displayMode == 'create'"
                @boxer-add="closeModal()"
            ></BoxerAddFormComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import BoxerImportComponent from "./boxer-import.component.vue"
import { closeModal } from "@/utils/ui.utils"
import BoxerSearchComponent from "./boxer-search.component.vue"
import { useUiStore } from "@/stores/ui.store"

export default defineComponent({
    components: {
        BoxerAddFormComponent,
        BoxerSearchComponent,
        BoxerImportComponent,
    },
    data() {
        return {
            uiStore: useUiStore(),
            displayMode: "create" as "search" | "create" | "import",
        }
    },
    mounted() {
        const offcanvasRef = this.$refs.offcanvas as HTMLElement
        offcanvasRef.addEventListener("hidden.bs.offcanvas", () => {
            this.clear()
        })
        this.clear()
    },
    methods: {
        closeModal() {
            closeModal("#boxerAddOffcanvasNavbar")
        },
        clear() {
            this.displayMode = "create"
        },
    },
})
</script>
