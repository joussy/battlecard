<template>
    <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center vh-100"
    >
        <div
            class="spinner-border"
            role="status"
        >
            <span class="visually-hidden">Loading...</span>
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
                            <Icon :name="boxer.gender == Gender.MALE ? 'male' : 'female'"></Icon>
                            {{ getBirthDateAndAge(boxer) }}
                        </p>
                        <p class="col-md-6 mb-1">
                            <i class="bi bi-person-vcard"></i> {{ boxer.license }} -
                            {{ boxer.category }}
                        </p>
                        <p class="col-md-6 mb-1"><i class="bi bi-house-fill me-1"></i>{{ boxer?.club }}</p>
                        <p class="col-md-6 mb-1">
                            <Icon
                                name="scale"
                                class="me-1"
                            ></Icon
                            >{{ boxer.weight }} kg
                            <Icon
                                name="medal"
                                class="me-1"
                            ></Icon
                            >{{ boxer.nbFights }}
                        </p>
                        <p class="col-md-6 mb-1">
                            <i class="bi bi-link me-1"></i>Scheduled for {{ boxer.selectedFights }} fights
                        </p>
                    </div>
                    <div class="d-flex flex- gap-2 align-items-start justify-content-end border-top mt-2 pt-2">
                        <button
                            class="btn btn-sm btn-outline-secondary"
                            @click="copyToClipboard()"
                        >
                            <i class="bi bi-clipboard"></i>
                            <span class="ms-2">Copy to clipboard</span>
                        </button>
                        <div
                            class="btn btn-sm btn-outline-success"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#boxerEditOffcanvasNavbar"
                        >
                            <i class="bi bi-pencil"></i>
                            Edit boxer
                        </div>
                        <BoxerEditOffcanvasComponent
                            :boxer="boxer"
                            @boxer-saved="fetchBoxerData()"
                        />
                    </div>
                </div>
            </div>
        </div>
        <h6 class="ps-1">Available opponents</h6>
        <div>
            <div class="ps-0 pe-0 pt-0 pb-0">
                <div
                    v-for="opponent in getOpponentsToDisplay()"
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

<script lang="ts">
import { defineComponent, watch } from "vue"
import { Boxer, Opponent } from "@/types/boxing.d"
import { Gender, ModalityErrorType } from "@/shared/types/modality.type"
import OpponentTileComponent from "@/components/selector/opponent-tile.component.vue"
import BoxerEditOffcanvasComponent from "@/components/selector/add/boxer-edit-offcanvas.component.vue"

import IconComponent from "@/components/core/icon.component.vue"

import { format } from "date-fns"
import { useFightStore } from "@/stores/fight.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { useUiStore } from "@/stores/ui.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import { getBoxerDisplayName, getClipboardText } from "@/utils/labels.utils"
import { getBirthDateAndAge, getBoxerAge } from "@/utils/string.utils"

export default defineComponent({
    components: {
        OpponentTileComponent: OpponentTileComponent,
        BoxerEditOffcanvasComponent: BoxerEditOffcanvasComponent,
        Icon: IconComponent,
    },
    setup() {},
    data() {
        return {
            getBoxerDisplayName,
            fightStore: useFightStore(),
            boxerStore: useBoxerStore(),
            uiStore: useUiStore(),
            Gender: Gender,
            opponents: [] as Opponent[],
            ModalityErrorType: ModalityErrorType,
            tournamentStore: useTournamentStore(),
            tournamentBoxerStore: useTournamentBoxerStore(),
            boxer: undefined as Boxer | undefined,
            boxerId: this.$route.params.id as string,
            loading: false,
        }
    },
    watch: {
        "$route.params.id": {
            handler(newId) {
                this.opponents = []
                this.boxerId = newId as string
            },
        },
    },
    created() {
        watch(
            () => this.boxerId,
            () => {
                this.loading = true
            }
        )
        watch(
            () => [this.boxerId, this.fightStore.fights],
            async () => await this.fetchBoxerData(),
            { immediate: true, deep: true }
        )
    },
    methods: {
        getOpponentsToDisplay(): Readonly<Opponent[]> {
            if (!this.opponents) {
                return []
            }
            return this.opponents.filter((o) => {
                if (this.uiStore.hideNonMatchableOpponents && !o.isEligible) return false
                return true
            })
        },
        getBirthDateAndAge(boxer: Boxer): string {
            return getBirthDateAndAge(boxer.birthDate)
        },
        async fetchBoxerData() {
            if (this.boxerId) {
                console.log("Boxer details for ID:", this.boxerId)
                this.boxer = await this.boxerStore.fetchBoxerById(this.boxerId)
                console.log("Boxer:", this.boxer)
                if (!this.boxer) {
                    this.$router.push({ name: "selector" })
                    return
                }
                this.opponents = await this.tournamentBoxerStore.fetchBoxerOpponents(this.boxer.id)
                this.loading = false
            }
        },
        copyToClipboard() {
            if (!this.boxer) {
                return
            }
            const text = getClipboardText(this.boxer)
            navigator.clipboard.writeText(text)
        },
    },
})
</script>
