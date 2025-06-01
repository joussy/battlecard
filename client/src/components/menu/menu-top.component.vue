<template>
    <nav class="nav nav-underline fixed-top bg-light-subtle d-none d-md-flex">
        <div class="navbar-brand pt-2 ps-3">
            <Icon
                name="ring"
                class="svg-2"
            />
        </div>
        <div class="nav-item">
            <router-link
                :to="{ name: 'settings' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Settings
            </router-link>
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
                Card
                <span class="badge rounded-pill bg-primary">{{ nbFights }}</span>
            </router-link>
        </div>
        <!-- Import menu item -->
        <div class="nav-item">
            <router-link
                :to="{ name: 'import' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Import
            </router-link>
        </div>
        <div class="nav-item dropdown ms-auto me-3">
            <div
                class="border-0 d-flex align-items-center icon-img-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i
                    v-if="!uiStore.account?.picture"
                    class="bi bi-person-circle fs-2"
                ></i>
                <img
                    v-else
                    :src="uiStore.account.picture"
                    class="rounded-circle icon-img-2 align-text-bottom"
                />
            </div>
            <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="uiStore.account">
                    <a
                        class="dropdown-item"
                        @click="logout()"
                        >Logout</a
                    >
                </li>
                <li v-else>
                    <a
                        class="dropdown-item"
                        @click="uiStore.authenticate()"
                        >Login</a
                    >
                </li>
            </ul>
        </div>
    </nav>
</template>
<script lang="ts">
import Icon from "@/components/core/icon.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useUiStore } from "@/stores/ui.store"

export default {
    components: {
        Icon: Icon,
    },
    data() {
        return {
            uiStore: useUiStore(),
            tournamentStore: useTournamentStore(),
            fightStore: useFightStore(),
        }
    },
    computed: {
        nbFights() {
            return this.fightStore.fights.length
        },
        isTournamentSelected(): boolean {
            return this.tournamentStore.currentTournamentId != null
        },
    },
    methods: {
        logout() {
            this.uiStore.logout()
            this.$router.push("settings")
        },
    },
}
</script>
