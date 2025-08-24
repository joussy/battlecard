<template>
    <nav class="nav nav-underline fixed-top bg-light-subtle d-none d-md-flex">
        <div class="navbar-brand pt-2 ps-3">
            <IconComponent
                name="ring"
                class="svg-2"
            />
        </div>
        <div
            v-if="uiStore.account != null"
            class="nav-item"
        >
            <router-link
                :to="{ name: 'tournaments' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                <i class="bi bi-calendar"></i>
                Events
            </router-link>
        </div>
        <div
            v-if="uiStore.account != null && isTournamentSelected"
            class="nav-item"
        >
            <router-link
                :to="{ name: 'selector' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                <IconComponent
                    name="group-of-people"
                    class="user-logo"
                />
                Selector
            </router-link>
        </div>
        <div
            v-if="uiStore.account != null && isTournamentSelected"
            class="nav-item"
        >
            <router-link
                :to="{ name: 'card' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                <IconComponent
                    name="headgear"
                    class="user-logo"
                />
                Card
                <span class="badge rounded-pill bg-primary">{{ nbFights }}</span>
            </router-link>
        </div>
        <div class="flex-grow-1"></div>
        <div class="nav-item me-3">
            <router-link
                :to="{ name: 'settings' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                <span class="me-3">Settings</span>
                <i
                    v-if="!uiStore.account?.picture"
                    class="bi bi-person-circle user-logo"
                ></i>
                <img
                    v-else
                    :src="uiStore.account.picture"
                    class="rounded-circle align-text-bottom user-logo"
                />
            </router-link>
        </div>
    </nav>
</template>
<script setup lang="ts">
import { computed } from "vue"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useUiStore } from "@/stores/ui.store"

const uiStore = useUiStore()
const tournamentStore = useTournamentStore()
const fightStore = useFightStore()

const nbFights = computed(() => {
    return fightStore.fights.length
})

const isTournamentSelected = computed((): boolean => {
    return !!tournamentStore.currentTournamentId
})
</script>
<style scoped>
.user-logo {
    /* width: 30px; */
    max-height: 18px;
}
</style>
