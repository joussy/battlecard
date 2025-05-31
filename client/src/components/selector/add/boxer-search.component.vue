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
                @click="selectBoxer(item)"
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

<script lang="ts">
import { Boxer } from "@/types/boxing"
import { defineComponent } from "vue"

export default defineComponent({
    emits: ["boxer-add"],
    data() {
        let ret = {
            license: null as string | null,
            timeout: null as ReturnType<typeof setTimeout> | null,
            filteredResults: [] as Boxer[],
        }
        return ret
    },
    methods: {
        handleInput() {
            if (this.timeout) clearTimeout(this.timeout)

            this.timeout = setTimeout(() => {
                this.search()
            }, 400)
        },
        search() {
            const term = this.license?.toLowerCase().trim() || ""
            if (!term) {
                this.filteredResults = []
                return
            }
            //TODO: Implement the search logic to fetch boxers based on the term
            // const boxers = await fightService.getAllBoxerAttributes()
            // this.filteredResults = boxers.filter(
            //     (item) =>
            //         item.firstName.toLowerCase().includes(term) ||
            //         item.lastName.toLowerCase().includes(term) ||
            //         item.license.toLowerCase().includes(term)
            // )
        },
        selectBoxer(boxer: Boxer) {
            // await fightService.addBoxerToTournament(boxer.id)
            this.$emit("boxer-add", boxer)
        },
    },
})
</script>
