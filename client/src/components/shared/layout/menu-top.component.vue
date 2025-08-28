<template>
    <nav class="nav nav-underline fixed-top bg-light-subtle d-none d-md-flex align-items-center">
        <div class="navbar-brand pt-2 ps-3 d-flex align-items-center">
            <IconComponent
                name="ring"
                class="svg-2"
            />
            <span class="ms-2 fw-bold">NomApplication</span>
        </div>
        <div class="d-flex flex-grow-1 justify-content-end align-items-center">
            <div
                v-if="uiStore.account != null"
                class="nav-item me-4"
            >
                <router-link
                    :to="{ name: 'tournaments' }"
                    class="nav-link text-dark"
                    active-class="active"
                >
                    <i class="bi bi-calendar"></i>
                    {{ $t("layout.events") }}
                </router-link>
            </div>
            <div
                v-if="uiStore.account != null && isTournamentSelected"
                class="nav-item"
            >
            </div>
            <div class="nav-item me-3">
                <router-link
                    :to="{ name: 'settings' }"
                    class="nav-link link-secondary"
                    active-class="active"
                >
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
        </div>
    </nav>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useUiStore } from "@/stores/ui.store"

const { t: $t } = useI18n()

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
    max-height: 32px;
}
</style>
