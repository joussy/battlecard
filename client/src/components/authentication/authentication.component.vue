<template>
    <div class="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div class="welcome-section text-center mb-4">
            <div class="d-flex align-items-center justify-content-center mb-2">
                <IconComponent
                    name="ring"
                    class="ring-icon-auth"
                />
            </div>
            <h1 class="mb-1">{{ $t("authentication.welcome") }}</h1>
            <p class="lead text-muted mb-0">{{ $t("authentication.tagline") }}</p>
        </div>
        <div
            class="card p-4 shadow w-100"
            style="max-width: 400px"
        >
            <div class="text-center">
                <span class="h6">{{ $t("authentication.signIn") }}</span>
            </div>
            <div class="card-body">
                <button
                    v-if="!uiStore.account"
                    class="btn btn-warning w-100 mb-3"
                    @click="signInWithGoogle()"
                >
                    <i class="bi bi-google me-2" />{{ $t("authentication.signInWithGoogle") }}
                </button>
                <div
                    v-else
                    class="d-flex flex-column align-items-center"
                >
                    <img
                        v-if="uiStore.account.picture"
                        :src="uiStore.account.picture"
                        class="rounded-circle mb-2 avatar-icon"
                        alt="User Avatar"
                    />
                    <i
                        v-else
                        class="bi bi-person-circle mb-2"
                        :style="{ 'font-size': '2.5rem' }"
                    />
                    <strong>{{ uiStore.account?.name }}</strong>
                    <div
                        class="text-muted"
                        style="font-size: 0.85rem"
                    >
                        {{ uiStore.account?.email }}
                    </div>
                    <button
                        class="btn btn-danger mt-3"
                        :alt="$t('authentication.signOut')"
                        @click="logout()"
                    >
                        <i class="bi bi-box-arrow-right" /> {{ $t("authentication.signOut") }}
                    </button>
                </div>
            </div>
        </div>
        <div class="mt-5 d-flex justify-content-center">
            <div>
                <div class="form-label mb-3 text-center h5">
                    <i class="bi bi-translate me-1" />
                    {{ $t("settings.language") }}
                </div>
                <div
                    class="btn-group"
                    role="group"
                    aria-label="Language selection"
                >
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        :class="{ active: uiStore.language === 'en' }"
                        @click="setLanguage('en')"
                    >
                        <IconComponent name="glove" />{{ $t("settings.english") }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        :class="{ active: uiStore.language === 'fr' }"
                        @click="setLanguage('fr')"
                    >
                        <IconComponent name="glove" />{{ $t("settings.french") }}
                    </button>
                </div>
            </div>
        </div>
        <div class="mt-4 text-center text-muted small">
            <span>{{ $t("authentication.demoNotice") }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUiStore } from "@/stores/ui.store"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { UiLanguage } from "@/types/ui"

const router = useRouter()
const uiStore = useUiStore()

const signInWithGoogle = () => {
    uiStore.authenticate()
}

const logout = () => {
    uiStore.logout()
}

const setLanguage = (language: UiLanguage) => {
    uiStore.setLanguage(language)
}

onMounted(async () => {
    window.addEventListener("message", async (event) => {
        if (event.data && event.data.token) {
            uiStore.jwtToken = event.data.token
            await uiStore.setTokenAndFetchUser()
            router.push({ name: "tournaments" })
        }
    })
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    if (token) {
        await uiStore.setTokenAndFetchUser()
        router.push({ name: "tournaments" })
    }
})
</script>
<style lang="scss">
.ring-icon-auth {
    width: 64px;
    height: 64px;
}
</style>
