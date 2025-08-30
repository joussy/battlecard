<template>
    <ModalComponent v-model="model">
        <div class="modal-body p-3">
            <div>
                <slot>{{ message }}</slot>
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
import { useI18n } from "vue-i18n"
import ModalComponent from "./modal.component.vue"

const { t } = useI18n()

const model = defineModel<boolean>()
const emit = defineEmits<{
    (e: "confirm"): void
}>()

const props = withDefaults(
    defineProps<{
        confirmText?: string
        cancelText?: string
        message?: string
    }>(),
    {
        confirmText: t("confirmModal.confirm"),
        cancelText: t("confirmModal.cancel"),
        message: t("confirmModal.message"),
    }
)

const { confirmText, cancelText, message } = props

function confirm() {
    model.value = false
    // Emit a confirm event
    emit("confirm")
}
</script>
