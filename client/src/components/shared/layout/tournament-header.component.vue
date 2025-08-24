<template>
    <div class="mb-2">
        <i class="bi bi-calendar ms-2"></i>
        {{ tournamentName }} - <i>{{ tournamentDate }}</i>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { useTournamentStore } from "@/stores/tournament.store"

const tournamentStore = useTournamentStore()

const tournamentName = computed(() => {
    //if name is longer than 30 characters, truncate it
    const name = tournamentStore.getCurrentTournament()?.name || "No tournament selected"
    return name.length > 30 ? name.substring(0, 25) + "..." : name
})

const tournamentDate = computed(() => {
    const dateAsStr = tournamentStore.getCurrentTournament()?.date
    if (!dateAsStr) return null
    const date = new Date(dateAsStr)
    return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString() : null
})
</script>
