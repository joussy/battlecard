<template>
    <nav
        class="bottom-menu d-md-none d-flex justify-content-around z-2 fixed-bottom border-top shadow-sm bg-light-subtle pb-2"
    >
        <router-link
            v-if="uiStore.account != null"
            :to="{ name: 'tournaments' }"
            class="nav-link text-center"
            :class="{ active: $route.path.startsWith('/tournaments') }"
        >
            <Icon
                name="tournament"
                :style="{ height: '38px' }"
            ></Icon>
            <div>Tournament</div>
        </router-link>
        <router-link
            v-if="uiStore.account && tournamentStore.currentTournamentId"
            :to="{ name: 'selector' }"
            class="nav-link text-center"
            :class="{ active: $route.path.startsWith('/selector') }"
        >
            <Icon
                name="group-of-people"
                :style="{ height: '38px' }"
            ></Icon>
            <div>Selector</div>
        </router-link>
        <router-link
            v-if="uiStore.account && tournamentStore.currentTournamentId"
            :to="{ name: 'card' }"
            class="nav-link text-center position-relative"
            active-class="active"
        >
            <span class="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-primary">
                {{ getNbFights() }}
            </span>
            <Icon
                name="headgear"
                class="svg-2 mt-1"
            ></Icon>
            <div>Card</div>
        </router-link>
        <router-link
            :to="{ name: 'settings' }"
            class="nav-link text-center"
            active-class="active"
        >
            <i
                v-if="!uiStore.account"
                class="bi bi-gear-fill fs-2"
            ></i>
            <i
                v-else-if="!uiStore.account.picture"
                class="bi bi-person-circle fs-2"
            ></i>
            <img
                v-else
                :src="uiStore.account.picture"
                class="rounded-circle icon-img-2 align-text-bottom"
            />
            <div>Settings</div>
        </router-link>
    </nav>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import Icon from "@/components/shared/core/icon.component.vue"
import { useBoxerStore } from "@/stores/boxer.store"
import { useFightStore } from "@/stores/fight.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useUiStore } from "@/stores/ui.store"

const router = useRouter()
const uiStore = useUiStore()
const boxerStore = useBoxerStore()
const fightStore = useFightStore()
const tournamentStore = useTournamentStore()

const getNbFights = () => {
    return fightStore.fights.length
}

const logout = () => {
    uiStore.logout()
    router.push("settings")
}
</script>
<style>
.bottom-menu .nav-link {
    color: #6c757d;
    font-size: 14px;
}
.bottom-menu .nav-link.active {
    color: #007bff;
}
.icon-img-2 {
    width: 30px; /* Matches svg-2 */
    height: 30px;
    margin-top: 5px;
    display: inline-block;
}
</style>
