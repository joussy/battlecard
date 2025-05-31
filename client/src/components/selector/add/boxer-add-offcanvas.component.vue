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
                        <a
                            class="nav-link"
                            aria-current="page"
                            href="#"
                            :class="{ active: displayMode == 'search' }"
                            @click="displayMode = 'search'"
                            >Search</a
                        >
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="#"
                            :class="{ active: displayMode == 'create' }"
                            @click="displayMode = 'create'"
                            >Create</a
                        >
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            aria-current="page"
                            href="#"
                            :class="{ active: displayMode == 'import' }"
                            @click="displayMode = 'import'"
                            >Import</a
                        >
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
import { closeModal } from "@/utils/ui.utils"
import BoxerSearchComponent from "./boxer-search.component.vue"
import BoxerImportComponent from "./boxer-import.component.vue"
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
            displayMode: "search" as "search" | "create" | "import",
        }
    },
    mounted() {
        const offcanvasRef = this.$refs.offcanvas as HTMLElement
        offcanvasRef.addEventListener("hidden.bs.offcanvas", (event) => {
            this.clear()
        })
        this.clear()
    },
    methods: {
        closeModal() {
            closeModal("#boxerAddOffcanvasNavbar")
        },
        clear() {
            this.displayMode = "search"
        },
    },
})
</script>
