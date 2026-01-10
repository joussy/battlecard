<template>
    <TournamentHeaderComponent />
    <div
        v-if="!editionMode"
        class="d-flex gap-1"
    >
        <div class="flex-grow-1"></div>
        <button
            type="button"
            class="btn btn-outline-success"
            :disabled="getNbFights() == 0"
            @click="editionMode = !editionMode"
        >
            <i class="me-0 bi bi-arrows-expand" />
            {{ $t("fightCard.changeOrder") }}
        </button>
        <button
            type="button"
            class="btn btn-outline-purple d-none d-sm-block"
            @click="showMatchupModal = true"
        >
            <i class="me-1 bi bi-magic" />
            {{ $t("fightCard.matchmaker") }}
        </button>
        <button
            type="button"
            :disabled="getNbFights() == 0"
            class="btn btn-outline-secondary"
            @click="showShareModal = true"
        >
            <i class="me-1 bi bi-share" />
            {{ $t("fightCard.share") }}
        </button>
        <div class="dropdown">
            <button
                type="button"
                :disabled="getNbFights() == 0"
                class="btn btn-outline-secondary"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i class="me-1 bi bi-three-dots-vertical" />
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a
                        class="dropdown-item d-sm-none"
                        @click="showMatchupModal = true"
                    >
                        <i class="bi bi-magic" />
                        {{ $t("fightCard.matchmaker") }}
                    </a>
                    <a
                        class="dropdown-item"
                        @click="showAnalyticsModal = true"
                    >
                        <i class="bi bi-bar-chart" />
                        {{ $t("fightCard.analytics") }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div
        v-else
        class="d-flex justify-content-center"
    >
        <button
            type="button"
            class="btn btn-outline-success active"
            @click="editionMode = false"
        >
            <i class="me-1 bi bi-arrows-expand" />
            {{ $t("fightCard.doneEditing") }}
        </button>
    </div>
    <div class="border border-light-subtle rounded-3 p-1 mt-2">
        <FightCardGridComponent
            :fight-card="fightCard"
            :edition-mode="editionMode"
            @switch-fight="handleSwitchFight"
            @remove-from-fight-card="handleRemoveFromFightCard"
        />
        <div
            v-if="fightCard.length == 0"
            class="justify-content-center m-4 text-center"
        >
            <div class="mb-4">
                <i>{{ $t("fightCard.emptyCard") }}</i>
            </div>
            <div>
                {{ $t("fightCard.setupFirstFight") }}
                <router-link
                    :to="{ name: 'selector' }"
                    :class="{ active: $route.path.startsWith('/selector') }"
                >
                    {{ $t("fightCard.selector") }}
                </router-link>
            </div>
        </div>
    </div>
    <ShareComponent
        v-model="showShareModal"
        :enable-share-link="true"
        :enable-download-options="true"
        :download-callback="downloadCallback"
    />
    <MatchmakerComponent v-model="showMatchupModal" />
    <AnalyticsComponent v-model="showAnalyticsModal" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { DownloadOptions, Fight } from "@/types/boxing.d"
import FightCardGridComponent from "@/components/fight-card/fight-card-grid.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useTournamentStore } from "@/stores/tournament.store"
import ShareComponent from "@/components/shared/core/share.component.vue"
import MatchmakerComponent from "@/components/tournament/matchmaker-modal.component.vue"
import AnalyticsComponent from "@/components/tournament/analytics-modal.component.vue"
import TournamentHeaderComponent from "@/components/shared/layout/tournament-header.component.vue"
import { downloadWithDom } from "@/utils/download.utils"
import { ExportOpenApi } from "@/api"

const { t: $t } = useI18n()
const showShareModal = ref(false)
const showMatchupModal = ref(false)
const showAnalyticsModal = ref(false)

const fightStore = useFightStore()
const tournamentStore = useTournamentStore()

const editionMode = ref(false)
const fightCard = ref<Fight[]>([])

const tournamentId = computed(() => {
    if (!tournamentStore.currentTournamentId) {
        throw new Error("No tournament selected")
    }
    return tournamentStore.currentTournamentId
})

onMounted(() => {
    watch(
        () => [tournamentStore.currentTournamentId],
        async () => {
            await fightStore.fetchFights()
        },
        { immediate: true }
    )
    watch(
        () => fightStore.fights,
        () => {
            if (!fightStore.restored) return
            fightCard.value = fightStore.fights.map((fight: Fight) => {
                return {
                    ...fight,
                }
            })
        },
        { immediate: true, deep: true }
    )
    watch(
        () => editionMode.value,
        () => {
            // Sortable initialization is now handled in the grid component
        }
    )
})

const handleSwitchFight = (fightId: string) => {
    fightStore.switchFight(fightId)
}

const handleRemoveFromFightCard = async (fightId: string) => {
    await fightStore.removeFromFightCard([fightId])
    await fightStore.fetchFights()
}

const getNbFights = () => {
    return fightCard.value.length
}

const downloadCallback = async (fileType: string, downloadOptions: DownloadOptions): Promise<void> => {
    let res: Blob | File | undefined
    if (fileType === "xlsx") {
        res = await ExportOpenApi.getFightCardXlsx({
            body: { tournamentId: tournamentId.value },
        })
    } else if (fileType === "csv") {
        res = await ExportOpenApi.getFightCardCsv({
            body: { tournamentId: tournamentId.value },
        })
    } else if (fileType === "pdf") {
        res = await ExportOpenApi.getFightCardPdf({
            body: {
                tournamentId: tournamentId.value,
                displayQrCode: downloadOptions.displayQrCode,
                displayLicense: downloadOptions.displayLicense,
                displayWeight: downloadOptions.displayWeight,
                displayBirthdate: downloadOptions.displayBirthdate,
                displayCategory: downloadOptions.displayCategory,
                displayGender: downloadOptions.displayGender,
                displayDuration: downloadOptions.displayDuration,
                displayTitle: downloadOptions.displayTitle,
            },
        })
    } else if (fileType === "png") {
        res = await ExportOpenApi.getFightCardPng({
            body: {
                tournamentId: tournamentId.value,
                displayQrCode: downloadOptions.displayQrCode,
                displayLicense: downloadOptions.displayLicense,
                displayWeight: downloadOptions.displayWeight,
                displayBirthdate: downloadOptions.displayBirthdate,
                displayCategory: downloadOptions.displayCategory,
                displayGender: downloadOptions.displayGender,
                displayDuration: downloadOptions.displayDuration,
                displayTitle: downloadOptions.displayTitle,
            },
        })
    } else {
        return Promise.reject(new Error("Unsupported file type"))
    }
    console.log("Downloaded file:", res)
    downloadWithDom(res, `fight-card.${fileType}`)
}
</script>
