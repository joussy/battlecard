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
                class="rounded-circle icon-img-2 align-text-bottom"
            />
            <div>Settings</div>
        </router-link>
        <router-link
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
            :to="{ name: 'card' }"
            class="nav-link text-center"
            active-class="active"
        >
            <Icon
                name="headgear"
                class="svg-2 mt-1"
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
</template>
<script lang="ts">
import Icon from "@/components/core/icon.component.vue"
import { userStore } from "@/composables/user.composable"

export default {
    components: {
        Icon,
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
