<template>
    <div class="max-width-md">
        <div
            v-if="userStore.authenticationAvailable"
            class="card mb-3"
        >
            <div class="card-header"><i class="bi bi-person me-2" />Account</div>
            <div class="card-body">
                <button
                    v-if="!userStore.account"
                    class="btn btn-warning ms-2"
                    @click="signIn()"
                >
                    Sign In
                </button>
                <div
                    v-else
                    class="d-flex flex-row align-items-center"
                >
                    <img
                        v-if="userStore.account.avatar"
                        :src="userStore.account.avatar"
                        class="rounded-circle me-2 avatar-icon"
                        alt="User Avatar"
                    />
                    <i
                        v-else
                        class="bi bi-person-circle me-2"
                        :style="{ 'font-size': '2.5rem' }"
                    ></i>
                    <div class="flex-grow-1">
                        <strong>{{ userStore.account?.name }}</strong>
                        <div
                            class="text-muted"
                            style="font-size: 0.85rem"
                        >
                            {{ userStore.account?.email }}
                        </div>
                    </div>
                    <button
                        class="btn btn-danger"
                        alt="Sign out"
                        @click="logout()"
                    >
                        <i class="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-header"><i class="bi bi-gear me-2" />General</div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="form-label">Theme</div>
                    <div
                        class="btn-group"
                        role="group"
                        aria-label="Basic radio toggle button group"
                    >
                        <input
                            id="btnradio1"
                            type="radio"
                            class="btn-check"
                            name="btnradio"
                            autocomplete="off"
                            :checked="uiStore.theme == 'auto'"
                            @click="setTheme('auto')"
                        />
                        <label
                            class="btn btn-outline-primary"
                            for="btnradio1"
                            >Auto</label
                        >

                        <input
                            id="btnradio2"
                            type="radio"
                            class="btn-check"
                            name="btnradio"
                            autocomplete="off"
                            :checked="uiStore.theme == 'light'"
                            @click="setTheme('light')"
                        />
                        <label
                            class="btn btn-outline-primary"
                            for="btnradio2"
                            >Light</label
                        >

                        <input
                            id="btnradio3"
                            type="radio"
                            class="btn-check"
                            name="btnradio"
                            autocomplete="off"
                            :checked="uiStore.theme == 'dark'"
                            @click="setTheme('dark')"
                        />
                        <label
                            class="btn btn-outline-primary"
                            for="btnradio3"
                            >Dark</label
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { Gender } from "@/types/boxing.d"
import { userStore } from "@/composables/user.composable"
import fightService from "@/services/fight.service"
import { uiStore } from "@/composables/ui.composable"
import { UiTheme } from "@/types/ui"

export default defineComponent({
    data() {
        return {
            store: fightService.store(),
            userStore,
            uiStore,
            Gender: Gender,
        }
    },
    async mounted() {
        const response = await fetch("/api/hello", {
            method: "GET",
        })
        console.log("hello")
    },
    methods: {
        setTheme(mode: UiTheme) {
            uiStore.theme = mode
        },
        async signIn() {
            await userStore.authenticate()
        },
        logout() {
            userStore.logout()
        },
    },
})
</script>
<style lang="scss">
.avatar-icon {
    width: 40px;
    height: 40px;
}
</style>
