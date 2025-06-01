<template>
    <div>
        <h1>Import</h1>
        <button
            class="btn btn-success mb-2"
            type="button"
            @click="addRow"
        >
            <i class="bi bi-plus-lg"></i> Add Row
        </button>
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
                    :key="row.id"
                >
                    <template
                        v-for="col in columns"
                        :key="col.key"
                    >
                        <td
                            v-if="editIdx !== idx"
                            :class="col.error ? { 'has-error': row.error } : ''"
                        >
                            <span
                                class="ms-2"
                                :class="{ 'text-danger': col.error && row.error && editIdx !== idx }"
                                tabindex="0"
                                data-bs-toggle="tooltip"
                                :title="row.error"
                                style="cursor: pointer"
                            >
                                {{ row[col.key] }}
                            </span>
                        </td>
                        <td
                            v-else
                            :class="col.error ? { 'has-error': row.error } : ''"
                        >
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
        <button
            class="btn btn-warning mt-3"
            type="button"
            @click="verify"
        >
            Verify
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from "vue"
import { createPopper } from "@popperjs/core"
import bootstrapInstance from "@/utils/bootstrap.singleton"

export default defineComponent({
    name: "ImportPage",
    setup() {
        // Define columns as an array of objects
        const columns = [
            { key: "lastName", label: "Last Name", type: "text" },
            { key: "firstName", label: "First Name", type: "text" },
            { key: "fights", label: "Fights", type: "number" },
            {
                key: "gender",
                label: "Gender",
                type: "select",
                options: [
                    { value: "M", label: "M" },
                    { value: "F", label: "F" },
                ],
            },
            { key: "weight", label: "Weight", type: "text" },
            { key: "club", label: "Club", type: "text" },
            { key: "birthDate", label: "Birth Date", type: "date" },
            { key: "license", label: "License", type: "text", error: true },
        ]
        type RowType = {
            id?: number
            lastName: string
            firstName: string
            fights: number
            gender: string
            weight: string
            club: string
            birthDate: string
            license: string
            error?: string
            [key: string]: string | number | undefined
        }

        const rows = ref<RowType[]>([
            {
                id: 1,
                lastName: "Smith",
                firstName: "John",
                fights: 5,
                gender: "M",
                weight: "75kg",
                club: "Red Dragons",
                birthDate: "2000-01-01",
                license: "A12345",
                error: "",
            },
            {
                id: 2,
                lastName: "Doe",
                firstName: "Jane",
                fights: 3,
                gender: "F",
                weight: "60kg",
                club: "Blue Tigers",
                birthDate: "2002-05-15",
                license: "B67890",
                error: "",
            },
            {
                id: 3,
                lastName: "Brown",
                firstName: "Charlie",
                fights: 2,
                gender: "M",
                weight: "68kg",
                club: "Green Bears",
                birthDate: "2001-09-10",
                license: "A12345", // duplicate license
                error: "",
            },
            {
                id: 4,
                lastName: "White",
                firstName: "Emily",
                fights: 4,
                gender: "F",
                weight: "55kg",
                club: "Yellow Foxes",
                birthDate: "2003-12-22",
                license: "C54321",
                error: "",
            },
        ])
        const editIdx = ref<number | null>(null)
        const editRow = ref<RowType>({
            lastName: "",
            firstName: "",
            fights: 0,
            gender: "M",
            weight: "",
            club: "",
            birthDate: "",
            license: "",
        })

        function startEdit(idx: number) {
            editIdx.value = idx
            editRow.value = { ...rows.value[idx] }
        }
        function saveEdit(idx: number) {
            rows.value[idx] = { ...rows.value[idx], ...editRow.value }
            editIdx.value = null
            nextTick(() => enableTooltips()) // Re-enable tooltips after editing
        }
        function cancelEdit() {
            editIdx.value = null
        }
        // Fix newId calculation to handle undefined id
        function addRow() {
            const ids = rows.value.map((r) => r.id ?? 0)
            const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1
            rows.value.push({
                id: newId,
                lastName: "",
                firstName: "",
                fights: 0,
                gender: "M",
                weight: "",
                club: "",
                birthDate: "",
                license: "",
                error: "",
            })
            editIdx.value = rows.value.length - 1
            editRow.value = { ...rows.value[rows.value.length - 1] }
            nextTick(() => enableTooltips())
        }

        function enableTooltips() {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.forEach((el) => {
                if (bootstrapInstance?.bootstrap?.Tooltip) {
                    new bootstrapInstance.bootstrap.Tooltip(el)
                }
            })
        }

        function verify() {
            // Clear previous errors
            rows.value.forEach((row) => {
                row.error = ""
            })
            // Count licenses
            const licenseCount: Record<string, number> = {}
            rows.value.forEach((row) => {
                if (row.license) {
                    licenseCount[row.license] = (licenseCount[row.license] || 0) + 1
                }
            })
            // Mark duplicates
            rows.value.forEach((row) => {
                if (row.license && licenseCount[row.license] > 1) {
                    row.error = "Duplicate license"
                }
            })
            nextTick(() => enableTooltips())
        }

        onMounted(() => {
            enableTooltips()
        })

        return { rows, editIdx, editRow, startEdit, saveEdit, cancelEdit, verify, addRow, columns }
    },
})
</script>

<style scoped>
/* Add red border to table cells with error */
td.has-error {
    border: 2px solid #dc3545 !important;
}
</style>
