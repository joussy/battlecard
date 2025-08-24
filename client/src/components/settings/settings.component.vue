<template>
    <div class="max-width-md">
        <div class="card mb-3">
            <div class="card-header"><i class="bi bi-person me-2" />{{ $t("settings.account") }}</div>
            <div class="card-body">
                <button
                    v-if="!uiStore.account"
                    class="btn btn-warning ms-2"
                    @click="signInWithGoogle()"
                >
                    <i class="bi bi-google me-2" />{{ $t("settings.signInWithGoogle") }}
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
                        :alt="$t('authentication.signOut')"
                        @click="logout()"
                    >
                        <i class="bi bi-box-arrow-right" />
                    </button>
                </div>
            </div>
        </div>
        <div class="card mb-3">
            <div class="card-header"><i class="bi bi-gear me-2" />{{ $t("settings.general") }}</div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="form-label">{{ $t("settings.theme") }}</div>
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
                            >{{ $t("settings.auto") }}</label
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
                            >{{ $t("settings.light") }}</label
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
                            >{{ $t("settings.dark") }}</label
                        >
                    </div>
                </div>
                <div class="mb-3">
                    <div class="form-label">{{ $t("settings.language") }}</div>
                    <div
                        class="btn-group"
                        role="group"
                        aria-label="Language selection radio toggle button group"
                    >
                        <input
                            id="btnlang1"
                            type="radio"
                            class="btn-check"
                            name="btnlang"
                            autocomplete="off"
                            :checked="uiStore.language == 'en'"
                            @click="setLanguage('en')"
                        />
                        <label
                            class="btn btn-outline-primary"
                            for="btnlang1"
                            >{{ $t("settings.english") }}</label
                        >

                        <input
                            id="btnlang2"
                            type="radio"
                            class="btn-check"
                            name="btnlang"
                            autocomplete="off"
                            :checked="uiStore.language == 'fr'"
                            @click="setLanguage('fr')"
                        />
                        <label
                            class="btn btn-outline-primary"
                            for="btnlang2"
                            >{{ $t("settings.french") }}</label
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { UiTheme, UiLanguage } from "@/types/ui"
import { useUiStore } from "@/stores/ui.store"

const { t: $t, locale } = useI18n()

const router = useRouter()
const uiStore = useUiStore()

const setTheme = (mode: UiTheme) => {
    uiStore.setTheme(mode)
}

const setLanguage = (language: UiLanguage) => {
    uiStore.setLanguage(language)
    locale.value = language
}

const signInWithGoogle = () => {
    uiStore.authenticate()
}

const logout = () => {
    uiStore.logout()
    // Redirect to authentication page
    router.push({ name: "auth" })
}

onMounted(async () => {
    // Listen for token from popup
    window.addEventListener("message", async (event) => {
        if (event.data && event.data.token) {
            uiStore.jwtToken = event.data.token
            await uiStore.setTokenAndFetchUser()
        }
    })
    // (Optional: handle token in URL for fallback)
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    if (token) {
        await uiStore.setTokenAndFetchUser()
        window.history.replaceState({}, document.title, window.location.pathname)
    }
})
</script>
<style lang="scss">
.avatar-icon {
    width: 40px;
    height: 40px;
}
</style>
