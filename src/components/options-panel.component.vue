<template>
    <div class="card mb-3">
        <div class="card-header"><i class="bi bi-gear me-2" />General</div>
        <div class="card-body">
            <div class="form-check form-switch mb-3">
                <input
                    id="darkmodeSwitch"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :checked="store.darkMode"
                    @click="toggleDarkMode()"
                />
                <label
                    class="form-check-label"
                    for="darkmodeSwitch"
                    >Dark Mode</label
                >
            </div>
            <div class="mb-3">
                <label
                    for="apiUrl"
                    class="form-label"
                    >API Server Address</label
                >
                <input
                    id="apiUrl"
                    v-model="store.apiServerAddress"
                    type="url"
                    class="form-control"
                    placeholder="https://my-ip-server"
                />
            </div>
            <div class="mb-3">
                <button
                    class="btn btn-danger ms-2"
                    @click="clearStore()"
                >
                    Clear Local Storage
                </button>
            </div>
        </div>
    </div>
    <div class="card mb-3">
        <div class="card-header"><i class="bi bi-clipboard me-2" />Import from clibpoard</div>
        <div class="card-body">
            <p class="card-text">
                <span>Last Name | First Name | Fights | Gender | Weight | Club | Birth Date | License</span>
                <textarea
                    v-model="clipboard"
                    class="d-block w-100 mb-2"
                />
                <button
                    class="btn btn-primary"
                    @click="processClipboard()"
                >
                    Import
                </button>
            </p>
        </div>
    </div>
    <div class="card">
        <div class="card-header"><i class="bi bi-globe me-2" />Import from API</div>
        <div class="card-body">
            <p class="card-text">
                <span>id1 ; id2 ; id3 ; ...</span>
                <textarea
                    v-model="apiIds"
                    class="d-block w-100 mb-2"
                />
                <button
                    class="btn btn-primary"
                    @click="processApiImport()"
                >
                    Import
                </button>
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { Gender } from "@/types/boxing.d"
import { store } from "@/composables/fight.composable"

export default defineComponent({
    data() {
        return {
            store,
            Gender: Gender,
            // LastName	FirstName	Fights		Sex	Weight	Club	Birthdate   License
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
            apiIds: "279687;279688;279689",
        }
    },
    methods: {
        processClipboard() {
            this.store.importFromCsv(this.clipboard)
        },
        processApiImport() {
            this.store.importFromApiByIds(this.apiIds.split(";"))
        },
        clearStore() {
            localStorage.removeItem("store")
        },
        toggleDarkMode() {
            this.store.darkMode = !this.store.darkMode
        },
    },
})
</script>
