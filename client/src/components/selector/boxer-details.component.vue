<template>
    <div
        v-if="boxer != null"
        class="max-width-md"
    >
        <div class="bg-body sticky-md-none sticky-top d-flex justify-content-center align-items-center pb-1">
            <router-link
                :to="{ name: 'selector' }"
                class="nav-link text-center"
            >
                <i class="bi bi-arrow-left-circle fs-2"></i>
            </router-link>
            <h5 class="ps-2 card-title fw-bold flex-fill">
                {{ getBoxerDisplayName(boxer) }}
            </h5>
            <div
                class="btn btn-sm btn-outline-success"
                data-bs-toggle="offcanvas"
                data-bs-target="#boxerEditOffcanvasNavbar"
            >
                <i class="bi bi-pencil"></i>
            </div>
            <BoxerEditOffcanvasComponent :boxer="boxer" />
        </div>
        <!-- Modal -->
        <div class="card mb-3">
            <div class="card shadow rounded">
                <div class="card-body p-1 p-md-3">
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
                        </p>
                        <p class="col-md-6 mb-1">
                            <i class="bi bi-link me-1"></i>{{ boxer.selectedFights }} selected fights
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <h6 class="ps-1">Available opponents</h6>
        <div>
            <div class="ps-0 pe-0 pt-0 pb-0">
                <div v-for="opponent in getOpponentsToDisplay()">
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

import { differenceInYears, format } from "date-fns"
import { useFightStore } from "@/stores/fight.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { useUiStore } from "@/stores/ui.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import { getBoxerDisplayName } from "@/utils/labels.utils"

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
        }
    },
    async mounted() {
        const boxerId = this.$route.params.id as string
        if (!this.tournamentStore.currentTournamentId || !boxerId) {
            return
        }
        this.boxer = await this.boxerStore.fetchBoxerById(boxerId)
        // this.opponents = await this.tournamentBoxerStore.fetchBoxerOpponents(
        //     this.boxer.id,
        //     this.tournamentStore.currentTournamentId
        // )
        // Watch for changes in fightStore.fights and refresh opponents
        watch(
            () => this.fightStore.fights,
            async () => {
                if (this.boxer && this.tournamentStore.currentTournamentId) {
                    this.opponents = await this.tournamentBoxerStore.fetchBoxerOpponents(
                        this.boxer.id,
                        this.tournamentStore.currentTournamentId
                    )
                }
            },
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
            const age = differenceInYears(new Date(), boxer.birthDate)
            const birthDate = format(boxer.birthDate, "dd/MM/yyyy")
            return `${birthDate} (${age})`
        },
    },
})
</script>
