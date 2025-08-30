<template>
    <OffcanvasComponent v-model="showOffcanvas">
        <template #header>
            <h5
                id="boxerAddOffcanvasNavbarLabel"
                class="offcanvas-title"
            >
                <i class="bi bi-person-plus-fill me-1"></i>
                {{ $t("addBoxer.title") }}
            </h5>
        </template>
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
                            {{ $t("addBoxer.search") }}
                        </button>
                    </li>
                    <li class="nav-item">
                        <button
                            class="nav-link"
                            :class="{ active: displayMode == 'create' }"
                            @click="displayMode = 'create'"
                        >
                            {{ $t("addBoxer.create") }}
                        </button>
                    </li>
                    <li class="nav-item">
                        <button
                            class="nav-link"
                            aria-current="page"
                            :class="{ active: displayMode == 'import' }"
                            @click="displayMode = 'import'"
                        >
                            {{ $t("addBoxer.import") }}
                        </button>
                    </li>
                </ul>
            </div>
            <div v-if="displayMode == 'search'">
                <BoxerSearchComponent @boxer-saved="onBoxerSaved()"></BoxerSearchComponent>
                <div class="mt-2 text-center">
                    <div class="mb-2">
                        <i> {{ $t("addBoxer.cannotFind") }} </i>
                    </div>
                    <button
                        class="btn btn-sm btn-light"
                        @click="displayMode = 'create'"
                    >
                        <i class="bi bi-person-add me-1"></i>{{ $t("addBoxer.createOne") }}
                    </button>
                </div>
            </div>
            <BoxerImportComponent v-if="displayMode == 'import'"></BoxerImportComponent>

            <BoxerAddFormComponent
                v-if="displayMode == 'create'"
                @boxer-saved="onBoxerSaved()"
            ></BoxerAddFormComponent>
        </div>
    </OffcanvasComponent>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"

import BoxerAddFormComponent from "./boxer-add-form.component.vue"
import BoxerImportComponent from "./boxer-import.component.vue"
import BoxerSearchComponent from "./boxer-search.component.vue"
import OffcanvasComponent from "@/components/shared/core/offcanvas.component.vue"

const showOffcanvas = defineModel<boolean>()

const { t: $t } = useI18n()

const emit = defineEmits<{ (e: "boxer-saved"): void }>()

const displayMode = ref<"search" | "create" | "import">("create")

function clear() {
    displayMode.value = "create"
}

function onBoxerSaved() {
    showOffcanvas.value = false
    emit("boxer-saved")
}
watch(showOffcanvas, (newValue) => {
    if (newValue) {
        clear()
    }
})
</script>
