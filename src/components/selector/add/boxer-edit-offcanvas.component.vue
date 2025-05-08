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
                :boxer="boxer.attributes"
                @boxer-add="closeModal()"
            ></BoxerAddFormComponent>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { Boxer } from "@/types/boxing.d"

import { uiStore } from "@/composables/ui.composable"
import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import { closeModal } from "@/utils/ui.utils"

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
    data() {
        return {
            uiStore,
        }
    },
    mounted() {
        //.log(this.boxer.attributes)
    },
    methods: {
        closeModal() {
            console.log("ehho")
            closeModal("#boxerEditOffcanvasNavbar")
        },
    },
})
</script>
