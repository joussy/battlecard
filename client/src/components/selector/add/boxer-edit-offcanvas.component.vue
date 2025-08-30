<template>
    <OffcanvasComponent v-model="showOffcanvas">
        <template #header>
            <h5 class="offcanvas-title">
                <i class="bi bi-pencil-square me-1"></i>
                {{ $t("editBoxer.title") }}
            </h5>
        </template>
        <BoxerAddFormComponent
            v-if="boxerStore.boxerToEdit"
            :boxer="boxerStore.boxerToEdit"
            @boxer-saved="onBoxerSaved()"
        ></BoxerAddFormComponent>
    </OffcanvasComponent>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n"

import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import { useBoxerStore } from "@/stores/boxer.store"
import OffcanvasComponent from "@/components/shared/core/offcanvas.component.vue"
const showOffcanvas = defineModel<boolean>()
const { t: $t } = useI18n()

const emit = defineEmits<{ (e: "boxer-saved", payload: unknown): void }>()

const boxerStore = useBoxerStore()

function onBoxerSaved() {
    emit("boxer-saved", boxerStore.boxerToEdit)
    boxerStore.boxerToEdit = null
    showOffcanvas.value = false
}
</script>
