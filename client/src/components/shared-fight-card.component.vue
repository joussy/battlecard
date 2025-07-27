<template>
    <template v-if="tournament">
        <div class="d-flex mb-3 justify-content-between align-items-center">
            <div>
                <h5>{{ tournament?.tournamentName }}</h5>
                {{ tournamentDate }}
            </div>
            <router-link
                :to="{ path: '/' }"
                class="d-flex align-items-center text-decoration-none"
            >
                <Icon
                    name="ring"
                    class="me-2 svg-2"
                />
                <span class="fw-bold h4 mb-0 text-decoration-none">BattleCard</span>
            </router-link>
            <button
                type="button"
                class="btn btn-outline-secondary ms-2"
                data-bs-toggle="modal"
                data-bs-target="#shareModal"
            >
                <i class="me-1 bi bi-download" />
                Download
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
        <div class="mt-4 text-center">
            <hr />
            <div class="mb-2">
                <i
                    class="bi bi-stars text-primary"
                    style="font-size: 2rem"
                ></i>
            </div>
            <h5 class="mb-2">Want to organize your own tournaments?</h5>
            <p class="text-muted mb-3">Create a free account to manage events, fight cards, and more!</p>
            <router-link
                :to="{ path: '/' }"
                class="btn btn-outline-primary"
            >
                <Icon
                    name="ring"
                    class="svg-2 me-2"
                />
                Create your BattleCard account
            </router-link>
        </div>
    </template>
    <div
        v-else-if="accessDenied"
        class="text-center mt-5"
    >
        <h5>
            <i class="bi bi-exclamation-triangle-fill text-danger"></i>
            Access Denied
        </h5>
        <p>You do not have permission to view this fight card.</p>
        <p>Please check the link or contact the owner of the fight card.</p>
    </div>
</template>

<script lang="ts">
import { SharedFightCard } from "@/types/boxing.d"
import FightCardGridComponent from "./fight-card/fight-card-grid.component.vue"
import apiManager from "@/managers/api.manager"
import ApiAdapter from "@/adapters/api.adapter"
import exportManager from "@/managers/export.manager"
import ShareComponent from "@/components/core/share.component.vue"
import IconComponent from "./core/icon.component.vue"

export default {
    components: {
        FightCardGridComponent,
        ShareComponent,
        Icon: IconComponent,
    },
    data() {
        return {
            editionMode: false,
            roToken: null as string | null,
            tournament: null as SharedFightCard | null,
            accessDenied: false,
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
        try {
            const apiSharedFightCardGet = await apiManager.getFightsByFightCardToken(this.roToken)
            this.tournament = ApiAdapter.toSharedFightCard(apiSharedFightCardGet)
        } catch (error) {
            console.error("Error fetching shared fight card:", error)
            this.tournament = null
            this.accessDenied = true
            return
        }
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
