<template>
    <h3>{{ $t("import.title") }}</h3>
    <div class="stepper">
        <fieldset class="mb-3">
            <legend class="col-form-label pt-0">
                <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>{{ $t("import.howToImport") }}
            </legend>
            <input
                id="csvfile"
                v-model="importMode"
                type="radio"
                class="btn-check"
                name="options-mode"
                value="csv-file"
            />
            <label
                for="csvfile"
                class="btn btn-outline-secondary"
                >{{ $t("import.csvFile") }}</label
            >
            <input
                id="csvclipboard"
                v-model="importMode"
                type="radio"
                class="btn-check"
                name="options-mode"
                value="csv-clipboard"
            />
            <label
                for="csvclipboard"
                class="btn btn-outline-secondary"
                >{{ $t("import.csvClipboard") }}</label
            >
            <input
                id="api"
                v-model="importMode"
                type="radio"
                class="btn-check"
                name="options-mode"
                value="api"
                :disabled="!uiStore.account?.apiEnabled"
            />
            <label
                for="api"
                class="btn btn-outline-secondary"
                >{{ $t("import.api") }}</label
            >
            <input
                id="ffboxe"
                v-model="importMode"
                type="radio"
                class="btn-check"
                name="options-mode"
                value="ffboxe"
            />
            <label
                for="ffboxe"
                class="btn btn-outline-secondary"
                >{{ $t("import.ffboxe") }}</label
            >
        </fieldset>
        <div
            v-if="importMode == 'ffboxe'"
            class="mb-3"
        >
            <div class="w-100 justify-content-center mb-3">
                <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>{{ $t("import.connectTo") }}
                <button class="btn btn-sm btn-outline-primary">
                    <a
                        target="_blank"
                        href="https://extranet.ffboxe.com/extractions/licences"
                    >
                        <IconComponent
                            name="ffboxe-without-text"
                            class="me-1"
                        ></IconComponent
                        >{{ $t("import.ffboxeAccount") }}</a
                    >
                </button>
            </div>
            <div>
                <span class="badge rounded-pill bg-primary me-2 mb-3"><span class="step-badge"></span></span>{{ $t("import.extractLicences") }}
                <img
                    src="@/assets/images/ffboxe-screenshot.png"
                    alt="FFBoxe export"
                    class="mb-3 img-fluid d-block"
                />
            </div>
            <span class="badge rounded-pill bg-primary me-2 mb-3"><span class="step-badge"></span></span>{{ $t("import.importCsvFile") }}
            <div class="mb-3">
                <input
                    id="formFileDisabled"
                    class="form-control"
                    type="file"
                />
            </div>
            <div class="mb-3">
                <button
                    class="btn btn-primary"
                    @click="previewFfboxeFile"
                >
                    {{ $t("import.preview") }}
                </button>
            </div>
        </div>

        <div v-if="importMode == 'csv-file' || importMode == 'csv-clipboard'">
            <div v-if="importMode == 'csv-clipboard'">
                <legend class="col-form-label pt-0">
                    <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>{{ $t("import.insertCsvText") }}
                </legend>
                <textarea
                    v-model="clipboard"
                    class="d-block w-100 mb-2"
                />
            </div>
            <div v-if="importMode == 'csv-file'">
                <legend class="col-form-label pt-0">
                    <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>{{ $t("import.importCsvFileStep") }}
                </legend>
                <div class="mb-3">
                    <input
                        id="formFileCsv"
                        class="form-control"
                        type="file"
                    />
                </div>
            </div>
            <div class="mb-3">
                <button
                    class="btn btn-outline-secondary me-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#requiredColumns"
                    aria-expanded="false"
                    aria-controls="requiredColumns"
                >
                    <i class="bi bi-book me-2"></i><i>{{ $t("import.showColumnsMapping") }}</i>
                </button>
                <button
                    class="btn btn-primary"
                    @click="importMode == 'csv-file' ? previewCsvFile() : previewCsvText()"
                >
                    {{ $t("import.preview") }}
                </button>
            </div>
            <!-- List (always shown on md and up, collapsible on small screens) -->
            <div
                id="requiredColumns"
                class="collapse mb-3"
            >
                {{ $t("import.csvFieldsInfo") }}
                <ul class="">
                    <li class="">{{ $t("import.lastName") }}</li>
                    <li class="">{{ $t("import.firstName") }}</li>
                    <li class="">{{ $t("import.birthDate") }}</li>
                    <li class="">{{ $t("import.club") }}</li>
                    <li class="">{{ $t("import.weight") }}</li>
                    <li class="">{{ $t("import.gender") }}</li>
                    <li class="">{{ $t("import.license") }}</li>
                    <li class="">{{ $t("import.fightRecord") }}</li>
                </ul>
            </div>
        </div>
        <div v-if="importMode == 'api'">
            <legend class="col-form-label pt-0">
                <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>{{ $t("import.queryApi") }}
            </legend>
            <textarea
                v-model="apiClipboard"
                class="d-block w-100 mb-2"
            />
            <div class="mb-3">
                <button
                    class="btn btn-primary"
                    @click="previewApiText()"
                >
                    {{ $t("import.preview") }}
                </button>
            </div>
        </div>
        <div v-if="showImportTable">
            <span class="badge rounded-pill bg-primary me-2 mb-3"><span class="step-badge"></span></span>{{ $t("import.previewData") }}
            <ImportTableComponent
                :input-boxers="rows"
                :add-row-allowed="false"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import ImportTableComponent from "@/components/import/import-table.component.vue"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { useUiStore } from "@/stores/ui.store"
