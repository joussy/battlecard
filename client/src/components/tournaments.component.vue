<template>
    <div class="max-width-md">
        <div class="d-flex">
            <h3 class="flex-grow-1"></h3>
            <button
                class="btn btn-outline-success mb-3 ms-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#tournamentAddOffcanvasNavbar"
            >
                <i class="bi bi-calendar-plus-fill" />
                New event
            </button>
            <TournamentAddOffcanvasComponent />
        </div>
        <div class="card mb-2">
            <div class="card-header fw-bold">Select an event</div>
            <ul
                v-for="tournament in tournamentStore.tournaments"
                :key="tournament.id"
                class="list-group list-group-flush"
            >
                <li
                    class="list-group-item d-flex"
                    :class="{
                        'selected-card-border': selectedTournamentId == tournament.id,
                    }"
                >
                    <div
                        class="flex-fill"
                        @click="setCurrentTournament(tournament)"
                    >
                        <div>
                            <span :class="{ 'fw-bold': selectedTournamentId == tournament.id }">{{
                                tournament.name
                            }}</span>
                            <span v-if="selectedTournamentId == tournament.id"> - <i>selected</i></span>
                        </div>
                        <div
                            v-if="tournament.formattedAddress"
                            class="text-muted small"
                        >
                            <span>{{ tournament.formattedAddress }}</span>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-outline-danger">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
import { Tournament } from "@/types/boxing"
import { defineComponent } from "vue"
import TournamentAddOffcanvasComponent from "@/components/tournament/tournament-add-offcanvas.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"

export default defineComponent({
    components: {
        TournamentAddOffcanvasComponent: TournamentAddOffcanvasComponent,
    },
    data() {
        return {
            tournamentStore: useTournamentStore(),
        }
    },
    computed: {
        selectedTournamentId(): string | null {
            return this.tournamentStore.currentTournamentId || null
        },
    },
    mounted() {
        this.tournamentStore.fetchTournaments()
    },
    methods: {
        setCurrentTournament(tournament: Tournament) {
            this.tournamentStore.setCurrentTournament(tournament.id)
            this.$router.push("selector")
        },
    },
})
</script>
<style scoped>
.selected-card-border {
    border-left: 10px solid var(--bs-primary);
}
.card ul:hover {
    border: 1px solid black;
}
</style>
