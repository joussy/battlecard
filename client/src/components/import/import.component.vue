<template>
    <h3>Import boxers</h3>
    <div class="stepper">
        <fieldset class="mb-3">
            <legend class="col-form-label pt-0">
                <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>How do you want
                to import the boxers ?
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
                >CSV File</label
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
                >CSV from clipboard</label
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
                >API</label
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
                >FFBoxe</label
            >
        </fieldset>
        <div
            v-if="importMode == 'ffboxe'"
            class="mb-3"
        >
            <div class="w-100 justify-content-center mb-3">
                <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>Connect to your
                <button class="btn btn-sm btn-outline-primary">
                    <a
                        target="_blank"
                        href="https://extranet.ffboxe.com/extractions/licences"
                    >
                        <IconComponent
                            name="ffboxe-without-text"
                            class="me-1"
                        ></IconComponent
                        >FFBoxe account</a
                    >
                </button>
            </div>
            <div>
                <span class="badge rounded-pill bg-primary me-2 mb-3"><span class="step-badge"></span></span>Extract
                your licences as CSV
                <img
                    src="@/assets/images/ffboxe-screenshot.png"
                    alt="FFBoxe export"
                    class="mb-3 img-fluid d-block"
                />
            </div>
            <span class="badge rounded-pill bg-primary me-2 mb-3"><span class="step-badge"></span></span>Import the CSV
            file
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
                    Preview
                </button>
            </div>
        </div>

        <div v-if="importMode == 'csv-file' || importMode == 'csv-clipboard'">
            <div v-if="importMode == 'csv-clipboard'">
                <legend class="col-form-label pt-0">
                    <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>Insert CSV
                    text from clipboard
                </legend>
                <textarea
                    v-model="clipboard"
                    class="d-block w-100 mb-2"
                />
            </div>
            <div v-if="importMode == 'csv-file'">
                <legend class="col-form-label pt-0">
                    <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>Import a CSV
                    file
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
                    <i class="bi bi-book me-2"></i><i>Show Columns Mapping</i>
                </button>
                <button
                    class="btn btn-primary"
                    @click="importMode == 'csv-file' ? previewCsvFile() : previewCsvText()"
                >
                    Preview
                </button>
            </div>
            <!-- List (always shown on md and up, collapsible on small screens) -->
            <div
                id="requiredColumns"
                class="collapse mb-3"
            >
                CSV fields separated by semicolon (;)
                <ul class="">
                    <li class="">Last Name</li>
                    <li class="">First Name</li>
                    <li class="">Birth Date (YYYY-MM-dd)</li>
                    <li class="">Club</li>
                    <li class="">Weight</li>
                    <li class="">Gender (male or female)</li>
                    <li class="">License</li>
                    <li class="">Fight Record</li>
                </ul>
            </div>
        </div>
        <div v-if="importMode == 'api'">
            <legend class="col-form-label pt-0">
                <span class="badge rounded-pill bg-primary me-2"><span class="step-badge"></span></span>Query the API
                (one id per line)
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
                    Preview
                </button>
            </div>
        </div>
        <div v-if="showImportTable">
            <span class="badge rounded-pill bg-primary me-2 mb-3"><span class="step-badge"></span></span>Preview the
            data and finalize import
            <div class="alert alert-warning">
                Import functionality temporarily disabled while migrating to generated SDK
            </div>
            <ImportTableComponent
                :input-boxers="rows"
                :add-row-allowed="false"
            />
        </div>
    </div>
</template>
<script lang="ts">
import ImportTableComponent from "@/components/import/import-table.component.vue"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { defineComponent } from "vue"
import { useUiStore } from "@/stores/ui.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { ImportBoxerDto, ImportOpenApi } from "@/api"

export default defineComponent({
    name: "ImportComponent",
    components: {
        ImportTableComponent: ImportTableComponent,
        IconComponent,
    },
    data() {
        return {
            tournamentStore: useTournamentStore(),
            uiStore: useUiStore(),
            importMode: "" as "" | "csv-file" | "csv-clipboard" | "api" | "ffboxe",
            showImportTable: false,
            clipboard: "",
            csvClipboardSample: `
lastName;firstName;birthDate;club;weight;gender;license;fightRecord
Shields;Claressa;2007-03-17;Salita Promotions;75;female;SHI006;14
Taylor;Katie;2006-07-02;Bray Boxing Club;60;female;TAY007;23
Ali;Muhammad;2012-01-17;Louisville Boxing Club;107;male;ALI001;61
Tyson;Mike;2011-06-30;Catskill Boxing Club;100;male;TYS002;58
                  `.trim(),
            apiClipboard: `279687
279688
279689
`,
            rows: [] as ImportBoxerDto[],
        }
    },
    watch: {
        importMode() {
            this.showImportTable = false
        },
    },
    mounted() {
        this.clipboard = this.csvClipboardSample
    },
    methods: {
        async previewApiText() {
            const res = await ImportOpenApi.previewFromApi({
                body: {
                    payload: this.apiClipboard,
                },
            })
            if (!res || !res.success) {
                console.error("Error previewing boxers:", res?.message)
                return
            }
            console.log("Preview result:", res.boxers)
            this.rows = [...res.boxers]
            console.log("this.rows:", this.rows)
            this.showImportTable = true
        },
        async previewCsvText() {
            const res = await ImportOpenApi.previewBoxersFromCsvText({
                body: {
                    payload: this.clipboard,
                },
            })
            if (!res || !res.success) {
                console.error("Error previewing boxers:", res?.message)
                return
            }
            this.rows = [...res.boxers]
            console.log("this.rows:", this.rows)
            this.showImportTable = true
        },
        previewCsvFile() {
            const fileInput = document.getElementById("formFileCsv") as HTMLInputElement
            if (!fileInput.files || fileInput.files.length === 0) {
                console.error("No file selected")
                return
            }
            // TODO: Update to use generated SDK - ImportOpenApi.previewBoxersFromCsvFile
            console.warn("Import functionality temporarily disabled - needs to be migrated to generated SDK")
            /*
            const file = fileInput.files[0]
            const res = await dbManager.previewBoxersFromCsvFile(file)
            if (!res.success) {
                console.error("Error previewing FFBoxe file:", res.message)
                return
            }
            this.rows = [...res.boxers]
            this.showImportTable = true
            */
        },

        previewFfboxeFile() {
            const fileInput = document.getElementById("formFileDisabled") as HTMLInputElement
            if (!fileInput.files || fileInput.files.length === 0) {
                console.error("No file selected")
                return
            }
            // TODO: Update to use generated SDK - ImportOpenApi.previewBoxersFromFfboxeFile
            console.warn("Import functionality temporarily disabled - needs to be migrated to generated SDK")
            /*
            const file = fileInput.files[0]
            const res = await dbManager.previewBoxersFromFfboxeFile(file)
            if (!res.success) {
                console.error("Error previewing FFBoxe file:", res.message)
                return
            }
            this.rows = [...res.boxers]
            this.showImportTable = true
            */
        },
    },
})
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
