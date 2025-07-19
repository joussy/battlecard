<template>
    <div class="d-flex mb-3 align-items-start">
        <div>
            <h5>{{ tournament?.tournamentName }}</h5>
            {{ tournamentDate }}
        </div>
        <div class="flex-grow-1"></div>
        <button
            type="button"
            class="btn btn-outline-secondary ms-2"
            data-bs-toggle="modal"
            data-bs-target="#shareModal"
        >
            <i class="me-1 bi bi-share" />
            Share
        </button>
    </div>
    <div class="border border-light-subtle rounded-3 p-1">
        <FightCardGridComponent
            :fight-card="tournament?.fights || []"
            :edition-mode="false"
        />
        <div
            v-if="tournament?.fights.length == 0"
            class="justify-content-center m-4 text-center"
        >
            <div class="mb-4"><i>The fight card is empty</i></div>
            <div>Wait for fights to be added by the owner of the tournament</div>
        </div>
    </div>
    <ShareComponent
        :enable-share-link="false"
        :download-callback="downloadCallback"
    />
</template>

<script lang="ts">
import { SharedFightCard } from "@/types/boxing.d"
import FightCardGridComponent from "./fight-card/fight-card-grid.component.vue"
import apiManager from "@/managers/api.manager"
import ApiAdapter from "@/adapters/api.adapter"
import exportManager from "@/managers/export.manager"
import ShareComponent from "@/components/core/share.component.vue"

export default {
    components: {
        FightCardGridComponent,
        ShareComponent,
    },
    data() {
        return {
            editionMode: false,
            roToken: null as string | null,
            tournament: null as SharedFightCard | null,
        }
    },
    computed: {
        tournamentDate() {
            //with date-fns
            return this.tournament?.tournamentDate
                ? new Date(this.tournament.tournamentDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                  })
                : "Unknown Date"
        },
    },
    async mounted() {
        this.roToken = this.$route.params.roToken as string
        const apiSharedFightCardGet = await apiManager.getFightsByFightCardToken(this.roToken)
        this.tournament = ApiAdapter.toSharedFightCard(apiSharedFightCardGet)
    },
    methods: {
        downloadCallback(fileType: string): Promise<void> {
            if (!this.roToken) {
                return Promise.reject(new Error("RO Token is not set"))
            }
            if (fileType === "pdf") {
                return exportManager.downloadSharedFightCardPdf(this.roToken)
            }
            if (fileType === "xlsx") {
                return exportManager.downloadSharedFightCardXlsx(this.roToken)
            }
            if (fileType === "csv") {
                return exportManager.downloadSharedFightCardCsv(this.roToken)
            }
            if (fileType === "png") {
                return exportManager.downloadSharedFightCardPng(this.roToken)
            }

            return Promise.reject(new Error("Unsupported file type"))
        },
    },
}
</script>
