<template>
    <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center vh-100"
    >
        <div
            class="spinner-border"
            role="status"
        >
            <span class="visually-hidden">{{ $t("common.loading") }}</span>
        </div>
    </div>
    <div
        v-else-if="boxer != null"
        class="max-width-md"
    >
        <div class="bg-body sticky-top d-flex justify-content-center align-items-center pb-1">
            <router-link
                :to="{ name: 'selector' }"
                class="nav-link text-center"
            >
                <i class="bi bi-arrow-left-circle fs-2"></i>
            </router-link>
            <h5 class="ps-2 card-title fw-bold flex-fill">
                {{ getBoxerDisplayName(boxer) }}
            </h5>
        </div>
        <!-- Modal -->
        <div class="card mb-3">
            <div class="card shadow rounded">
                <div class="card-body p-3 p-md-3">
                    <div class="row">
                        <p class="col-md-6 mb-1">
                            <IconComponent :name="boxer.gender == Gender.MALE ? 'male' : 'female'"></IconComponent>
                            {{ getBirthDateAndAge(boxer.birthDate) }}
                        </p>
                        <p class="col-md-6 mb-1">
                            <i class="bi bi-person-vcard"></i> {{ boxer.license }} -
                            {{ boxer.category }}
                        </p>
                        <p class="col-md-6 mb-1"><i class="bi bi-house-fill me-1"></i>{{ boxer?.club }}</p>
                        <p class="col-md-6 mb-1">
                            <IconComponent
                                name="scale"
                                class="me-1"
                            ></IconComponent
                            >{{ boxer.weight }} {{ $t("common.kg") }}
                            <IconComponent
                                name="medal"
                                class="me-1"
                            ></IconComponent
                            >{{ boxer.nbFights }}
                        </p>
                        <p class="col-md-6 mb-1">
                            <i class="bi bi-link me-1"></i>{{ $t("selector.scheduledFor") }} {{ boxer.selectedFights }}
                            {{ $t("matchupDetails.fights") }}
                        </p>
                    </div>
                    <div class="d-flex flex- gap-2 align-items-start justify-content-end border-top mt-2 pt-2">
                        <button
                            class="btn btn-sm btn-outline-secondary"
                            @click="copyToClipboard()"
                        >
                            <i class="bi bi-clipboard"></i>
                            <span class="ms-2">{{ $t("opponentTile.copyClipboard") }}</span>
                        </button>
                        <div
                            class="btn btn-sm btn-outline-success"
                            @click="editBoxer()"
                        >
                            <i class="bi bi-pencil"></i>
                            {{ $t("selector.editBoxer") }}
                        </div>
                        <BoxerEditOffcanvasComponent
                            v-model="showEditOffcanvas"
                            @boxer-saved="fetchBoxerData()"
                        />
                        <div
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteBoxer"
                        >
                            <i class="bi bi-trash"></i>
                            <span class="d-none d-sm-inline ms-1">{{ $t("selector.deleteBoxer") }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h6 class="ps-1">{{ $t("selector.availableOpponents") }}</h6>
        <div>
            <div class="ps-0 pe-0 pt-0 pb-0">
                <div
                    v-for="opponent in opponentsToDisplay"
                    :key="opponent.id"
                >
                    <OpponentTileComponent
                        :boxer="boxer"
                        :opponent="opponent"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { Boxer, Opponent } from "@/types/boxing.d"
import { BoxerOpenApi, Gender } from "@/api"
import OpponentTileComponent from "@/components/selector/opponent-tile.component.vue"
import BoxerEditOffcanvasComponent from "@/components/selector/add/boxer-edit-offcanvas.component.vue"
import IconComponent from "@/components/shared/core/icon.component.vue"

const { t: $t } = useI18n()

import { useFightStore } from "@/stores/fight.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { useUiStore } from "@/stores/ui.store"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import { getBoxerDisplayName, getClipboardText } from "@/utils/labels.utils"
import { getBirthDateAndAge } from "@/utils/string.utils"

const route = useRoute()
const router = useRouter()

const fightStore = useFightStore()
const boxerStore = useBoxerStore()
const uiStore = useUiStore()
const tournamentBoxerStore = useTournamentBoxerStore()
const showEditOffcanvas = ref(false)

const opponents = ref<Opponent[]>([])
const boxer = ref<Boxer | undefined>(undefined)
const boxerId = ref(String(route.params.id ?? ""))
const loading = ref(false)

const opponentsToDisplay = computed(() => {
    if (!opponents.value) return [] as Opponent[]
    return opponents.value.filter((o) => {
        if (uiStore.hideNonMatchableOpponents && !o.isEligible) return false
        return true
    })
})

watch(
    () => route.params.id,
    (id) => {
        opponents.value = []
        boxerId.value = String(id ?? "")
    }
)

watch(
    () => boxerId.value,
    () => {
        loading.value = true
    }
)

watchEffect(async () => {
    // touch fightStore.fights so watchEffect depends on it (keeps previous behavior)
    void fightStore.fights
    await fetchBoxerData()
})

async function fetchBoxerData() {
    if (boxerId.value) {
        console.log("Boxer details for ID:", boxerId.value)
        boxer.value = await boxerStore.fetchBoxerById(boxerId.value)
        console.log("Boxer:", boxer.value)
        if (!boxer.value) {
            router.push({ name: "selector" })
            return
        }
        opponents.value = await tournamentBoxerStore.fetchBoxerOpponents(boxer.value.id)
        loading.value = false
    }
}

function copyToClipboard() {
    if (!boxer.value) return
    const text = getClipboardText(boxer.value)
    navigator.clipboard.writeText(text)
}

function editBoxer() {
    if (!boxer.value) return
    boxerStore.boxerToEdit = boxer.value
    showEditOffcanvas.value = true
}

async function deleteBoxer() {
    if (!boxer.value) return
    if (confirm($t("selector.deleteBoxerConfirmation"))) {
        await BoxerOpenApi.delete({
            path: {
                id: boxer.value.id,
            },
        })
        router.push({ name: "selector" })
    }
}
</script>
