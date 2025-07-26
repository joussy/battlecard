<template>
    <div class="max-width-md">
        <div class="d-flex">
            <h3 class="flex-grow-1"></h3>
            <button
                class="btn btn-outline-success mb-3 ms-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#tournamentAddOffcanvasNavbar"
                @click="setTournamentToEdit(null)"
            >
                <i class="bi bi-calendar-plus-fill" />
                New event
            </button>
            <TournamentAddOffcanvasComponent
                :tournament="tournamentToEdit"
                @tournament-saved="onTournamentSaved"
            />
        </div>
        <div class="card mb-2">
            <div class="card-header">Select an event</div>
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
                            <span class="tournament-title">{{ tournament.name }}</span>
                            <span v-if="selectedTournamentId == tournament.id"> - <i>selected</i></span>
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
                    </div>
                    <div>
                        <button
                            class="btn btn-outline-success"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#tournamentAddOffcanvasNavbar"
                            @click="setTournamentToEdit(tournament)"
                        >
                            <i class="bi bi-pencil"></i>
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
import { format } from "date-fns"

export default defineComponent({
    components: {
        TournamentAddOffcanvasComponent: TournamentAddOffcanvasComponent,
    },
    data() {
        return {
            tournamentStore: useTournamentStore(),
            tournamentToEdit: null as Tournament | null,
            format,
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
        setTournamentToEdit(tournament: Tournament | null) {
            this.tournamentToEdit = tournament
        },
        async onTournamentSaved(tournament: Tournament) {
            await this.tournamentStore.fetchTournaments()
            this.setTournamentToEdit(null)
            if (this.selectedTournamentId == tournament.id) {
                this.tournamentStore.setCurrentTournament(tournament.id)
            }
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
.tournament-title {
    font-size: large;
}
</style>
