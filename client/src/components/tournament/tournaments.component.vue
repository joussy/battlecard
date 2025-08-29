<template>
    <div
        v-if="tournamentStore.tournaments.length == 0 && !tournamentStore.loading"
        class="max-width-md"
    >
        <TournamentsEmptyComponent @open-create-tournament="editTournament(null)" />
    </div>
    <div
        v-else
        class="max-width-md"
    >
        <div class="d-flex">
            <h3 class="flex-grow-1"></h3>
            <button
                class="btn btn-outline-success mb-3 ms-2"
                @click="editTournament(null)"
            >
                <i class="bi bi-calendar-plus-fill" />
                {{ $t("tournaments.addTournament") }}
            </button>
        </div>
        <div
            v-for="tournament in tournamentStore.tournaments"
            :key="tournament.id"
            class="card tournament-tile mb-2"
            :class="{
                'selected-card-border': selectedTournamentId == tournament.id,
            }"
        >
            <div class="card-body pb-2">
                <div>
                    <span class="tournament-name">{{ tournament.name }}</span>
                    <span v-if="selectedTournamentId == tournament.id">
                        - <i>{{ $t("tournaments.selected") }}</i>
                    </span>
                </div>
                <div>
                    <span>
                        <i class="bi bi-calendar" />
                        {{ format(tournament.date, "dd/MM/yyyy") }}</span
                    >
                </div>
                <div v-if="tournament.formattedAddress">
                    <span>
                        <i class="bi bi-geo-alt-fill" />
                        {{ tournament.formattedAddress }}</span
                    >
                </div>
                <div class="border-top mt-2 pt-2 gap-2 d-flex justify-content-end">
                    <button
                        v-if="selectedTournamentId != tournament.id"
                        class="btn btn-outline-primary btn-sm"
                        @click="setCurrentTournament(tournament)"
                    >
                        <i class="bi bi-eye" />
                        <span class="ms-1">{{ $t("tournaments.manage") }}</span>
                    </button>
                    <button
                        class="btn btn-outline-success btn-sm"
                        @click="editTournament(tournament)"
                    >
                        <i class="bi bi-pencil" />
                        <span class="d-none d-sm-inline ms-1">{{ $t("tournaments.edit") }}</span>
                    </button>
                    <button
                        class="btn btn-outline-danger btn-sm"
                        @click="deleteTournament(tournament.id)"
                    >
                        <i class="bi bi-trash" />
                        <span class="d-none d-sm-inline ms-1">{{ $t("tournaments.delete") }}</span>
                    </button>
                    <button class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-clipboard" />
                        <span class="d-none d-md-inline ms-2">{{ $t("tournaments.copyClipboard") }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <TournamentAddOffcanvasComponent
        v-model="showTournamentOffcanvas"
        :tournament="tournamentToEdit"
        @tournament-saved="onTournamentSaved"
    />
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { Tournament } from "@/types/boxing"
import TournamentAddOffcanvasComponent from "@/components/tournament/tournament-add-offcanvas.component.vue"
import TournamentsEmptyComponent from "@/components/tournament/tournaments-empty.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"
import { format } from "date-fns"
const showTournamentOffcanvas = ref(false)
import { TournamentOpenApi } from "@/api"
import { useI18n } from "vue-i18n"

const router = useRouter()
const tournamentStore = useTournamentStore()
const { t: $t } = useI18n()

const tournamentToEdit = ref<Tournament | null>(null)

const selectedTournamentId = computed((): string | null => {
    return tournamentStore.currentTournamentId || null
})

onMounted(() => {
    tournamentStore.fetchTournaments()
})

const setCurrentTournament = (tournament: Tournament) => {
    tournamentStore.setCurrentTournament(tournament.id)
    router.push("selector")
}

const editTournament = (tournament: Tournament | null) => {
    tournamentToEdit.value = tournament
    showTournamentOffcanvas.value = true
}

const onTournamentSaved = async (tournamentId: string) => {
    await tournamentStore.fetchTournaments()
    tournamentToEdit.value = null
    if (selectedTournamentId.value == tournamentId) {
        tournamentStore.setCurrentTournament(tournamentId)
    }
}
const deleteTournament = async (tournamentId: string) => {
    if (confirm($t("tournaments.confirmDelete"))) {
        await TournamentOpenApi.delete({ path: { id: tournamentId } })
        if (selectedTournamentId.value == tournamentId) {
            tournamentStore.setCurrentTournament()
            tournamentStore.fetchTournaments()
        }
    }
}
</script>
<style scoped>
.selected-card-border {
    border-left: 10px solid var(--bs-primary);
}
.card ul:hover {
    border: 1px solid black;
}
.tournament-name {
    font-size: large;
}
.tournament-tile {
    min-height: 90px;
}
</style>
