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
            <BoxerAddFormComponent @boxer-add="closeModal()"></BoxerAddFormComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { uiStore } from "@/composables/ui.composable"
import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import bootstrap from "@/utils/bootstrap.singleton"

export default defineComponent({
    components: {
        BoxerAddFormComponent,
    },
    data() {
        return {
            uiStore,
        }
    },
    methods: {
        closeModal() {
            const bsOffcanvas = bootstrap.getInstance().Offcanvas.getInstance("#boxerAddOffcanvasNavbar")
            if (bsOffcanvas) {
                bsOffcanvas.hide()
            }
        },
    },
})
</script>
