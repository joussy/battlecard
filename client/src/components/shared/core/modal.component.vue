<template>
    <!-- Modal -->
    <div
        ref="modalEl"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div
                    v-if="slots.header"
                    class="modal-header"
                >
                    <slot name="header"></slot>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Modal } from "bootstrap"
import { ref, watch, onMounted, onBeforeUnmount, useSlots } from "vue"
import { onBeforeRouteLeave } from "vue-router"

const model = defineModel<boolean>()
const modal = ref<Modal | null>(null)
const modalEl = ref<HTMLElement | null>(null)
const slots = useSlots()

watch(
    () => model.value,
    (newVal) => {
        if (newVal) {
            showModal()
        } else {
            hideModal()
        }
    }
)

onMounted(() => {
    if (!modalEl.value) {
        throw new Error("Modal element not found")
    }
    const modalElement = modalEl.value as HTMLElement
    modal.value = Modal.getOrCreateInstance(modalElement as HTMLElement)
    modalElement.addEventListener("show.bs.modal", () => {
        model.value = true
    })
    modalElement.addEventListener("hide.bs.modal", () => {
        model.value = false
    })
})

// Navigation guard
onBeforeRouteLeave(() => {
    if (modal.value) {
        modal.value.hide()
    }
})

onBeforeUnmount(() => {
    // Close modal when component is destroyed
    if (modal.value) {
        modal.value.hide()
    }
})

function showModal() {
    if (!modal.value) return
    modal.value.show()
    model.value = true
}

function hideModal() {
    if (!modal.value) return
    modal.value.hide()
    model.value = false
}
</script>
