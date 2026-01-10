<template>
    <ModalComponent
        v-model="showModal"
        modal-dialog-class="modal-fullscreen-sm-down"
    >
        <div class="header-modal d-flex">
            <h5 class="modal-title flex-grow-1">
                <i class="bi bi-info-circle me-1"></i>
                {{ $t("fightcard.fightDetails") }}
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            ></button>
        </div>
        <div
            v-if="fight"
            class="d-flex flex-column align-items-center justify-content-center mt-3 gap-1"
        >
            <button
                class="btn btn-primary"
                :disabled="!canGoPrevious"
                @click="goToPrevious"
            >
                <i class="bi bi-chevron-up"></i>
            </button>
            <div class="d-flex justify-content-center m-1">
                {{ $t("fightcard.fight") }} {{ currentFightIndex + 1 }} {{ $t("common.of") }}
                {{ fights.length }}
            </div>
            <button
                class="btn btn-primary"
                :disabled="!canGoNext"
                @click="goToNext"
            >
                <i class="bi bi-chevron-down"></i>
            </button>
            <div class="fightdetail-content mt-3 mb-auto">
                <MatchupDetailsComponent :fight="fight" />
            </div>
        </div>
    </ModalComponent>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useFightStore } from "@/stores/fight.store"
import { Fight } from "@/types/boxing"
import MatchupDetailsComponent from "@/components/shared/matchup/matchup-details.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"
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

const props = defineProps<{
    fightId?: string
}>()

watch(
    () => showModal.value,
    (newVal) => {
        console.log("Fight Details Modal visibility changed:", newVal)
        if (newVal) {
            loadFights()
        }
    }
)

function loadFights() {
    if (!tournamentStore.currentTournamentId) {
        console.error("No tournament selected")
        return
    }
    if (props.fightId === undefined) {
        console.error("No fight ID provided to FightDetailsModalComponent")
        return
    }
    fights.value = fightStore.fights
    currentFightIndex.value = fights.value.findIndex((f) => f.id === props.fightId)
    if (currentFightIndex.value === -1) {
        currentFightIndex.value = 0
    }
    fight.value = fights.value.length > 0 ? fights.value[currentFightIndex.value] : null
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
</script>
