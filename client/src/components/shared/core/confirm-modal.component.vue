<template>
    <ModalComponent v-model="model">
        <div class="mb-3">
            <slot>{{ message }}</slot>
        </div>
        <div class="gap-1 d-flex">
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
import { useI18n } from "vue-i18n"
import ModalComponent from "./modal.component.vue"
import { computed } from "vue"

const { t } = useI18n()

const model = defineModel<boolean>()
const emit = defineEmits<{
    (e: "confirm"): void
}>()

// Do not call i18n functions inside defineProps (they are hoisted).
const props = defineProps<{
    confirmText?: string
    cancelText?: string
    message?: string
}>()

const confirmText = computed(() => props.confirmText ?? t("confirmModal.confirm"))
const cancelText = computed(() => props.cancelText ?? t("confirmModal.cancel"))
const message = computed(() => props.message ?? t("confirmModal.message"))

function confirm() {
    model.value = false
    // Emit a confirm event
    emit("confirm")
}
</script>
