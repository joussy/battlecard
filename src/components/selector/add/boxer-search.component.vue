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
    <div class="mt-2 text-center">
        <div class="mb-2"><i> Cannot find what you want ? </i></div>
        <button class="btn btn-sm btn-light"><i class="bi bi-person-add me-1"></i>Create one</button>
    </div>
</template>

<script lang="ts">
import fightService from "@/services/fight.service"
import { BoxerAttributes } from "@/types/boxing"
import { defineComponent } from "vue"

export default defineComponent({
    emits: ["boxer-add"],
    data() {
        let ret = {
            license: null as string | null,
            timeout: null as ReturnType<typeof setTimeout> | null,
            filteredResults: [] as BoxerAttributes[],
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
        async search() {
            const term = this.license?.toLowerCase().trim() || ""
            if (!term) {
                this.filteredResults = []
                return
            }
            const boxers = await fightService.getAllBoxerAttributes()
            this.filteredResults = boxers.filter(
                (item) =>
                    item.firstName.toLowerCase().includes(term) ||
                    item.lastName.toLowerCase().includes(term) ||
                    item.license.toLowerCase().includes(term)
            )
        },
        async selectBoxer(boxer: BoxerAttributes) {
            await fightService.addBoxerToTournament(boxer.id)
            this.$emit("boxer-add", boxer)
        },
    },
})
</script>
