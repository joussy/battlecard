<template>
    <ModalComponent v-model="showModal">
        <template #header>
            <h5
                id="matchupModalLabel"
                class="modal-title"
            >
                <i class="bi bi-magic"></i>
                {{ $t("fightCard.matchmaker") }}
            </h5>
        </template>
        <div v-if="!fight">
            <h3>{{ $t("fightCard.noMatchesAvailable") }}</h3>
            {{ $t("fightCard.addMoreBoxers") }}
        </div>
        <div v-else>
            <div>
                <div class="matchup-header d-flex justify-content-between">
                    <button
                        class="btn btn-primary"
                        :disabled="!canGoPrevious"
                        @click="goToPrevious"
                    >
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <div
                        v-if="fight && getRealFightId(fight) == null"
                        class="btn btn-success"
                        @click="addToFightCard(fight)"
                    >
                        <IconComponent
                            name="headgear"
                            class="me-1"
                        ></IconComponent
                        >{{ $t("fightCard.addFight") }}
                    </div>
                    <div
                        v-if="fight && getRealFightId(fight) != null"
                        class="btn btn-danger"
                        @click="removeFromFightCard(fight)"
                    >
                        <IconComponent
                            name="headgear"
                            class="me-1"
                        ></IconComponent
                        >{{ $t("fightCard.removeFight") }}
                    </div>
                    <button
                        class="btn btn-primary"
                        :disabled="!canGoNext"
                        @click="goToNext"
                    >
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="d-flex justify-content-center m-1">
                {{ $t("matchupDetails.matchupCounter") }} {{ currentFightIndex + 1 }} {{ $t("common.of") }}
                {{ fights.length }}
            </div>
            <div class="matchup-content mt-3">
                <MatchupDetailsComponent
                    v-if="fight != null"
                    :fight="fight"
                />
            </div>
        </div>
    </ModalComponent>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useFightStore } from "@/stores/fight.store"
import { Fight } from "@/types/boxing"
import IconComponent from "@/components/shared/core/icon.component.vue"
import MatchupDetailsComponent from "@/components/tournament/matchup-details.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"
import { FightOpenApi } from "@/api"
import ApiAdapter from "@/adapters/api.adapter"
import ModalComponent from "../shared/core/modal.component.vue"

const { t: $t } = useI18n()
const showModal = defineModel<boolean>()
const fightStore = useFightStore()
const tournamentStore = useTournamentStore()
const fights = ref<Fight[]>([])
const fight = ref<Fight | null>(null)
const currentFightIndex = ref(0)

const canGoPrevious = computed(() => currentFightIndex.value > 0)
const canGoNext = computed(() => currentFightIndex.value < fights.value.length - 1)

watch(
    () => showModal.value,
    async (newVal) => {
        if (newVal) {
            await loadMatchups()
        }
    }
)

async function loadMatchups() {
    if (!tournamentStore.currentTournamentId) {
        console.error("No tournament selected")
        return
    }
    try {
        const apiFights = await FightOpenApi.getMatchups({
            path: { tournamentId: tournamentStore.currentTournamentId },
        })
        if (apiFights) {
            fights.value = apiFights.map(ApiAdapter.toFight)
        } else {
            fights.value = []
        }
        currentFightIndex.value = 0
        fight.value = fights.value.length > 0 ? fights.value[0] : null
    } catch (error) {
        console.error("Error loading matchups:", error)
        fights.value = []
        fight.value = null
    }
}

function goToPrevious() {
    if (canGoPrevious.value) {
        currentFightIndex.value--
        fight.value = fights.value[currentFightIndex.value]
    }
}

function goToNext() {
    if (canGoNext.value) {
        currentFightIndex.value++
        fight.value = fights.value[currentFightIndex.value]
    }
}

function addToFightCard(f: Fight) {
    fightStore.addToFightCard(f.boxer1, f.boxer2)
}

function removeFromFightCard(f: Fight) {
    const realFightId = getRealFightId(f)
    if (!realFightId) {
        console.error("No real fight ID found for the fight")
        return
    }
    fightStore.removeFromFightCard([realFightId])
}

function getRealFightId(f: Fight): string | null {
    return (
        fightStore.fights?.find(
            (ff) =>
                (ff.boxer1.id === f.boxer1.id && ff.boxer2.id === f.boxer2.id) ||
                (ff.boxer1.id === f.boxer2.id && ff.boxer2.id === f.boxer1.id)
        )?.id || null
    )
}
</script>
