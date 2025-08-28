<template>
    <div class="empty-tournaments d-flex flex-column align-items-center justify-content-center text-center">
        <h2 class="mt-3">{{ $t("tournaments.welcome") }}</h2>
        <p class="lead text-muted mb-4">
            {{ $t("tournaments.noTournamentsYet") }}
        </p>

        <div class="mx-auto text-center text-md-start mb-4 px-2 px-md-0 welcome-list">
            <p class="text-muted mb-2">
                <strong>{{ $t("tournaments.howToGenerateFightCard") }}</strong>
            </p>
            <ol class="list-group list-group-numbered mb-0">
                <li class="list-group-item">
                    <span class="fw-bold text-center text-md-start">{{ $t("tournaments.createTournament") }}</span>
                    <div class="text-muted small text-center text-md-start">
                        {{ $t("tournaments.createTournamentDescription") }}
                    </div>
                </li>
                <li class="list-group-item">
                    <span class="fw-bold text-center text-md-start">{{ $t("tournaments.openSelector") }}</span>
                    <div class="text-muted small text-center text-md-start">
                        {{ $t("tournaments.openSelectorDescription") }}
                    </div>
                </li>
                <li class="list-group-item">
                    <span class="fw-bold text-center text-md-start">{{ $t("tournaments.buildFightCard") }}</span>
                    <div class="text-muted small text-center text-md-start">
                        {{ $t("tournaments.buildFightCardDescription") }}
                    </div>
                </li>
            </ol>
        </div>

        <div>
            <button
                class="btn btn-success btn-lg"
                data-bs-toggle="offcanvas"
                data-bs-target="#tournamentAddOffcanvasNavbar"
                @click="$emit('openCreateTournament')"
            >
                <i class="bi bi-plus-lg"></i>
                <span class="ms-2">{{ $t("tournaments.createFirstTournament") }}</span>
            </button>
            <div class="m-3">
                <i>{{ $t("tournaments.discoverPrompt") }}</i>
            </div>
            <button class="btn btn-warning btn-lg">
                <i class="bi bi-plus-lg"></i>
                <span
                    class="ms-2"
                    @click="createFakeTournament"
                >
                    {{ $t("tournaments.createFakeTournamentCTA") }}
                </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { TournamentOpenApi } from "@/api"
import { useTournamentStore } from "@/stores/tournament.store"
import { useRouter } from "vue-router"

const router = useRouter()
const { t: $t } = useI18n()
const tournamentStore = useTournamentStore()

defineEmits<{
    openCreateTournament: void
}>()

const createFakeTournament = async () => {
    const tournament = await TournamentOpenApi.createFake()
    tournamentStore.setCurrentTournament(tournament?.id)
    router.push("selector")
}
</script>

<style scoped>
.welcome-list {
    max-width: 400px;
}
.empty-tournaments i {
    opacity: 0.85;
}
</style>
