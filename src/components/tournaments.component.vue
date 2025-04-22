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
        </div>
        <div class="card mb-2">
            <div class="card-header">Select an event</div>
            <ul
                v-for="tournament in fightStore.tournaments"
                class="list-group list-group-flush"
            >
                <li
                    class="list-group-item"
                    @click="setCurrentTournament(tournament)"
                >
                    {{ fightStore.currentTournament?.id == tournament.id ? "X " : "" }}
                    {{ tournament.name }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
import fightService from "@/services/fight.service"
import { Tournament } from "@/types/boxing"
import { defineComponent } from "vue"

export default defineComponent({
    data() {
        return {
            fightStore: fightService.store(),
        }
    },
    mounted() {},
    methods: {
        setCurrentTournament(tournament: Tournament) {
            fightService.setCurrentTournament(tournament.id)
        },
    },
})
</script>
<style lang="scss"></style>
