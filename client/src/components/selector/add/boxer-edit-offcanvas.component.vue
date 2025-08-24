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

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue"

import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import { closeModal, openModal } from "@/utils/ui.utils"
import { useBoxerStore } from "@/stores/boxer.store"

const emit = defineEmits<{ (e: "boxer-saved", payload: unknown): void }>()

const boxerStore = useBoxerStore()

// watch store boxerToEdit to open/close modal
watch(
    () => boxerStore.boxerToEdit,
    (newBoxer) => {
        if (!newBoxer) closeModal("#boxerEditOffcanvasNavbar")
        else openModal("#boxerEditOffcanvasNavbar")
    }
)

const offcanvas = ref<HTMLElement | null>(null)
let hiddenHandler: (() => void) | null = null

onMounted(() => {
    if (offcanvas.value) {
        hiddenHandler = () => {
            boxerStore.boxerToEdit = null
        }
        offcanvas.value.addEventListener("hidden.bs.offcanvas", hiddenHandler)
    }
})

onBeforeUnmount(() => {
    if (offcanvas.value && hiddenHandler) {
        offcanvas.value.removeEventListener("hidden.bs.offcanvas", hiddenHandler)
    }
})

function onBoxerSaved() {
    emit("boxer-saved", boxerStore.boxerToEdit)
    boxerStore.boxerToEdit = null
}
</script>
