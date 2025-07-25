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
                Create
            </button>
            <TournamentAddOffcanvasComponent />
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
                    :class="{ 'text-bg-secondary': selectedTournamentId == tournament.id }"
                >
                    <div
                        class="flex-fill"
                        @click="setCurrentTournament(tournament)"
                    >
                        <div class="fw-bold">{{ tournament.name }}</div>
                        <div class="text-muted small" v-if="tournament.address || tournament.city || tournament.zipCode">
                            <span v-if="tournament.address">{{ tournament.address }}</span>
                            <span v-if="tournament.address && (tournament.zipCode || tournament.city)">, </span>
                            <span v-if="tournament.zipCode">{{ tournament.zipCode }}</span>
                            <span v-if="tournament.zipCode && tournament.city"> </span>
                            <span v-if="tournament.city">{{ tournament.city }}</span>
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
<style lang="scss"></style>
