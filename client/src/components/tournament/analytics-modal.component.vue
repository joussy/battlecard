<template>
    <ModalComponent v-model="showModal">
        <template #header>
            <h5
                id="analyticsModalLabel"
                class="modal-title"
            >
                <i class="bi bi-bar-chart"></i>
                {{ $t("fightCard.analytics") }}
            </h5>
        </template>
        <div>
            <div>
                <div class="analytics-header d-flex justify-content-between"></div>
            </div>
            <div class="analytics-content mt-3">
                <div class="mb-4">
                    <h6>{{ $t("fightCard.analyticsTotalFightDuration") }}</h6>
                    <div class="fs-4 text-center">
                        {{ formattedTotalFightDuration }}
                    </div>
                </div>
                <h6>{{ $t("fightCard.analyticsBoxersPerClub") }}</h6>
                <div class="table-responsive">
                    <table class="table table-striped table-bordered table-hover align-middle w-auto">
                        <tbody>
                            <tr
                                v-for="row in boxersByClub"
                                :key="row.club"
                            >
                                <td>{{ row.club }}</td>
                                <td class="text-end">{{ row.count }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mb-4">
                    <h6>{{ $t("fightCard.analyticsGenderStats") }}</h6>
                    <div class="d-flex gap-4">
                        <div class="stat-box bg-light border rounded p-3 text-center">
                            <div class="fw-bold">{{ $t("clipboard.female") }}</div>
                            <div class="display-6">{{ genderStats.female }}</div>
                        </div>
                        <div class="stat-box bg-light border rounded p-3 text-center">
                            <div class="fw-bold">{{ $t("clipboard.male") }}</div>
                            <div class="display-6">{{ genderStats.male }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ModalComponent>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useTournamentStore } from "@/stores/tournament.store"
import ModalComponent from "../shared/core/modal.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { formatDuration, intervalToDuration } from "date-fns"

const { t: $t } = useI18n()
const showModal = defineModel<boolean>()
const tournamentStore = useTournamentStore()
const fightStore = useFightStore()

const boxersByClub = computed(() => {
    const clubMap: Record<string, Set<string>> = {}
    // Use a Set to avoid counting the same boxer twice
    for (const fight of fightStore.fights) {
        if (fight.boxer1 && fight.boxer1.club && fight.boxer1.id) {
            if (!clubMap[fight.boxer1.club]) clubMap[fight.boxer1.club] = new Set()
            clubMap[fight.boxer1.club].add(fight.boxer1.id)
        }
        if (fight.boxer2 && fight.boxer2.club && fight.boxer2.id) {
            if (!clubMap[fight.boxer2.club]) clubMap[fight.boxer2.club] = new Set()
            clubMap[fight.boxer2.club].add(fight.boxer2.id)
        }
    }
    return Object.entries(clubMap)
        .map(([club, ids]) => ({ club, count: ids.size }))
        .sort((a, b) => a.club.localeCompare(b.club))
})

const genderStats = computed(() => {
    let male = 0
    let female = 0
    // Count gender only for boxers actually engaged in fights
    for (const fight of fightStore.fights) {
        if (fight.boxer1 && fight.boxer1.gender) {
            if (fight.boxer1.gender === "male" || fight.boxer1.gender === "MALE") male++
            else if (fight.boxer1.gender === "female" || fight.boxer1.gender === "FEMALE") female++
        }
        if (fight.boxer2 && fight.boxer2.gender) {
            if (fight.boxer2.gender === "male" || fight.boxer2.gender === "MALE") male++
            else if (fight.boxer2.gender === "female" || fight.boxer2.gender === "FEMALE") female++
        }
    }
    return { male, female }
})

const totalFightDuration = computed(() => {
    // Each fight: (roundDurationSeconds * rounds) + (rest time between rounds)
    return fightStore.fights.reduce((sum, fight) => {
        if (fight.roundDurationSeconds && fight.rounds) {
            // There are (rounds - 1) rest periods of 60s each
            const rest = fight.rounds > 1 ? (fight.rounds - 1) * 60 : 0
            return sum + fight.roundDurationSeconds * fight.rounds + rest
        }
        return sum
    }, 0)
})

const formattedTotalFightDuration = computed(() => {
    const duration = intervalToDuration({ start: 0, end: totalFightDuration.value * 1000 })
    return formatDuration(duration, { format: ["hours", "minutes", "seconds"] })
})

watch(
    () => showModal.value,
    async (newVal) => {
        if (newVal) {
            await startup()
        }
    }
)

function startup() {
    if (!tournamentStore.currentTournamentId) {
        console.error("No tournament selected")
        return
    }
}
</script>
