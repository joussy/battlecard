<template>
    <div class="d-flex align-items-center menu-card-tools mb-3">
        <div class="flex-grow-1"></div>
        <div
            class="btn-group"
            role="group"
        >
            <button
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
                        @click="downloadFile('png')"
                    >
                        <i class="bi bi-file-image"></i>
                        PNG</a
                    >
                </li>
            </ul>
        </div>
    </div>
    <div class="border border-light-subtle rounded-3 p-1">
        <FightCardGridComponent
            :fight-card="fightCard"
            :edition-mode="false"
        />
        <div
            v-if="fightCard.length == 0"
            class="justify-content-center m-4 text-center"
        >
            <div class="mb-4"><i>The fight card is empty</i></div>
            <div>Wait for fights to be added by the owner of the tournament</div>
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

export default {
    components: {
        FightCardGridComponent,
    },
    data() {
        return {
            fightStore: useFightStore(),
            uiStore: useUiStore(),
            boxerStore: useBoxerStore(),
            tournamentStore: useTournamentStore(),
            editionMode: false,
            fightCard: [] as (Fight & {
                boxer1: Boxer
                boxer2: Boxer
            })[],
        }
    },
    async mounted() {},
    methods: {
        async downloadFile(fileType: FileType) {
            if (!this.tournamentStore.currentTournamentId) {
                return
            }
            if (fileType === "png") {
                await ExportService.downloadFightCardPng(this.tournamentStore.currentTournamentId)
            }
            if (fileType === "pdf") {
                await ExportService.downloadFightCardPdf(this.tournamentStore.currentTournamentId)
            }
        },
    },
}
</script>
