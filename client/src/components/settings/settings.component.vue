<template>
    <div class="max-width-md">
        <div class="card mb-3">
            <div class="card-header"><i class="bi bi-person me-2" />Account</div>
            <div class="card-body">
                <button
                    v-if="!uiStore.account"
                    class="btn btn-warning ms-2"
                    @click="signInWithGoogle()"
                >
                    <i class="bi bi-google me-2" />Sign In with Google
                </button>
                <div
                    v-else
                    class="d-flex flex-row align-items-center"
                >
                    <img
                        v-if="uiStore.account.picture"
                        :src="uiStore.account.picture"
                        class="rounded-circle me-2 avatar-icon"
                        alt="User Avatar"
                    />
                    <i
                        v-else
                        class="bi bi-person-circle me-2"
                        :style="{ 'font-size': '2.5rem' }"
                    />
                    <div class="flex-grow-1">
                        <strong>{{ uiStore.account?.name }}</strong>
                        <div
                            class="text-muted"
                            style="font-size: 0.85rem"
                        >
                            {{ uiStore.account?.email }}
                        </div>
                    </div>
                    <button
                        class="btn btn-danger"
                        alt="Sign out"
                        @click="logout()"
                    >
                        <i class="bi bi-box-arrow-right" />
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
import { UiTheme } from "@/types/ui"
import { useUiStore } from "@/stores/ui.store"
import { Gender } from "@/api"

export default defineComponent({
    data() {
        return {
            uiStore: useUiStore(),
            Gender: Gender,
        }
    },
    async mounted() {
        // Listen for token from popup
        window.addEventListener("message", async (event) => {
            if (event.data && event.data.token) {
                this.uiStore.jwtToken = event.data.token
                await this.uiStore.setTokenAndFetchUser()
            }
        })
        // (Optional: handle token in URL for fallback)
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")
        if (token) {
            await this.uiStore.setTokenAndFetchUser()
            window.history.replaceState({}, document.title, window.location.pathname)
        }
    },
    methods: {
        setTheme(mode: UiTheme) {
            this.uiStore.setTheme(mode)
        },
        signInWithGoogle() {
            this.uiStore.authenticate()
        },
        logout() {
            this.uiStore.logout()
            // Redirect to authentication page
            this.$router.push({ name: "auth" })
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
