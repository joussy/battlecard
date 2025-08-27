<template>
    <!-- Share Modal -->
    <div
        id="matchupModal"
        ref="matchupModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5
                        id="matchupModalLabel"
                        class="modal-title"
                    >
                        <i class="bi bi-magic"></i>
                        {{ $t("fightCard.matchmaker") }}
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                    ></button>
                </div>
                <div class="modal-body p-3">
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
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { onBeforeRouteLeave } from "vue-router"
import { useI18n } from "vue-i18n"
import { useFightStore } from "@/stores/fight.store"
import { Fight } from "@/types/boxing"
import { Modal } from "bootstrap"
import IconComponent from "@/components/shared/core/icon.component.vue"
import MatchupDetailsComponent from "@/components/tournament/matchup-details.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"

const { t: $t } = useI18n()
import { FightOpenApi } from "@/api"
import ApiAdapter from "@/adapters/api.adapter"

const modal = ref<Modal | null>(null)
const matchupModal = ref<HTMLElement | null>(null)

const fightStore = useFightStore()
const tournamentStore = useTournamentStore()
const fights = ref<Fight[]>([])
const fight = ref<Fight | null>(null)
const currentFightIndex = ref(0)

const canGoPrevious = computed(() => currentFightIndex.value > 0)
const canGoNext = computed(() => currentFightIndex.value < fights.value.length - 1)

let showHandler: EventListener | null = null

onMounted(() => {
    const modalElement = matchupModal.value as HTMLElement
    modal.value = Modal.getOrCreateInstance(modalElement as HTMLElement)
    showHandler = async () => {
        await loadMatchups()
    }
    modalElement.addEventListener("show.bs.modal", showHandler)
})

onBeforeUnmount(() => {
    if (modal.value) modal.value.hide()
    const modalElement = matchupModal.value as HTMLElement
    if (modalElement && showHandler) modalElement.removeEventListener("show.bs.modal", showHandler)
})

onBeforeRouteLeave((to, from, next) => {
    if (modal.value) modal.value.hide()
    next()
})

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

<style scoped></style>
