<template>
    <div class="empty-tournaments d-flex flex-column align-items-center justify-content-center text-center">
        <h2 class="mt-3">Welcome!</h2>
        <p class="lead text-muted mb-4">
            You don't have any tournaments yet. Create your first tournament to get started.
        </p>

        <div class="mx-auto text-center text-md-start mb-4 px-2 px-md-0 welcome-list">
            <p class="text-muted mb-2"><strong>How to generate a fight card</strong></p>
            <ol class="list-group list-group-numbered mb-0">
                <li class="list-group-item">
                    <span class="fw-bold text-center text-md-start">Create a tournament</span>
                    <div class="text-muted small text-center text-md-start">
                        This is the container for your event and fights.
                    </div>
                </li>
                <li class="list-group-item">
                    <span class="fw-bold text-center text-md-start">Open the selector</span>
                    <div class="text-muted small text-center text-md-start">
                        Add boxers to the tournament so they become participants.
                    </div>
                </li>
                <li class="list-group-item">
                    <span class="fw-bold text-center text-md-start">Build the fight card</span>
                    <div class="text-muted small text-center text-md-start">
                        Use the fight card view to create matchups and schedule fights between added boxers.
                    </div>
                </li>
            </ol>
        </div>

        <div>
            <button
                class="btn btn-success btn-lg"
                data-bs-toggle="offcanvas"
                data-bs-target="#tournamentAddOffcanvasNavbar"
                @click="$emit('create')"
            >
                <i class="bi bi-plus-lg"></i>
                <span class="ms-2">Create your first tournament</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    name: "TournamentsEmptyComponent",
    emits: ["create"],
})
</script>

<style scoped>
.welcome-list {
    max-width: 400px;
}
.empty-tournaments i {
    opacity: 0.85;
}
</style>
