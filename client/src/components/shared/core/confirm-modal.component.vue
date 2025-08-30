<template>
    <ModalComponent v-model="model">
        <div class="modal-body p-3">
            <div>
                <slot>Do you confirm the action ?</slot>
            </div>
            <button
                type="button"
                class="btn btn-danger"
                @click="confirm"
            >
                {{ confirmText }}
            </button>
            <button
                type="button"
                class="btn btn-secondary"
                @click="model = false"
            >
                {{ cancelText }}
            </button>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "./modal.component.vue"

const model = defineModel<boolean>()
const emit = defineEmits<{
    (e: "confirm"): void
}>()
const { confirmText = "Confirm", cancelText = "Cancel" } = defineProps<{
    confirmText?: string
    cancelText?: string
}>()

function confirm() {
    model.value = false
    // Emit a confirm event
    emit("confirm")
}
</script>
