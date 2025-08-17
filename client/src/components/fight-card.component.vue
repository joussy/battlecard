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
                :disabled="getNbFights() == 0 && !editionMode"
                class="btn btn-outline-secondary ms-2"
                data-bs-toggle="modal"
                data-bs-target="#shareModal"
            >
                <i class="me-1 bi bi-share" />
                Share
            </button>
            <button
                type="button"
                :disabled="editionMode"
                class="btn btn-outline-purple ms-2"
                data-bs-toggle="modal"
                data-bs-target="#matchupModal"
            >
                <i class="me-1 bi bi-magic" />
                Matchup
            </button>

            <div
                v-if="editionMode"
                id="editModeToast"
                class="d-md-none toast show bg-success text-white position-fixed top-0 start-50 translate-middle-x mt-3"
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

<script lang="ts">
import { Fight } from "@/types/boxing.d"
import FightCardGridComponent from "./tournament/fight-card-grid.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useUiStore } from "@/stores/ui.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { watch } from "vue"
import ShareComponent from "@/components/core/share.component.vue"
import MatchupModalComponent from "@/components/tournament/matchup-modal.component.vue"
import exportManager from "@/managers/export.manager"
import TournamentHeaderComponent from "@/components/tournament-header.component.vue"

export default {
    components: {
        FightCardGridComponent,
        ShareComponent,
        TournamentHeaderComponent,
        MatchupModalComponent,
    },
    data() {
        return {
            fightStore: useFightStore(),
            uiStore: useUiStore(),
            tournamentStore: useTournamentStore(),
            editionMode: false,
            fightCard: [] as Fight[],
        }
    },
    computed: {
        tournamentId() {
            if (!this.tournamentStore.currentTournamentId) {
                throw new Error("No tournament selected")
            }
            return this.tournamentStore.currentTournamentId
        },
    },
    mounted() {
        watch(
            () => [this.tournamentStore.currentTournamentId],
            async () => {
                await this.fightStore.fetchFights()
            },
            { immediate: true }
        )
        watch(
            () => this.fightStore.fights,
            () => {
                if (!this.fightStore.restored) return
                this.fightCard = this.fightStore.fights.map((fight: Fight) => {
                    return {
                        ...fight,
                    }
                })
            },
            { immediate: true, deep: true }
        )
        watch(
            () => this.editionMode,
            () => {
                // Sortable initialization is now handled in the grid component
            }
        )
    },
    methods: {
        handleSwitchFight(fightId: string) {
            this.fightStore.switchFight(fightId)
        },
        async handleRemoveFromFightCard(fightId: string) {
            await this.fightStore.removeFromFightCard([fightId])
            await this.fightStore.fetchFights()
        },
        getNbFights() {
            return this.fightCard.length
        },
        downloadCallback(fileType: string, displayQrCode: boolean): Promise<void> {
            if (fileType === "xlsx") {
                return exportManager.downloadFightCardXlsx(this.tournamentId)
            } else if (fileType === "csv") {
                return exportManager.downloadFightCardCsv(this.tournamentId)
            } else if (fileType === "pdf") {
                return exportManager.downloadFightCardPdf(this.tournamentId, displayQrCode)
            } else if (fileType === "png") {
                return exportManager.downloadFightCardPng(this.tournamentId, displayQrCode)
            }
            return Promise.reject(new Error("Unsupported file type"))
        },
    },
}
</script>
