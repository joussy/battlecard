<template>
    <div>
        <button
            v-if="addRowAllowed"
            class="btn btn-success mb-2"
            type="button"
            @click="addRow"
        >
            <i class="bi bi-plus-lg"></i> Add Row
        </button>
        <div class="overflow-auto">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th
                            v-for="col in columns"
                            :key="col.key"
                        >
                            {{ col.label }}
                        </th>
                        <th style="width: 120px"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, idx) in rows"
                        :key="idx"
                    >
                        <template
                            v-for="col in columns"
                            :key="col.key"
                        >
                            <td
                                v-if="editIdx !== idx"
                                :data-bs-toggle="getErrorMessage(idx, col.key) ? 'tooltip' : undefined"
                                :data-bs-title="getErrorMessage(idx, col.key)"
                                :class="{ 'has-error': getErrorMessage(idx, col.key) }"
                                style="cursor: pointer"
                            >
                                <!--Display a cell, view mode-->
                                <span
                                    class="ms-2"
                                    :class="{ 'text-danger': getErrorMessage(idx, col.key) }"
                                    tabindex="0"
                                >
                                    {{ (row as any)[col.key] }}
                                </span>
                            </td>
                            <td
                                v-else
                                :class="{ 'has-error': getErrorMessage(idx, col.key) }"
                            >
                                <!--Display a cell, edit mode-->
                                <template v-if="col.type === 'select'">
                                    <select
                                        v-model="editRow[col.key]"
                                        class="form-control"
                                    >
                                        <option
                                            v-for="opt in col.options"
                                            :key="opt.value"
                                            :value="opt.value"
                                        >
                                            {{ opt.label }}
                                        </option>
                                    </select>
                                </template>
                                <template v-else-if="col.type === 'date'">
                                    <input
                                        v-model="editRow[col.key]"
                                        class="form-control"
                                        type="date"
                                    />
                                </template>
                                <template v-else-if="col.type === 'number'">
                                    <input
                                        v-model="editRow[col.key]"
                                        class="form-control"
                                        type="number"
                                        min="0"
                                    />
                                </template>
                                <template v-else>
                                    <input
                                        v-model="editRow[col.key]"
                                        class="form-control"
                                    />
                                </template>
                                <!-- <i class="bi bi-exclamation-circle"></i> -->
                            </td>
                        </template>
                        <td>
                            <div class="d-flex gap-1 justify-content-center">
                                <button
                                    v-if="editIdx !== idx"
                                    class="btn btn-sm btn-primary"
                                    title="Edit"
                                    @click="startEdit(idx)"
                                >
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button
                                    v-if="editIdx !== idx"
                                    class="btn btn-sm btn-danger"
                                    title="Edit"
                                    @click="deleteRow(idx)"
                                >
                                    <i class="bi bi-trash"></i>
                                </button>
                                <template v-else>
                                    <button
                                        class="btn btn-sm btn-success"
                                        title="Save"
                                        @click="saveEdit(idx)"
                                    >
                                        <i class="bi bi-check-lg"></i>
                                    </button>
                                    <button
                                        class="btn btn-sm btn-secondary"
                                        title="Cancel"
                                        @click="cancelEdit"
                                    >
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </template>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button
            class="btn btn-warning mt-3"
            type="button"
            :disabled="!canVerify"
            @click="importBoxers(true)"
        >
            <i class="bi bi-check2-circle"></i>
            Verify
        </button>
        <button
            class="btn btn-primary mt-3 ms-2"
            type="button"
            :disabled="!canImport"
            @click="importBoxers(false)"
        >
            <i class="bi bi-cloud-arrow-up"></i>
            Import
        </button>
        <div
            v-if="importMessage?.length > 0"
            class="mt-2"
        >
            {{ importMessage }}
        </div>
    </div>
</template>

<script lang="ts">
import { nextTick, PropType, watch } from "vue"
import bootstrapInstance from "@/utils/bootstrap.singleton"
import { Gender, ImportBoxerDto, ImportOpenApi } from "@/api"
import { useTournamentStore } from "@/stores/tournament.store"

