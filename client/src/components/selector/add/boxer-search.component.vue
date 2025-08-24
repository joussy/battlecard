<template>
    <div class="mb-3">
        <label
            for="license"
            class="form-label"
        >
            Enter a license number or a name
        </label>
        <input
            v-model="license"
            class="form-control"
            type="text"
            @input="handleInput"
        />
    </div>

    <table
        v-if="filteredResults.length"
        class="table table-striped"
    >
        <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>License</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(item, index) in filteredResults"
                :key="index"
            >
                <td>
                    <button class="btn btn-s"><i class="bi bi-person-add me-1"></i></button>
                </td>
                <td>{{ item.lastName }} {{ item.firstName }}</td>
                <td>{{ item.license }}</td>
            </tr>
        </tbody>
    </table>

    <div
        v-else
        class="text-muted"
    >
        <div>No results found.</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Boxer } from "@/types/boxing"

const license = ref<string | null>(null)
const timeout = ref<ReturnType<typeof setTimeout> | null>(null)
const filteredResults = ref<Boxer[]>([])

const handleInput = () => {
    if (timeout.value) clearTimeout(timeout.value)

    timeout.value = setTimeout(() => {
        search()
    }, 400)
}

const search = () => {
    const term = license.value?.toLowerCase().trim() || ""
    if (!term) {
        filteredResults.value = []
        return
    }
    //TODO: Implement the search logic to fetch boxers based on the term
    // const boxers = await fightService.getAllBoxerAttributes()
    // filteredResults.value = boxers.filter(
    //     (item) =>
    //         item.firstName.toLowerCase().includes(term) ||
    //         item.lastName.toLowerCase().includes(term) ||
    //         item.license.toLowerCase().includes(term)
    // )
}
</script>
