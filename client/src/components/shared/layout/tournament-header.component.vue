<template>
    <div class="mb-2 d-flex align-items-center titleEvent">
        <button
            type="button"
            class="btn btn-purple ms-2"
            @click="goToEvents"
            aria-label="Retour"
        >
            <i class="bi bi-arrow-left"></i>
        </button>
        <i class="bi bi-calendar ms-2"></i>
        <span class="ms-2">{{ tournamentName }} - <i>{{ tournamentDate }}</i></span>
        <router-link
            v-if="tournamentStore.currentTournamentId"
            :to="{ name: 'selector' }"
            class="btn btn-purple ms-2"
            :class="{ 'active': isSelectorActive }"
        >
            <IconComponent
                name="group-of-people"
                class="user-logo"
            />
            <span class="d-none d-sm-inline ms-2">{{ $t("layout.selector") }}</span>
        </router-link>
        <router-link
            v-if="tournamentStore.currentTournamentId"
            :to="{ name: 'card' }"
            class="btn btn-purple ms-2"
            :class="{ 'active': isCardActive }"
        >
            <IconComponent
                name="headgear"
                class="user-logo"
            />
            <span class="d-none d-sm-inline ms-2">{{ $t("layout.card") }}</span>
        </router-link>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { useTournamentStore } from "@/stores/tournament.store"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

const { t: $t } = useI18n()
const tournamentStore = useTournamentStore()
const route = useRoute()
const router = useRouter()

const tournamentName = computed(() => {
    const name = tournamentStore.getCurrentTournament()?.name || "No tournament selected"
    return name.length > 30 ? name.substring(0, 25) + "..." : name
})

const tournamentDate = computed(() => {
    const dateAsStr = tournamentStore.getCurrentTournament()?.date
    if (!dateAsStr) return null
    const date = new Date(dateAsStr)
    return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString() : null
})

const isSelectorActive = computed(() => route.name === "selector")
const isCardActive = computed(() => route.name === "card")

function goToEvents() {
    router.push({ name: "tournaments" })
}
</script>
<style scoped>
.active {
    background-color: var(--bs-primary);
    color: #fff;
    border-color: var(--bs-primary);
}
.titleEvent {
    background-color: #9e82cf;
    padding: 22px;
    /* border: aliceblue; */
    color: #fff;
    FONT-WEIGHT: 600;
    font-size: 29px;

}
</style>