export default {
    props: {
        inputBoxers: {
            type: Array as PropType<ImportBoxerDto[]>,
            required: true,
        },
        addRowAllowed: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            columns: [
                { key: "lastName", label: "Last Name", type: "text" },
                { key: "firstName", label: "First Name", type: "text" },
                { key: "fightRecord", label: "Fights", type: "number" },
                {
                    key: "gender",
                    label: "Gender",
                    type: "select",
                    options: [
                        { value: Gender.MALE, label: "M" },
                        { value: Gender.FEMALE, label: "F" },
                    ],
                },
                { key: "weight", label: "Weight (kg)", type: "number" },
                { key: "club", label: "Club", type: "text" },
                { key: "birthDate", label: "Birth Date", type: "date" },
                { key: "license", label: "License", type: "text" },
            ],
            rows: this.inputBoxers as ImportBoxerDto[],
            editIdx: null as number | null,
            editRow: {
                lastName: "",
                firstName: "",
                fights: 0,
                gender: Gender.MALE,
                weight: "",
                club: "",
                birthDate: "",
                license: "",
            } as Record<string, string | number>,
            dirty: true,
            importMessage: "",
            errors: [] as Array<{ row: number; field: string; message: string }>,
            tournamentStore: useTournamentStore(),
        }
    },
    computed: {
        canImport(): boolean {
            // Check if there are any rows with errors
            return this.errors.length === 0 && this.rows.length > 0 && !this.dirty
        },
        canVerify(): boolean {
            // Check if there are any rows with errors
            return !this.canImport && this.rows.length > 0
        },
    },
    mounted() {
        this.enableTooltips()
        watch(
            () => this.dirty,
            (newValue) => {
                if (newValue) {
                    this.importMessage = ""
                }
            }
        )
        watch(
            () => this.inputBoxers,
            (newValue) => {
                this.rows = [...newValue] as ImportBoxerDto[]
                this.errors = []
                this.dirty = true
                nextTick(() => this.enableTooltips())
            },
            { immediate: true }
        )
    },
    methods: {
        startEdit(idx: number) {
            this.editIdx = idx
            this.editRow = { ...this.rows[idx] }
        },
        saveEdit(idx: number) {
            this.rows[idx] = { ...this.rows[idx], ...this.editRow }
            this.editIdx = null
            this.dirty = true
            nextTick(() => this.enableTooltips())
        },
        cancelEdit() {
            this.editIdx = null
        },
        addRow() {
            this.rows.push({
                lastName: "",
                firstName: "",
                weight: 0,
                club: "",
                birthDate: "",
                license: "",
                fightRecord: 0,
            })
            this.editIdx = this.rows.length - 1
            this.editRow = { ...this.rows[this.rows.length - 1] }
            this.dirty = true
            nextTick(() => this.enableTooltips())
        },
        deleteRow(idx: number) {
            this.rows.splice(idx, 1)
            this.dirty = true
            nextTick(() => this.enableTooltips())
        },
        enableTooltips() {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.forEach((el: Element) => {
                if (bootstrapInstance?.bootstrap?.Tooltip) {
                    new bootstrapInstance.bootstrap.Tooltip(el)
                }
            })
        },
        async importBoxers(verifyOnly: boolean) {
            if (!this.tournamentStore.currentTournamentId) {
                this.importMessage = "Please select a tournament first."
                return
            }
            if (this.editIdx !== null) {
                this.saveEdit(this.editIdx)
            }
            const boxers = this.rows.map((row: Record<string, string | number>) => {
                return {
                    lastName: row.lastName as string,
                    firstName: row.firstName as string,
                    birthDate: row.birthDate as string,
                    club: row.club as string,
                    gender: row.gender as Gender,
                    weight: row.weight as number,
                    license: row.license as string,
                    fightRecord: row.fightRecord as number,
                } as ImportBoxerDto
            })

            const importResult = await ImportOpenApi.importBoxers({
                body: {
                    boxers,
                    tournamentId: this.tournamentStore.currentTournamentId,
                    dry: verifyOnly,
                },
            })
            this.importMessage = ""
            if (!importResult) {
                this.importMessage = "Error during import. Please try again."
                return
            }
            if (importResult.message) this.importMessage = importResult.message
            else if (importResult.errors.length > 0) {
                this.importMessage = `Found ${importResult.errors.length} errors. Fix them before importing.`
            } else if (importResult.success) {
                this.importMessage = "Verification successful, no errors found. You can import now."
            }
            this.errors = importResult.errors
            console.log("Verification result:", importResult)
            this.dirty = false
            nextTick(() => this.enableTooltips())
        },
        getErrorMessage(lineIndex: number, colKey: string): string | undefined {
            const error = this.errors.find((e) => e.row === lineIndex && e.field === colKey)
            return error ? error.message : undefined
        },
    },
}
</script>

<style scoped>
/* Add red border to table cells with error */
td.has-error {
    border: 2px solid #dc3545 !important;
}
</style>
