<template>
    <div class="mb-2">
        <i class="bi bi-calendar ms-2"></i>
        {{ tournamentName }} - <i>{{ tournamentDate }}</i>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { useTournamentStore } from "@/stores/tournament.store"

export default defineComponent({
    components: {},
    data() {
        return {
            tournamentStore: useTournamentStore(),
        }
    },
    computed: {
        tournamentName() {
            //if name is longer than 30 characters, truncate it
            const name = this.tournamentStore.getCurrentTournament()?.name || "No tournament selected"
            return name.length > 30 ? name.substring(0, 25) + "..." : name
        },
        tournamentDate() {
            const dateAsStr = this.tournamentStore.getCurrentTournament()?.date
            if (!dateAsStr) return null
            const date = new Date(dateAsStr)
            return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString() : null
        },
    },
    mounted() {},
    methods: {},
})
</script>