import { ImportBoxerDto, ImportOpenApi } from "@/api"

const { t: $t } = useI18n()

const uiStore = useUiStore()

const importMode = ref<"" | "csv-file" | "csv-clipboard" | "api" | "ffboxe">("")
const showImportTable = ref(false)
const clipboard = ref("")
const csvClipboardSample = `
lastName;firstName;birthDate;club;weight;gender;license;fightRecord
Shields;Claressa;2007-03-17;Salita Promotions;75;female;SHI006;14
Taylor;Katie;2006-07-02;Bray Boxing Club;60;female;TAY007;23
Ali;Muhammad;2012-01-17;Louisville Boxing Club;107;male;ALI001;61
Tyson;Mike;2011-06-30;Catskill Boxing Club;100;male;TYS002;58
                  `.trim()
const apiClipboard = ref(`279687
279688
279689
`)
const rows = ref<ImportBoxerDto[]>([])

// Watch for import mode changes
watch(importMode, () => {
    showImportTable.value = false
})

onMounted(() => {
    clipboard.value = csvClipboardSample
})

const previewApiText = async () => {
    const res = await ImportOpenApi.previewFromApi({
        body: {
            payload: apiClipboard.value,
        },
    })
    if (!res || !res.success) {
        console.error("Error previewing boxers:", res?.message)
        return
    }
    console.log("Preview result:", res.boxers)
    rows.value = [...res.boxers]
    console.log("rows:", rows.value)
    showImportTable.value = true
}

const previewCsvText = async () => {
    const res = await ImportOpenApi.previewBoxersFromCsvText({
        body: {
            payload: clipboard.value,
        },
    })
    if (!res || !res.success) {
        console.error("Error previewing boxers:", res?.message)
        return
    }
    rows.value = [...res.boxers]
    console.log("rows:", rows.value)
    showImportTable.value = true
}

const previewCsvFile = async () => {
    const fileInput = document.getElementById("formFileCsv") as HTMLInputElement
    if (!fileInput.files || fileInput.files.length === 0) {
        console.error("No file selected")
        return
    }
    console.warn("Import functionality temporarily disabled - needs to be migrated to generated SDK")
    const file = fileInput.files[0]
    const res = await ImportOpenApi.previewBoxersFromCsvFile({
        body: {
            file: file,
        },
    })
    if (!res || !res.success) {
        console.error("Error previewing FFBoxe file:", res?.message)
        return
    }
    rows.value = [...res.boxers]
    showImportTable.value = true
}

const previewFfboxeFile = async () => {
    const fileInput = document.getElementById("formFileDisabled") as HTMLInputElement
    if (!fileInput.files || fileInput.files.length === 0) {
        console.error("No file selected")
        return
    }
    const file = fileInput.files[0]
    const res = await ImportOpenApi.previewBoxersFromFfboxeFile({
        body: {
            file: file,
        },
    })
    if (!res || !res.success) {
        console.error("Error previewing FFBoxe file:", res?.message)
        return
    }
    rows.value = [...res.boxers]
    showImportTable.value = true
}
</script>
<style scoped>
.stepper {
    counter-reset: step;
}
.step-badge {
    counter-increment: step;
}
.step-badge::before {
    content: counter(step);
}
textarea {
    word-break: break-all;
    height: 300px;
}
fieldset label.btn {
    margin: 5px;
}
</style>
