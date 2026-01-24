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
            class="p-4 shadow w-100"
            style="max-width: 400px"
        >
            <div class="text-center"></div>
            <div class="card-body">
                <div
                    v-if="!uiStore.isAuthenticated"
                    class="d-flex flex-column row-gap-3"
                >
                    <button
                        v-for="provider in providers"
                        :key="provider"
                        class="btn btn-contrast w-100"
                        @click="signInWithProvider(provider)"
                    >
                        <i :class="getProviderIcon(provider) + ' me-2'" />{{
                            $t("authentication.signInWith", { provider: capitalize(provider) })
                        }}
                    </button>
                </div>
                <div
                    v-else
                    class="d-flex flex-column align-items-center"
                >
                    <img
                        v-if="uiStore.account!.picture"
                        :src="uiStore.account!.picture"
                        class="rounded-circle mb-2 avatar-icon"
                        alt="User Avatar"
                    />
                    <i
                        v-else
                        class="bi bi-person-circle mb-2"
                        :style="{ 'font-size': '2.5rem' }"
                    />
                    <strong>{{ uiStore.account!.name }}</strong>
                    <div
                        class="text-muted"
                        style="font-size: 0.85rem"
                    >
                        {{ uiStore.account!.email }}
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
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useUiStore } from "@/stores/ui.store"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { UiLanguage } from "@/types/ui"
import { OAuthOpenApi } from "@/api"

const router = useRouter()
const uiStore = useUiStore()

const providers = ref<string[]>([])

const signInWithProvider = async (provider: string) => {
    const redirectionUrl = await OAuthOpenApi.getRedirectionUrl({ path: { provider } })
    if (!redirectionUrl) {
        console.error("Failed to get redirection URL for OAuth provider.")
        return
    }
    window.open(redirectionUrl, "_self")
}

const logout = () => {
    uiStore.logout()
}

const setLanguage = (language: UiLanguage) => {
    uiStore.setLanguage(language)
}

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const getProviderIcon = (provider: string): string => {
    const icons: Record<string, string> = {
        google: "bi bi-google",
        microsoft: "bi bi-microsoft",
        github: "bi bi-github",
        facebook: "bi bi-facebook",
        twitter: "bi bi-twitter",
        linkedin: "bi bi-linkedin",
        apple: "bi bi-apple",
        amazon: "bi bi-amazon",
        discord: "bi bi-discord",
        slack: "bi bi-slack",
    }
    const providerLower = provider.toLowerCase()
    for (const [key, icon] of Object.entries(icons)) {
        if (providerLower.includes(key)) {
            return icon
        }
    }
    return "bi bi-box-arrow-in-right"
}

onMounted(async () => {
    const providersRes = await OAuthOpenApi.getProviders()
    providers.value = providersRes?.providers ?? []
    window.addEventListener("message", async (event) => {
        if (event.data && event.data.token) {
            await uiStore.fetchUser()
            router.push({ name: "tournaments" })
        }
    })
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    if (token) {
        await uiStore.fetchUser()
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
