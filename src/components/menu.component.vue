<template>
    <nav
        class="bottom-menu d-md-none d-flex justify-content-around z-2 fixed-bottom border-top shadow-sm bg-light-subtle pb-2"
    >
        <router-link
            :to="{ name: 'settings' }"
            class="nav-link text-center"
            active-class="active"
        >
            <i
                v-if="!userStore.account"
                class="bi bi-gear-fill fs-2"
            ></i>
            <i
                v-else-if="!userStore.account.avatar"
                class="bi bi-person-circle fs-2"
            ></i>
            <img
                v-else
                :src="userStore.account.avatar"
                class="rounded-circle icon-img-2 align-text-bottom mt-2 mb-1"
            />
            <div>Settings</div>
        </router-link>
        <router-link
            :to="{ name: 'selector' }"
            class="nav-link text-center"
            active-class="active"
        >
            <Icon
                name="group-of-people"
                class="svg-2 mt-2 pb-1"
            ></Icon>
            <div>Selector</div>
        </router-link>
        <router-link
            :to="{ name: 'card' }"
            class="nav-link text-center"
            active-class="active"
        >
            <Icon
                name="headgear"
                class="svg-2 mt-2 pb-1"
            ></Icon>
            <div>Card</div>
        </router-link>
        <router-link
            :to="{ name: 'metrics' }"
            class="nav-link text-center"
            active-class="active"
        >
            <i class="bi bi-bar-chart-fill fs-2"></i>
            <div>Metrics</div>
        </router-link>
    </nav>
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
