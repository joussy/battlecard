<template>
    <div :class="{ 'edition-mode': editionMode }">
        <div class="d-flex align-items-center menu-card-tools mb-3">
            <div class="flex-grow-1"></div>
            <button
                type="button"
                class="btn btn-outline-success ms-2"
                :class="{ active: editionMode }"
                :disabled="getNbFights() == 0 && !editionMode"
                @click="editionMode = !editionMode"
            >
                <i class="bi bi-pencil" />
                Edit
            </button>
            <div
                class="btn-group"
                role="group"
            >
                <button
                    :disabled="getNbFights() == 0 && !editionMode"
                    type="button"
                    class="btn btn-outline-secondary ms-2 dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i class="bi bi-download" />
                    Export
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a
                            class="dropdown-item"
                            @click="downloadFile('pdf')"
                        >
                            <i class="bi bi-file-earmark-pdf"></i>
                            PDF
                        </a>
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            @click="downloadFile('xlsx')"
                        >
                            <i class="bi bi-file-earmark-spreadsheet"></i>
                            XLSX</a
                        >
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            @click="downloadFile('csv')"
                        >
                            <i class="bi bi-file-earmark-spreadsheet"></i>
                            CSV</a
                        >
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            @click="downloadFile('png')"
                        >
                            <i class="bi bi-file-image"></i>
                            PNG</a
                        >
                    </li>
                </ul>
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
</template>

<script lang="ts">
import { Boxer, Fight } from "@/types/boxing.d"
import { ExportService } from "@/services/export.service"
import { FileType } from "@/types/api"
import FightCardGridComponent from "./fight-card/fight-card-grid.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { watch } from "vue"

export default {
    components: {
        FightCardGridComponent,
    },
    data() {
        return {
            fightStore: useFightStore(),
            uiStore: useUiStore(),
            tournamentStore: useTournamentStore(),
            editionMode: false,
            fightCard: [] as (Fight & {
                boxer1: Boxer
                boxer2: Boxer
            })[],
        }
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
        async downloadFile(fileType: FileType) {
            if (!this.tournamentStore.currentTournamentId) {
                return
            }
            if (fileType === "xlsx") {
                await ExportService.downloadFightCardXlsx(this.tournamentStore.currentTournamentId)
            }
            if (fileType === "csv") {
                await ExportService.downloadFightCardCsv(this.tournamentStore.currentTournamentId)
            }
            if (fileType === "png") {
                await ExportService.downloadFightCardPng(this.tournamentStore.currentTournamentId)
            }
            if (fileType === "pdf") {
                await ExportService.downloadFightCardPdf(this.tournamentStore.currentTournamentId)
            }
        },
        getNbFights() {
            return this.fightCard.length
        },
    },
}
</script>
<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";
.edition-mode {
    .fight-extra-infos {
        display: none;

        @include media-breakpoint-up(md) {
            display: block;
        }
    }
}
</style>
