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
        <div class="nav-item">
            <router-link
                :to="{ name: 'selector' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Selector
            </router-link>
        </div>
        <div class="nav-item">
            <router-link
                :to="{ name: 'card' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Card
            </router-link>
        </div>
        <div class="nav-item">
            <router-link
                :to="{ name: 'metrics' }"
                class="nav-link link-secondary"
                active-class="active"
            >
                Metrics
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
                        @click="userStore.logout()"
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

export default {
    components: {
        Icon: Icon,
    },
    data() {
        return {
            userStore,
        }
    },
}
</script>
