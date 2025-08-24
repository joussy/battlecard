<template>
    <template v-if="tournament">
        <div class="d-flex mb-3 justify-content-between align-items-center">
            <router-link
                :to="{ path: '/' }"
                class="d-flex align-items-center text-decoration-none"
            >
                <IconComponent
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
        <div class="d-flex mb-3 justify-content-between align-items-center">
            <h5>{{ tournament?.tournamentName }}</h5>
            {{ tournamentDate }}
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
                <IconComponent
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

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { SharedFightCard } from "@/types/boxing.d"
import FightCardGridComponent from "@/components/fight-card/fight-card-grid.component.vue"
import { ShareOpenApi } from "@/api"
import ApiAdapter from "@/adapters/api.adapter"
import ShareComponent from "@/components/shared/core/share.component.vue"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { downloadWithDom } from "@/utils/download.utils"

const route = useRoute()

const roToken = ref<string | null>(null)
const tournament = ref<SharedFightCard | null>(null)
const accessDenied = ref(false)

const tournamentDate = computed(() => {
    //with date-fns
    return tournament.value?.tournamentDate
        ? new Date(tournament.value.tournamentDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Unknown Date"
})

onMounted(async () => {
    roToken.value = route.params.roToken as string
    try {
        const apiSharedFightCardGet = await ShareOpenApi.getFightsByFightCardToken({
            path: { fightCardToken: roToken.value },
        })
        if (apiSharedFightCardGet) {
            tournament.value = ApiAdapter.toSharedFightCard(apiSharedFightCardGet)
        } else {
            throw new Error("No data received")
        }
    } catch (error) {
        console.error("Error fetching shared fight card:", error)
        tournament.value = null
        accessDenied.value = true
        return
    }
})

const downloadCallback = async (fileType: string): Promise<void> => {
    if (!roToken.value) {
        return Promise.reject(new Error("RO Token is not set"))
    }
    let res: Blob | File | undefined
    if (fileType === "xlsx") {
        res = await ShareOpenApi.downloadSharedFightCardXlsx({
            body: { fightCardToken: roToken.value },
        })
    } else if (fileType === "csv") {
        res = await ShareOpenApi.downloadSharedFightCardCsv({
            body: { fightCardToken: roToken.value },
        })
    } else if (fileType === "pdf") {
        res = await ShareOpenApi.downloadSharedFightCardPdf({
            body: { fightCardToken: roToken.value },
        })
    } else if (fileType === "png") {
        res = await ShareOpenApi.downloadSharedFightCardPng({
            body: { fightCardToken: roToken.value },
        })
    } else {
        return Promise.reject(new Error("Unsupported file type"))
    }
    console.log("Downloaded file:", res)
    downloadWithDom(res, `fight-card.${fileType}`)
}
</script>
