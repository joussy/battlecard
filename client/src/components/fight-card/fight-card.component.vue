<template>
    <TournamentHeaderComponent />
    <div :class="{ 'edition-mode': editionMode }">
        <div class="d-flex align-items-center mb-3">
            <div class="flex-grow-1"></div>
            <button
                type="button"
                class="btn btn-outline-success ms-2"
                :class="{ active: editionMode }"
                :disabled="getNbFights() == 0 && !editionMode"
                @click="editionMode = !editionMode"
            >
                <i class="me-1 bi bi-pencil" />
                Edit
            </button>
            <button
                type="button"
                class="btn btn-outline-purple ms-2"
                data-bs-toggle="modal"
                data-bs-target="#matchupModal"
            >
                <i class="me-1 bi bi-magic" />
                Matchmaker
            </button>
            <button
                type="button"
                :disabled="getNbFights() == 0 && !editionMode"
                class="btn btn-outline-secondary ms-2"
                data-bs-toggle="modal"
                data-bs-target="#shareModal"
            >
                <i class="me-1 bi bi-share" />
                Share
            </button>
            <div
                v-if="editionMode"
                id="editModeToast"
                class="d-md-none toast show bg-success text-white position-fixed top-0 start-50 translate-middle-x mt-5"
                role="alert"
            >
                <div
                    class="toast-body text-center"
                    @click="editionMode = false"
                >
                    I'm Done editing
                </div>
            </div>
        </div>
        <div class="border border-light-subtle rounded-3 p-1">
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
                <div class="mb-4"><i>Your fight card is empty</i></div>
                <div>
                    Setup the first fight using the
                    <router-link
                        :to="{ name: 'selector' }"
                        :class="{ active: $route.path.startsWith('/selector') }"
                    >
                        Selector
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <ShareComponent
        :enable-share-link="true"
        :download-callback="downloadCallback"
    />
    <MatchupModalComponent />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { Fight } from "@/types/boxing.d"
import FightCardGridComponent from "@/components/fight-card/fight-card-grid.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useTournamentStore } from "@/stores/tournament.store"
import ShareComponent from "@/components/shared/core/share.component.vue"
import MatchupModalComponent from "@/components/tournament/matchup-modal.component.vue"
import TournamentHeaderComponent from "@/components/shared/layout/tournament-header.component.vue"
import { downloadWithDom } from "@/utils/download.utils"
import { ExportOpenApi } from "@/api"

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

const downloadCallback = async (fileType: string, displayQrCode: boolean): Promise<void> => {
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
            body: { tournamentId: tournamentId.value, displayQrCode },
        })
    } else if (fileType === "png") {
        res = await ExportOpenApi.getFightCardPng({
            body: { tournamentId: tournamentId.value, displayQrCode },
        })
    } else {
        return Promise.reject(new Error("Unsupported file type"))
    }
    console.log("Downloaded file:", res)
    downloadWithDom(res, `fight-card.${fileType}`)
}
</script>
