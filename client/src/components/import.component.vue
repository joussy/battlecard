<template>
    <div>
        <h1>Import</h1>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, idx) in rows"
                    :key="row.id"
                >
                    <td v-if="editIdx !== idx">{{ row.name }}</td>
                    <td v-else>
                        <input
                            v-model="editRow.name"
                            class="form-control"
                        />
                    </td>
                    <td v-if="editIdx !== idx">{{ row.value }}</td>
                    <td v-else>
                        <input
                            v-model="editRow.value"
                            class="form-control"
                        />
                    </td>
                    <td>
                        <button
                            v-if="editIdx !== idx"
                            class="btn btn-sm btn-primary"
                            @click="startEdit(idx)"
                        >
                            Edit
                        </button>
                        <button
                            v-else
                            class="btn btn-sm btn-success"
                            @click="saveEdit(idx)"
                        >
                            Save
                        </button>
                        <button
                            v-if="editIdx === idx"
                            class="btn btn-sm btn-secondary"
                            @click="cancelEdit"
                        >
                            Cancel
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
    name: "ImportPage",
    setup() {
        const rows = ref([
            { id: 1, name: "Alpha", value: "100" },
            { id: 2, name: "Beta", value: "200" },
        ])
        const editIdx = ref<number | null>(null)
        const editRow = ref({ name: "", value: "" })

        function startEdit(idx: number) {
            editIdx.value = idx
            editRow.value = { ...rows.value[idx] }
        }
        function saveEdit(idx: number) {
            rows.value[idx] = { ...rows.value[idx], ...editRow.value }
            editIdx.value = null
        }
        function cancelEdit() {
            editIdx.value = null
        }

        return { rows, editIdx, editRow, startEdit, saveEdit, cancelEdit }
    },
})
</script>
