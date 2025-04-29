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
            v-if="userStore.account != null"
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
            v-if="userStore.account != null && fightStore.currentTournament != null"
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
            v-if="userStore.account != null && fightStore.currentTournament != null"
            class="nav-item"
        >
            <router-link
                :to="{ name: 'card' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Card
                <span class="badge rounded-pill bg-primary">{{ getNbFights() }}</span>
            </router-link>
        </div>
        <div
            v-if="userStore.authenticationAvailable"
            class="nav-item dropdown ms-auto me-3"
        >
            <div
                class="border-0 d-flex align-items-center icon-img-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i
                    v-if="!userStore.account?.avatar"
                    class="bi bi-person-circle fs-2"
                ></i>
                <img
                    v-else
                    :src="userStore.account.avatar"
                    class="rounded-circle icon-img-2 align-text-bottom"
                />
            </div>
            <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="userStore.account">
                    <a
                        class="dropdown-item"
                        @click="logout()"
                        >Logout</a
                    >
                </li>
                <li v-else>
                    <a
                        class="dropdown-item"
                        @click="userStore.authenticate()"
                        >Login</a
                    >
                </li>
            </ul>
        </div>
    </nav>
</template>
<script lang="ts">
import Icon from "@/components/core/icon.component.vue"
import { userStore } from "@/composables/user.composable"
import fightService from "@/services/fight.service"

export default {
    components: {
        Icon: Icon,
    },
    data() {
        return {
            userStore,
            fightStore: fightService.store(),
        }
    },
    methods: {
        getNbFights() {
            return fightService.store().fightCard.length
        },
        logout() {
            userStore.logout()
            this.$router.push("settings")
        },
    },
}
</script>
