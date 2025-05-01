<template>
    <!-- <h6><i class="bi bi-clipboard me-2" />Import from clibpoard</h6> -->
    <fieldset class="mb-3">
        <legend class="col-form-label pt-0">
            <span class="badge rounded-pill bg-primary me-2">1</span>How do you want to import ?
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
            class="btn"
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
            class="btn"
            >CSV from clipboard</label
        >
        <input
            id="api"
            v-model="importMode"
            type="radio"
            class="btn-check"
            name="options-mode"
            value="api"
            :disabled="!userStore.account?.apiEnabled"
        />
        <label
            for="api"
            class="btn"
            >API</label
        >
    </fieldset>
    <div v-if="importMode == 'csv-file' || importMode == 'csv-clipboard'">
        <fieldset class="mb-3">
            <legend class="col-form-label pt-0">
                <span class="badge rounded-pill bg-primary me-2">2</span>Choose a field separator
            </legend>
            <input
                id="tab"
                v-model="csvDelimiter"
                type="radio"
                class="btn-check"
                name="options-csv"
                value="tab"
            />
            <label
                for="tab"
                class="btn"
                >Tab</label
            >
            <input
                id="semi-column"
                v-model="csvDelimiter"
                type="radio"
                class="btn-check"
                name="options-csv"
                value="semi-column"
            />
            <label
                for="semi-column"
                class="btn"
                >Semi-column</label
            >
            <input
                id="comma"
                v-model="csvDelimiter"
                type="radio"
                class="btn-check"
                name="options-csv"
                value="comma"
            />
            <label
                for="comma"
                class="btn"
                >Comma</label
            >
        </fieldset>
        <div v-if="csvDelimiter">
            <div v-if="importMode == 'csv-clipboard'">
                <legend class="col-form-label pt-0">
                    <span class="badge rounded-pill bg-primary me-2">3</span>Paste your clipboard
                </legend>
                <textarea
                    v-model="clipboard"
                    class="d-block w-100 mb-2"
                />
            </div>
            <div v-if="importMode == 'csv-file'">This feature is coming very soon !</div>
            <div class="mb-3">
                <button
                    class="btn btn-outline-light me-2"
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
                    @click="processClipboard()"
                >
                    Import
                </button>
            </div>
            <!-- List (always shown on md and up, collapsible on small screens) -->
            <div
                id="requiredColumns"
                class="collapse"
            >
                <ul class="list-group">
                    <li class="list-group-item">Last Name</li>
                    <li class="list-group-item">First Name</li>
                    <li class="list-group-item">Fights</li>
                    <li class="list-group-item">Gender</li>
                    <li class="list-group-item">Weight</li>
                    <li class="list-group-item">Club</li>
                    <li class="list-group-item">Birth Date</li>
                    <li class="list-group-item">License</li>
                </ul>
            </div>
        </div>
    </div>
    <div v-if="importMode == 'api'">
        <legend class="col-form-label pt-0">
            <span class="badge rounded-pill bg-primary me-2">2</span>Query the API
        </legend>
        <textarea
            v-model="apiClipboard"
            class="d-block w-100 mb-2"
        />
        <div class="mb-3">
            <button
                class="btn btn-primary"
                @click="processApiImport()"
            >
                Import
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import fightService from "@/services/fight.service"
import { defineComponent } from "vue"
import { userStore } from "@/composables/user.composable"

export default defineComponent({
    emits: ["boxer-add"],
    data() {
        let ret = {
            userStore,
            clipboard: `
JOSHUA	Anthony	1	H	50.5	Club1	1/1/2010	A0001
FURY	Tyson	2	H	51	Club2	2/1/2010	B0002
TYSON	Mike	3	H	52	Club3	3/2/2011	C0003
STARR	Joey	4	H	53	Club4	4/2/2011	D0004
MONTANA	Tony	5	H	90	Club5	5/3/2012	E0005
NICOLSON	Skye	6	F	55	Club6	6/3/2012	F0006
TAYLOR	Katie	7	F	56	Club7	7/4/2013	G0007
SERRANO	Amanda	8	F	57	Club1	8/4/2014	A0008
      `.trim(),
            apiClipboard: `279687,50
279688,53
279689,52
`,
            csvDelimiter: "" as string,
            importMode: "" as "" | "csv-file" | "csv-clipboard" | "api",
        }
        return ret
    },
    methods: {
        async processApiImport() {
            await fightService.importFromApiByIds(this.apiClipboard)
        },
        async processClipboard() {
            let delimiter = ""
            switch (this.csvDelimiter) {
                case "comma":
                    delimiter = ","
                    break
                case "semi-column":
                    delimiter = ";"
                    break
                case "tab":
                    delimiter = `\t`
                    break
                default:
                    delimiter = `\t`
            }
            await fightService.importFromCsv(this.clipboard, delimiter)
            this.$emit("boxer-add")
        },
    },
})
</script>
<style scoped>
textarea {
    word-break: break-all;
    height: 300px;
}
</style>
